import { readFileSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import type { JSONSchema7, JSONSchema7Definition } from 'json-schema';
import { isAbstractEntity } from './entity-metadata.ts';

// Tooling gets an effective field view; validators retain the original allOf constraints.
export type EntitySchema = JSONSchema7 & { 'x-ifs-abstract'?: boolean };
export type EntitySchemas = ReadonlyMap<string, EntitySchema>;

export function readEntitySchemas(root: string): Map<string, EntitySchema> {
  const schemas = new Map<string, EntitySchema>();
  function visit(directory: string) {
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      const path = join(directory, entry.name);
      if (entry.isDirectory()) visit(path);
      else if (entry.isFile() && entry.name.endsWith('.schema.json')) {
        const schema = JSON.parse(readFileSync(path, 'utf8')) as EntitySchema;
        if (!schema.$id) throw new Error(`Missing schema $id in ${path}`);
        if (schemas.has(schema.$id)) throw new Error(`Duplicate schema $id: ${schema.$id}`);
        schemas.set(schema.$id, schema);
      }
    }
  }
  visit(root);
  return schemas;
}

function refineProperty(base: JSONSchema7Definition, own: JSONSchema7Definition): JSONSchema7Definition {
  if (typeof base !== 'object' || typeof own !== 'object') {
    throw new Error('Base entity property refinements must be object schemas');
  }
  if (base.type && own.type && JSON.stringify(base.type) !== JSON.stringify(own.type)) {
    throw new Error('Conflicting base entity property types');
  }
  // Annotations may change; overlapping validation constraints must remain an intersection.
  const annotations = new Set(['description', 'title', 'default', 'readOnly', 'writeOnly', 'deprecated', 'x-ifs-id']);
  const conflict = Object.keys(base).some(
    (key) =>
      !annotations.has(key) &&
      key in own &&
      JSON.stringify(base[key as keyof JSONSchema7]) !== JSON.stringify(own[key as keyof JSONSchema7])
  );
  return conflict ? { ...base, ...own, allOf: [base, own] } : { ...base, ...own };
}

export function resolveEntitySchema(
  schema: EntitySchema,
  schemas: EntitySchemas,
  ancestors = new Set<string>()
): EntitySchema {
  if (schema.$id && ancestors.has(schema.$id)) throw new Error(`Circular base schema reference: ${schema.$id}`);
  const next = new Set(ancestors);
  if (schema.$id) next.add(schema.$id);
  const properties: NonNullable<JSONSchema7['properties']> = {};
  const required = new Set<string>();

  for (const branch of schema.allOf ?? []) {
    // Conditional branches (e.g. ChangeItem operation rules) stay untouched, not flattened.
    if (typeof branch !== 'object' || !branch.$ref) continue;
    if (Object.keys(branch).some((key) => key !== '$ref'))
      throw new Error('Base references must be standalone allOf branches');
    const base = schemas.get(branch.$ref);
    if (!base) throw new Error(`Unknown local base schema: ${branch.$ref}`);
    if (!isAbstractEntity(base) || base.type !== 'object' || base.additionalProperties !== true) {
      throw new Error(`Composition requires an open abstract object schema: ${branch.$ref}`);
    }
    const inherited = resolveEntitySchema(base, schemas, next);
    for (const [name, definition] of Object.entries(inherited.properties ?? {})) {
      properties[name] = name in properties ? refineProperty(properties[name]!, definition) : definition;
    }
    for (const name of inherited.required ?? []) required.add(name);
  }

  for (const [name, definition] of Object.entries(schema.properties ?? {})) {
    properties[name] = name in properties ? refineProperty(properties[name]!, definition) : definition;
  }
  for (const name of schema.required ?? []) required.add(name);
  return { ...schema, properties, required: [...required] };
}

export function readEntitySchema(path: string, root = dirname(dirname(path))): EntitySchema {
  const schema = JSON.parse(readFileSync(path, 'utf8')) as EntitySchema;
  return resolveEntitySchema(schema, readEntitySchemas(root));
}
