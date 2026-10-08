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
import { graphEdges } from './entity-storage.js';
import { entityTables } from './entity-tables.generated.js';

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
    if (
      record.id instanceof RecordId &&
      record.id.table.name === 'relationship'
    ) {
      result[graphEdges.relationship.source] = normalize(record.in);
      result[graphEdges.relationship.target] = normalize(record.out);
      delete result.in;
      delete result.out;
    }
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

  private entityRecord(value: unknown, expectedType?: string): RecordId {
    if (
      typeof value !== 'string' ||
      !/^[A-Z][A-Za-z0-9]*\/[^/\s]+$/.test(value)
    ) {
      throw new BadRequestException('A canonical EntityType/id is required.');
    }
    const type = value.split('/')[0];
    const table = Object.hasOwn(entityTables, type)
      ? entityTables[type]
      : undefined;
    if (!table || (expectedType && type !== expectedType)) {
      throw new BadRequestException(`Invalid entity type: ${type}.`);
    }
    // Existing CRUD stores the entire canonical ID as the record key.
    return new RecordId(table, value);
  }

  private async validateEdge(
    data: Document,
  ): Promise<{ source: RecordId; target: RecordId }> {
    const source = this.entityRecord(data.sourceId);
    const target = this.entityRecord(data.targetId);
    const typeRecord = this.entityRecord(
      data.relationshipTypeId,
      'RelationshipType',
    );
    const [sourceEntity, targetEntity, relationshipType] = await Promise.all([
      this.client.select(source),
      this.client.select(target),
      this.client.select<Document>(typeRecord),
    ]);
    if (!sourceEntity || !targetEntity || !relationshipType) {
      throw new BadRequestException(
        'Relationship endpoints and relationship type must exist.',
      );
    }
    const sourceType = (data.sourceId as string).split('/')[0];
    const targetType = (data.targetId as string).split('/')[0];
    if (
      !Array.isArray(relationshipType.sourceTypes) ||
      !relationshipType.sourceTypes.includes(sourceType) ||
      !Array.isArray(relationshipType.targetTypes) ||
      !relationshipType.targetTypes.includes(targetType)
    ) {
      throw new BadRequestException(
        'Endpoint types are not allowed by this relationship type.',
      );
    }
    if (
      data.type !== relationshipType.type ||
      data.inverseType !== relationshipType.inverseType
    ) {
      throw new BadRequestException(
        'Relationship names must match the selected relationship type.',
      );
    }
    return { source, target };
  }

  async createEdge<T>(
    table: string,
    data: object,
    relations: readonly Relation[] = [],
  ): Promise<T> {
    if (table !== 'relationship')
      throw new BadRequestException('Unknown edge table.');
    const input = data as Document;
    const record = this.entityRecord(input.id, 'Relationship');
    if (Object.hasOwn(input, 'in') || Object.hasOwn(input, 'out')) {
      throw new BadRequestException(
        'Use sourceId and targetId, not database edge fields.',
      );
    }
    const { source, target } = await this.validateEdge(input);
    const content = await this.content(data, relations);
    delete content[graphEdges.relationship.source];
    delete content[graphEdges.relationship.target];
    try {
      // Supply the ID in CONTENT to preserve duplicate-ID conflict semantics.
      await this.client.query(
        'RELATE $source->relationship->$target CONTENT $data;',
        {
          source,
          target,
          data: { ...content, id: record },
        },
      );
    } catch (error) {
      if (error instanceof AlreadyExistsError)
        throw new ConflictException(`${table} ${input.id} already exists.`);
      throw error;
    }
    return (await this.findOne<T>(table, input.id as string, relations))!;
  }

  async updateEdge<T>(
    table: string,
    id: string,
    data: object,
    relations: readonly Relation[] = [],
  ): Promise<T> {
    if (table !== 'relationship')
      throw new BadRequestException('Unknown edge table.');
    const current = await this.findOne<Document>(table, id, relations);
    if (!current) throw new NotFoundException(`${table} not found.`);
    await this.validateEdge({ ...current, ...data });
    return this.update<T>(table, id, data, relations);
  }

  async create<T>(
    table: string,
    data: object,
    relations: readonly Relation[] = [],
  ): Promise<T> {
    if (table in graphEdges)
      throw new BadRequestException('Graph edges must be created with RELATE.');
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
    if (
      table in graphEdges &&
      [...graphEdges.relationship.immutable, 'in', 'out'].some((key) =>
        Object.hasOwn(data, key),
      )
    ) {
      throw new BadRequestException(
        'Relationship endpoints are immutable; delete and recreate the edge.',
      );
    }
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
