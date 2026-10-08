import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { AlreadyExistsError, RecordId, Surreal, Table } from 'surrealdb';
import { getDatabaseConfig } from './database.config.js';

export interface Relation {
  property: string;
  table: string;
  isArray: boolean;
  readOnly: boolean;
}

type Document = Record<string, unknown>;

// Keep record identifiers internal: the HTTP contract uses plain string IDs.
function normalize(value: unknown): unknown {
  if (value instanceof RecordId) return String(value.id);
  if (Array.isArray(value)) return value.map(normalize);
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, normalize(item)]),
    );
  }
  return value;
}

@Injectable()
export class SurrealService implements OnModuleInit, OnModuleDestroy {
  readonly client = new Surreal();

  async onModuleInit(): Promise<void> {
    const { endpoint, ...options } = getDatabaseConfig();
    try {
      await this.client.connect(endpoint, options);
    } catch (error) {
      await this.client.close();
      throw error;
    }
  }

  async onModuleDestroy(): Promise<void> {
    await this.client.close();
  }

  private fetchClause(relations: readonly Relation[]): string {
    for (const { property } of relations) {
      if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(property)) {
        throw new Error(`Invalid relation property: ${property}`);
      }
    }
    return relations.length
      ? ` FETCH ${relations.map(({ property }) => property).join(', ')}`
      : '';
  }

  private response<T>(record: Document, relations: readonly Relation[]): T {
    const result = normalize(record) as Document;
    for (const { property, isArray } of relations) {
      if (result[property] === undefined)
        result[property] = isArray ? [] : null;
    }
    return result as T;
  }

  private async content(
    data: object,
    relations: readonly Relation[],
  ): Promise<Document> {
    const result: Document = { ...data };
    delete result.id;
    for (const { property, table, isArray, readOnly } of relations) {
      if (readOnly) {
        delete result[property];
        continue;
      }
      const value = result[property];
      if (value === undefined || value === null) continue;
      if (isArray && !Array.isArray(value)) {
        throw new BadRequestException(`${property} must be an array.`);
      }
      const records = await Promise.all(
        (isArray ? (value as unknown[]) : [value]).map(async (item) => {
          const id = (item as Document | null)?.id;
          if (typeof id !== 'string' || !id.trim()) {
            throw new BadRequestException(
              `${property} must reference an entity with a string ID.`,
            );
          }
          const record = new RecordId(table, id);
          if (!(await this.client.select(record))) {
            throw new BadRequestException(
              `Referenced ${table} ${id} does not exist.`,
            );
          }
          return record;
        }),
      );
      result[property] = isArray ? records : records[0];
    }
    return result;
  }

  async findAll<T>(
    table: string,
    relations: readonly Relation[] = [],
  ): Promise<T[]> {
    const [records] = await this.client.query<[Document[]]>(
      `SELECT * FROM $table${this.fetchClause(relations)};`,
      { table: new Table(table) },
    );
    return records.map((record) => this.response<T>(record, relations));
  }

  async findOne<T>(
    table: string,
    id: string,
    relations: readonly Relation[] = [],
  ): Promise<T | null> {
    const [records] = await this.client.query<[Document[]]>(
      `SELECT * FROM $record${this.fetchClause(relations)};`,
      { record: new RecordId(table, id) },
    );
    return records[0] ? this.response<T>(records[0], relations) : null;
  }

  async create<T>(
    table: string,
    data: object,
    relations: readonly Relation[] = [],
  ): Promise<T> {
    const id = (data as Document).id;
    if (typeof id !== 'string' || !id.trim()) {
      throw new BadRequestException('A nonempty string ID is required.');
    }
    try {
      await this.client.query('CREATE $record CONTENT $data;', {
        record: new RecordId(table, id),
        data: await this.content(data, relations),
      });
    } catch (error) {
      if (error instanceof AlreadyExistsError) {
        throw new ConflictException(`${table} ${id} already exists.`);
      }
      throw error;
    }
    return (await this.findOne<T>(table, id, relations))!;
  }

  async update<T>(
    table: string,
    id: string,
    data: object,
    relations: readonly Relation[] = [],
  ): Promise<T> {
    const suppliedId = (data as Document).id;
    if (suppliedId !== undefined && suppliedId !== id) {
      throw new BadRequestException('Record IDs cannot be changed.');
    }
    // UPDATE (not UPSERT) must never create a missing record.
    const [records] = await this.client.query<[Document[]]>(
      'UPDATE $record MERGE $data RETURN AFTER;',
      {
        record: new RecordId(table, id),
        data: await this.content(data, relations),
      },
    );
    if (!records.length) throw new NotFoundException(`${table} not found.`);
    return (await this.findOne<T>(table, id, relations))!;
  }

  async remove<T>(
    table: string,
    id: string,
    relations: readonly Relation[] = [],
  ): Promise<T> {
    const previous = await this.findOne<T>(table, id, relations);
    const [records] = await this.client.query<[Document[]]>(
      'DELETE $record RETURN BEFORE;',
      {
        record: new RecordId(table, id),
      },
    );
    if (!records.length || !previous)
      throw new NotFoundException(`${table} not found.`);
    return previous;
  }
}
