import type { OpenAPIObject, SchemaObject } from '@nestjs/swagger';
import { entityContracts } from './surreal/entity-schemas.generated.js';
import { graphEdges } from './surreal/entity-storage.js';

type Schema = Record<string, unknown>;
type Mode = 'create' | 'response' | 'nested' | 'update';
const scalarKeywords = new Set([
  'title',
  'description',
  'format',
  'enum',
  'default',
  'readOnly',
  'writeOnly',
  'minimum',
  'maximum',
  'multipleOf',
  'minLength',
  'maxLength',
  'pattern',
  'minItems',
  'maxItems',
  'uniqueItems',
  'minProperties',
  'maxProperties',
]);
const annotations = new Set(['$schema', '$id', '$defs']);
const modelName = (schema: Schema) =>
  String(schema.title)
    .split(/[^A-Za-z0-9]+/)
    .filter(Boolean)
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join('');

// OpenAPI 3.0 is not JSON Schema 2020-12. Translate, never silently discard validation keywords.
export function toOpenApiSchema(
  value: unknown,
  mode: Mode = 'response',
): Schema {
  if (value === true) return {};
  if (value === false) return { not: {} };
  if (!value || typeof value !== 'object' || Array.isArray(value))
    throw new Error('Expected a JSON Schema object or boolean.');
  const schema = value as Schema;
  const result: Schema = {};
  const conditional: Schema[] = [];
  for (const [key, child] of Object.entries(schema)) {
    if (annotations.has(key) || key.startsWith('x-ifs-')) continue;
    if (scalarKeywords.has(key)) {
      result[key] = child;
      continue;
    }
    switch (key) {
      case '$ref': {
        const target = Object.values(entityContracts).find(
          (contract) => contract.$id === child,
        );
        if (!target)
          throw new Error(
            `Unsupported OpenAPI schema reference: ${String(child)}`,
          );
        const name = modelName(target);
        const component = {
          $ref: `#/components/schemas/${mode === 'response' ? `${name}ResponseDto` : `Nested${name}Dto`}`,
        };
        // Graph reads stop at cycles/depth limits with a canonical ID-only reference.
        const ref =
          mode === 'response'
            ? {
                anyOf: [
                  component,
                  {
                    type: 'object',
                    required: ['id'],
                    properties: {
                      id: toOpenApiSchema(
                        (target.properties as Schema).id,
                        mode,
                      ),
                    },
                    additionalProperties: false,
                  },
                ],
              }
            : component;
        // Reference Object siblings are ignored by OpenAPI 3.0: use allOf for intersections.
        if (Object.keys(schema).length === 1) return ref;
        conditional.push(ref);
        break;
      }
      case 'type': {
        const types = Array.isArray(child) ? child : [child];
        const nonNull = types.filter((type) => type !== 'null');
        if (nonNull.length === 1) result.type = nonNull[0];
        else if (nonNull.length > 1)
          conditional.push({
            anyOf: nonNull.map((type) => ({
              type,
              ...(types.includes('null') ? { nullable: true } : {}),
            })),
          });
        else {
          result.type = 'string';
          conditional.push({ type: 'string', nullable: true, enum: [null] });
        }
        if (types.includes('null')) result.nullable = true;
        break;
      }
      case 'const':
        if (Object.hasOwn(schema, 'enum')) conditional.push({ enum: [child] });
        else result.enum = [child];
        if (child === null) {
          result.type ??= 'string';
          result.nullable = true;
        }
        break;
      case 'examples':
        if (Array.isArray(child) && child.length) result.example = child[0];
        break;
      case 'properties':
        result.properties = Object.fromEntries(
          Object.entries(child as Schema).map(([name, definition]) => [
            name,
            toOpenApiSchema(definition, mode),
          ]),
        );
        break;
      case 'required':
        if ((child as unknown[]).length) result.required = child;
        break;
      case 'items':
      case 'not':
        result[key] = toOpenApiSchema(child, mode);
        break;
      case 'additionalProperties':
        result[key] =
          typeof child === 'boolean' ? child : toOpenApiSchema(child, mode);
        break;
      case 'allOf':
      case 'anyOf':
      case 'oneOf':
        result[key] = (child as unknown[]).map((branch) =>
          toOpenApiSchema(branch, mode),
        );
        break;
      case 'if': {
        const condition = toOpenApiSchema(child, mode);
        if (schema.then !== undefined)
          conditional.push({
            anyOf: [{ not: condition }, toOpenApiSchema(schema.then, mode)],
          });
        if (schema.else !== undefined)
          conditional.push({
            anyOf: [condition, toOpenApiSchema(schema.else, mode)],
          });
        break;
      }
      case 'then':
      case 'else':
        break; // JSON Schema ignores these without if.
      case 'exclusiveMinimum':
      case 'exclusiveMaximum': {
        const bound = key === 'exclusiveMinimum' ? 'minimum' : 'maximum';
        if (typeof child === 'number')
          conditional.push({ [bound]: child, [key]: true });
        else
          throw new Error(
            `Unsupported ${key}: expected a numeric JSON Schema bound.`,
          );
        break;
      }
      default:
        throw new Error(`Unsupported OpenAPI validation keyword: ${key}`);
    }
  }
  if (conditional.length)
    result.allOf = [...((result.allOf as Schema[]) ?? []), ...conditional];
  if (
    Object.keys(result).length === 1 &&
    Array.isArray(result.allOf) &&
    result.allOf.length === 1
  )
    return result.allOf[0] as Schema;
  return result;
}

function projectContract(contract: Schema, mode: Mode, table: string): Schema {
  const fields = contract.properties as Record<string, Schema>;
  const immutable: readonly string[] =
    mode === 'update' && table === 'relationship'
      ? graphEdges.relationship.immutable
      : [];
  const properties = Object.fromEntries(
    Object.entries(fields).filter(
      ([name, property]) =>
        !immutable.includes(name) &&
        !(mode === 'response' ? property.writeOnly : property.readOnly),
    ),
  );
  const projected: Schema = { ...contract, properties };
  if (mode === 'nested' || mode === 'update') {
    // PATCH and nested upserts validate the merged entity, not the standalone partial body.
    for (const key of [
      'required',
      'allOf',
      'anyOf',
      'oneOf',
      'if',
      'then',
      'else',
      'not',
    ])
      delete projected[key];
    projected.description = `${contract.description ?? contract.title}. Partial write; the complete resulting entity is validated before commit.`;
  } else if (Array.isArray(contract.required))
    projected.required = contract.required.filter((name) =>
      Object.hasOwn(properties, name),
    );
  if (mode === 'nested')
    properties.id = {
      type: ['string', 'null'],
      description:
        'Existing ID, or omit/use null or an empty string to create a new entity. ID-only objects link existing entities; supplied fields are merged or created.',
    };
  return projected;
}

export function applyEntityContracts(document: OpenAPIObject): OpenAPIObject {
  const schemas = document.components?.schemas;
  if (!schemas) return document;
  for (const [table, contract] of Object.entries(entityContracts)) {
    const name = modelName(contract);
    for (const [className, mode] of [
      [`Create${name}Dto`, 'create'],
      [`${name}ResponseDto`, 'response'],
      [`Nested${name}Dto`, 'nested'],
      [`Update${name}Dto`, 'update'],
    ] as const) {
      if (schemas[className])
        schemas[className] = toOpenApiSchema(
          projectContract(contract, mode, table),
          mode,
        ) as SchemaObject;
    }
  }
  return document;
}
