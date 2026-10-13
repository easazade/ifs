import { BadRequestException } from '@nestjs/common';
import { Ajv2020 } from 'ajv/dist/2020.js';
import { createRequire } from 'node:module';
import type { FormatsPlugin } from 'ajv-formats';
const addFormats: FormatsPlugin = createRequire(import.meta.url)('ajv-formats');
import type { ValidateFunction } from 'ajv';
import { RecordId } from 'surrealdb';
import type { SurrealQueryable } from 'surrealdb';
import { entityContracts, entitySchemas } from './entity-schemas.generated.js';
import { entityRelations } from './entity-tables.generated.js';

type Schema = Record<string, unknown>;
type Document = Record<string, unknown>;

// Persisted graphs use record links, not infinitely embedded JSON documents.
// Validate each linked entity separately; keep all canonical scalar/object rules and $defs.
export function graphSchema(value: unknown): unknown {
  if (!value || typeof value !== 'object') return value;
  const schema = value as Schema;
  const result = { ...schema };
  if (
    typeof schema.$ref === 'string' &&
    entitySchemas[schema.$ref] &&
    !entitySchemas[schema.$ref]['x-ifs-abstract']
  ) {
    const annotations = new Set([
      '$ref',
      'description',
      'title',
      'readOnly',
      'writeOnly',
      'default',
      'examples',
    ]);
    const unsupported = Object.keys(schema).find(
      (key) => !annotations.has(key) && !key.startsWith('x-ifs-'),
    );
    if (unsupported)
      throw new Error(
        `Unsupported inline entity-reference restriction: ${unsupported}. Put the rule on the target entity schema.`,
      );
    const target = Object.values(entityContracts).find(
      (contract) => contract.$id === schema.$ref,
    );
    if (!target) throw new Error(`Missing entity contract for ${schema.$ref}`);
    delete result.$ref;
    result.allOf = [
      {
        type: 'object',
        properties: { id: (target.properties as Schema).id },
        required: ['id'],
      },
      ...((schema.allOf as unknown[]) ?? []),
    ];
  }
  for (const key of [
    'properties',
    '$defs',
    'patternProperties',
    'dependentSchemas',
  ]) {
    if (result[key])
      result[key] = Object.fromEntries(
        Object.entries(result[key] as Schema).map(([name, child]) => [
          name,
          graphSchema(child),
        ]),
      );
  }
  for (const key of ['allOf', 'anyOf', 'oneOf', 'prefixItems']) {
    if (Array.isArray(result[key])) result[key] = result[key].map(graphSchema);
  }
  for (const key of [
    'items',
    'additionalProperties',
    'if',
    'then',
    'else',
    'not',
    'contains',
  ]) {
    if (result[key] !== undefined) result[key] = graphSchema(result[key]);
  }
  return result;
}

export class EntityValidator {
  private readonly validators = new Map<string, ValidateFunction>();

  constructor() {
    const ajv = new Ajv2020({
      allErrors: true,
      strict: true,
      strictRequired: false,
    });
    for (const [keyword, schemaType] of [
      ['x-ifs-relationships', 'array'],
      ['x-ifs-id', 'boolean'],
      ['x-ifs-abstract', 'boolean'],
    ] as const)
      ajv.addKeyword({ keyword, schemaType, valid: true });
    addFormats(ajv);
    for (const schema of Object.values(entitySchemas))
      ajv.addSchema(graphSchema(schema) as Schema);
    for (const [table, contract] of Object.entries(entityContracts)) {
      const validate = ajv.getSchema(String(contract.$id));
      if (!validate) throw new Error(`Missing entity validator: ${table}`);
      this.validators.set(table, validate);
    }
  }

  validate(table: string, document: Document): void {
    const validate = this.validators.get(table);
    if (!validate)
      throw new BadRequestException(`Unknown entity table: ${table}.`);
    const entityId = document.id;
    if (!validate(document))
      throw new BadRequestException({
        message: 'Entity schema validation failed.',
        entityId,
        errors: (validate.errors ?? [])
          .slice(0, 20)
          .map(({ instancePath, keyword, message, params }) => ({
            instancePath,
            keyword,
            message,
            params,
          })),
      });
  }
}

// Read and validate in the same transaction as the writes: PATCH sees merged state,
// references see newly created/updated children, and invalid graphs never commit.
export async function validateStoredGraph(
  client: SurrealQueryable,
  roots: readonly RecordId[],
  validator: EntityValidator,
): Promise<void> {
  const queue = [...roots];
  const seen = new Set<string>();
  for (let index = 0; index < queue.length; index++) {
    const record = queue[index];
    const identity = String(record);
    if (seen.has(identity)) continue;
    if (seen.size >= 1000)
      throw new BadRequestException('Validation graph exceeds 1,000 entities.');
    seen.add(identity);
    const stored = await client.select<Document>(record);
    if (!stored)
      throw new BadRequestException(
        `Referenced entity ${String(record.id)} does not exist.`,
      );
    const document: Document = { ...stored, id: String(record.id) };
    if (record.table.name === 'relationship') {
      document.sourceId =
        stored.in instanceof RecordId ? String(stored.in.id) : stored.in;
      document.targetId =
        stored.out instanceof RecordId ? String(stored.out.id) : stored.out;
      delete document.in;
      delete document.out;
    }
    for (const { property, table, isArray, readOnly } of entityRelations[
      record.table.name
    ] ?? []) {
      const value = document[property];
      // Read-only relations are server-derived; absent collections have the same [] view as reads.
      if (value === undefined && readOnly && isArray) {
        document[property] = [];
        continue;
      }
      if (value === undefined || value === null) continue;
      const reference = (item: unknown): unknown => {
        if (!(item instanceof RecordId)) {
          if (
            item &&
            typeof item === 'object' &&
            typeof (item as Document).id === 'string'
          ) {
            queue.push(new RecordId(table, (item as Document).id as string));
            return { id: (item as Document).id };
          }
          return item;
        }
        if (item.table.name !== table)
          throw new BadRequestException(
            `${property} links the wrong entity type.`,
          );
        queue.push(item);
        return { id: String(item.id) };
      };
      document[property] =
        isArray && Array.isArray(value)
          ? value.map(reference)
          : reference(value);
    }
    validator.validate(record.table.name, document);
  }
}
