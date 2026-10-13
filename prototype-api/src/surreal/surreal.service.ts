import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import {
  AlreadyExistsError,
  QueryError,
  RecordId,
  Surreal,
  Table,
} from 'surrealdb';
import type { SurrealQueryable } from 'surrealdb';
import { getDatabaseConfig } from './database.config.js';
import { EntityValidator, validateStoredGraph } from './entity-validation.js';
import { entityContracts } from './entity-schemas.generated.js';
import { assertEntityType } from './entity-type.js';
import { graphEdges } from './entity-storage.js';
import { entityRelations, entityTables } from './entity-tables.generated.js';
import {
  missingNestedReference,
  missingNestedRoot,
  planNestedWrite,
} from './nested-write.js';
import { RelationsQueryDto } from './relations-query.dto.js';

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
  private readonly validator = new EntityValidator();

  async onModuleInit(): Promise<void> {
    const { endpoint, ...options } = getDatabaseConfig();
    // The SDK's interactive transactions require WebSocket RPC. Keep the configured
    // host/path/database, converting HTTP(S) to its WebSocket equivalent for the API.
    const rpcUrl = new URL(endpoint);
    if (rpcUrl.protocol === 'http:') rpcUrl.protocol = 'ws:';
    if (rpcUrl.protocol === 'https:') rpcUrl.protocol = 'wss:';
    try {
      await this.client.connect(rpcUrl.href, options);
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

  private async expand(
    record: Document,
    relations: readonly Relation[],
    ancestors = new Set<string>(),
  ): Promise<Document> {
    const identity =
      record.id instanceof RecordId ? String(record.id) : undefined;
    if (identity && ancestors.has(identity))
      return { id: normalize(record.id) };
    if (ancestors.size >= 32) return { id: normalize(record.id) };
    const next = new Set(ancestors);
    if (identity) next.add(identity);
    const result = { ...record };
    for (const { property, table, isArray } of relations) {
      const value = result[property];
      if (value === undefined || value === null) continue;
      const expandChild = async (child: unknown): Promise<unknown> => {
        const document =
          child instanceof RecordId
            ? await this.client.select<Document>(child)
            : child;
        if (!document || typeof document !== 'object') return document;
        return this.expand(
          document as Document,
          entityRelations[table] ?? [],
          next,
        );
      };
      result[property] =
        isArray && Array.isArray(value)
          ? await Promise.all(value.map(expandChild))
          : await expandChild(value);
    }
    return result;
  }

  private async executeWrite(
    client: SurrealQueryable,
    sql: string,
    bindings: Record<string, unknown>,
  ): Promise<void> {
    const responses = await client.query(sql, bindings).responses();
    const errors = responses.flatMap((response) =>
      response.success ? [] : [response.error],
    );
    const failure =
      errors.find(
        (error) => !(error instanceof QueryError && error.isNotExecuted),
      ) ?? errors[0];
    if (failure) throw failure;
  }

  // Generated HTTP resources use these validated entry points. Raw CRUD below is
  // the low-level storage adapter, also used by persistence tests and provisioning.
  async createEntity<T>(
    table: string,
    data: object,
    relations: readonly Relation[] = entityRelations[table] ?? [],
  ): Promise<T> {
    this.assertWriteType(table, data, false);
    const id = (data as Document).id;
    if (typeof id !== 'string' || !id.trim())
      throw new BadRequestException('A nonempty string ID is required.');
    return this.writeEntity<T>(table, id, data, relations, false);
  }

  async updateEntity<T>(
    table: string,
    id: string,
    data: object,
    relations: readonly Relation[] = entityRelations[table] ?? [],
  ): Promise<T> {
    this.assertWriteType(table, data, true);
    const suppliedId = (data as Document).id;
    if (suppliedId !== undefined && suppliedId !== id)
      throw new BadRequestException('Record IDs cannot be changed.');
    return this.writeEntity<T>(table, id, data, relations, true);
  }

  private assertWriteType(table: string, data: object, partial: boolean): void {
    const contract = Object.hasOwn(entityContracts, table)
      ? entityContracts[table]
      : undefined;
    if (!contract)
      throw new BadRequestException(`Unknown entity table: ${table}.`);
    const discriminator = (
      contract.properties as Record<string, { const: string }>
    ).entityType.const;
    assertEntityType(data, discriminator, partial);
  }

  private async writeEntity<T>(
    table: string,
    id: string,
    data: object,
    relations: readonly Relation[],
    update: boolean,
  ): Promise<T> {
    if (
      table in graphEdges &&
      [...graphEdges.relationship.immutable, 'in', 'out'].some((key) =>
        Object.hasOwn(data, key),
      ) &&
      update
    )
      throw new BadRequestException(
        'Relationship endpoints are immutable; delete and recreate the edge.',
      );
    if (
      table in graphEdges &&
      (Object.hasOwn(data, 'in') || Object.hasOwn(data, 'out'))
    )
      throw new BadRequestException(
        'Use sourceId and targetId, not database edge fields.',
      );
    const transaction = await this.client.beginTransaction();
    try {
      const record = new RecordId(table, id);
      if (update && !(await transaction.select(record)))
        throw new NotFoundException(`${table} not found.`);
      let records: RecordId[];
      if (table in graphEdges) {
        const current = update
          ? await transaction.select<Document>(record)
          : undefined;
        const publicCurrent = current
          ? this.response<Document>(current, relations)
          : {};
        const { source, target } = await this.validateEdge(
          { ...publicCurrent, ...data },
          transaction,
        );
        const content = { ...data } as Document;
        delete content.id;
        delete content.sourceId;
        delete content.targetId;
        await this.executeWrite(
          transaction,
          update
            ? 'UPDATE $record MERGE $data;'
            : 'RELATE $source->relationship->$target CONTENT $data;',
          {
            record,
            source,
            target,
            data: update ? content : { ...content, id: record },
          },
        );
        records = [record];
      } else {
        const plan = planNestedWrite(table, id, data, relations, update);
        await this.executeWrite(
          transaction,
          plan.transactionSql,
          plan.bindings,
        );
        records = plan.records;
      }
      await validateStoredGraph(transaction, records, this.validator);
      await transaction.commit();
    } catch (error) {
      await transaction.cancel().catch(() => undefined);
      const message = error instanceof Error ? error.message : String(error);
      if (message.includes(missingNestedReference))
        throw new BadRequestException(
          'An ID-only nested reference does not exist.',
        );
      if (message.includes(missingNestedRoot))
        throw new NotFoundException(`${table} not found.`);
      if (error instanceof AlreadyExistsError)
        throw new ConflictException(`${table} ${id} already exists.`);
      throw error;
    }
    return (await this.findOne<T>(table, id, relations))!;
  }

  private async writeNested(
    table: string,
    id: string,
    data: object,
    relations: readonly Relation[],
    update: boolean,
  ): Promise<void> {
    const { sql, bindings } = planNestedWrite(
      table,
      id,
      data,
      relations,
      update,
    );
    try {
      await this.executeWrite(this.client, sql, bindings);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      if (message.includes(missingNestedReference))
        throw new BadRequestException(
          'An ID-only nested reference does not exist.',
        );
      if (message.includes(missingNestedRoot))
        throw new NotFoundException(`${table} not found.`);
      if (error instanceof AlreadyExistsError)
        throw new ConflictException(`${table} ${id} already exists.`);
      throw error;
    }
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
    return Promise.all(
      records.map(async (record) =>
        this.response<T>(await this.expand(record, relations), relations),
      ),
    );
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
    return records[0]
      ? this.response<T>(await this.expand(records[0], relations), relations)
      : null;
  }

  async findRelations<T>(
    table: string,
    id: string,
    query: RelationsQueryDto = {},
  ): Promise<T[]> {
    const direction = query.direction ?? 'both';
    if (!['both', 'incoming', 'outgoing'].includes(direction)) {
      throw new BadRequestException('Invalid relation direction.');
    }
    let filters: Document = {};
    if (query.filter !== undefined) {
      if (typeof query.filter !== 'string' || query.filter.length > 16_384) {
        throw new BadRequestException(
          'filter must be a JSON object string (at most 16 KiB).',
        );
      }
      try {
        const parsed: unknown = JSON.parse(query.filter);
        if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
          throw new Error('Not an object');
        }
        filters = parsed as Document;
      } catch {
        throw new BadRequestException('filter must be a JSON object string.');
      }
    }
    const entries = Object.entries(filters);
    if (entries.length > 100) {
      throw new BadRequestException(
        'At most 100 equality filters are allowed.',
      );
    }
    const bindings: Document = {
      record: new RecordId(table, id),
      table: new Table('relationship'),
    };
    const association =
      direction === 'incoming'
        ? 'out = $record'
        : direction === 'outgoing'
          ? 'in = $record'
          : '(in = $record OR out = $record)';
    const conditions = [association];
    entries.forEach(([key, value], index) => {
      let path = key;
      if (path === 'sourceId' || path === 'in.id') path = 'in';
      if (path === 'targetId' || path === 'out.id') path = 'out';
      const segments = path.split('.');
      if (
        segments.length > 8 ||
        !segments.every((segment) => /^[A-Za-z_][A-Za-z0-9_]*$/.test(segment))
      ) {
        throw new BadRequestException(`Invalid filter field: ${key}.`);
      }
      // Quote every identifier and bind every value: filters never supply SQL.
      const field = segments.map((segment) => `\`${segment}\``).join('.');
      bindings[`filter${index}`] = ['in', 'out', 'id'].includes(path)
        ? this.entityRecord(value, path === 'id' ? 'Relationship' : undefined)
        : value;
      conditions.push(`${field} = $filter${index}`);
    });
    if (!(await this.client.select(bindings.record as RecordId))) {
      throw new NotFoundException(`${table} not found.`);
    }
    const [records] = await this.client.query<[Document[]]>(
      `SELECT * FROM $table WHERE ${conditions.join(' AND ')};`,
      bindings,
    );
    return records.map((record) => this.response<T>(record, []));
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
    client: SurrealQueryable = this.client,
  ): Promise<{ source: RecordId; target: RecordId }> {
    const source = this.entityRecord(data.sourceId);
    const target = this.entityRecord(data.targetId);
    const typeRecord = this.entityRecord(
      data.relationshipTypeId,
      'RelationshipType',
    );
    const [sourceEntity, targetEntity, relationshipType] = await Promise.all([
      client.select(source),
      client.select(target),
      client.select<Document>(typeRecord),
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
    if (relations.some((relation) => !relation.readOnly)) {
      await this.writeNested(table, id, data, relations, false);
      return (await this.findOne<T>(table, id, relations))!;
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
    if (relations.some((relation) => !relation.readOnly)) {
      await this.writeNested(table, id, data, relations, true);
      return (await this.findOne<T>(table, id, relations))!;
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
