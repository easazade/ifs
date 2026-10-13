import { readFileSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import type { JSONSchema7, JSONSchema7Definition } from 'json-schema';
import { isAbstractEntity } from './entity-metadata.ts';

// Tooling gets an effective field view; validators retain the original allOf constraints.
export type EntitySchema = JSONSchema7 & {
  'x-ifs-abstract'?: boolean;
  $defs?: Record<string, JSONSchema7Definition>;
};
export type EntitySchemas = ReadonlyMap<string, EntitySchema>;

// Tooling may inline local definitions, but validators must keep the original document.
// Walk schema keywords only: defaults/examples can contain arbitrary JSON, including $refs.
export function resolveLocalRefs<T>(property: T, document: unknown, ancestors = new Set<string>()): T {
  if (!property || typeof property !== 'object') return property;
  const schema = property as Record<string, unknown>;
  if (typeof schema.$ref === 'string' && schema.$ref.startsWith('#/')) {
    const ref = schema.$ref;
    if (ancestors.has(ref)) throw new Error(`Circular local schema reference: ${ref}`);
    const target = decodeURIComponent(ref.slice(1))
      .slice(1)
      .split('/')
      .map((part) => part.replaceAll('~1', '/').replaceAll('~0', '~'))
      .reduce<unknown>((value, key) => {
        if (!value || typeof value !== 'object' || !Object.hasOwn(value, key)) return undefined;
        return (value as Record<string, unknown>)[key];
      }, document);
    if (
      target === undefined ||
      target === null ||
      Array.isArray(target) ||
      (typeof target !== 'object' && typeof target !== 'boolean')
    )
      throw new Error(`Unknown or unsupported local schema reference: ${ref}`);
    const next = new Set(ancestors).add(ref);
    const base = resolveLocalRefs(target, document, next);
    const siblings = { ...schema };
    delete siblings.$ref;
    const own = resolveLocalRefs(siblings, document, next);
    if (typeof base === 'boolean') return { ...own, allOf: [base, ...((own.allOf as unknown[]) ?? [])] } as T;
    const annotations = new Set(['description', 'title', 'default', 'examples', 'readOnly', 'writeOnly', 'deprecated']);
    const definition = base as Record<string, unknown>;
    const conflict = Object.keys(definition).some(
      (key) => !annotations.has(key) && key in own && JSON.stringify(definition[key]) !== JSON.stringify(own[key])
    );
    return (conflict ? { ...definition, ...own, allOf: [definition, own] } : { ...definition, ...own }) as T;
  }
  const result = { ...schema };
  for (const key of ['allOf', 'anyOf', 'oneOf', 'prefixItems']) {
    if (Array.isArray(result[key]))
      result[key] = result[key].map((branch) => resolveLocalRefs(branch, document, ancestors));
  }
  for (const key of ['items', 'additionalProperties', 'not', 'if', 'then', 'else', 'contains']) {
    if (result[key] !== undefined) result[key] = resolveLocalRefs(result[key], document, ancestors);
  }
  for (const key of ['properties', 'patternProperties', 'dependentSchemas']) {
    if (result[key])
      result[key] = Object.fromEntries(
        Object.entries(result[key] as Record<string, unknown>).map(([name, value]) => [
          name,
          resolveLocalRefs(value, document, ancestors),
        ])
      );
  }
  return result as T;
}

// Flatten only abstract inheritance; preserve inherited and own object-level constraints.
export function entityContract(schema: EntitySchema, schemas: EntitySchemas): EntitySchema {
  const effective = resolveEntitySchema(schema, schemas);
  const constraints = (schema.allOf ?? []).flatMap((branch) => {
    if (typeof branch !== 'object' || !branch.$ref) return [branch];
    const base = schemas.get(branch.$ref);
    if (!base || !isAbstractEntity(base)) throw new Error(`Unknown abstract base: ${branch.$ref}`);
    const inherited = entityContract(base, schemas);
    const rules = { ...inherited };
    for (const key of ['properties', 'required', '$id', '$schema', '$defs', 'title', 'description'])
      delete (rules as Record<string, unknown>)[key];
    // Effective fields already carry inherited types/requiredness; retain only additional rules.
    if (rules.type === effective.type) delete rules.type;
    if (rules.additionalProperties === true) delete rules.additionalProperties;
    for (const key of Object.keys(rules)) if (key.startsWith('x-ifs-')) delete (rules as Record<string, unknown>)[key];
    return Object.keys(rules).length ? [rules] : [];
  });
  const result = { ...effective };
  if (constraints.length) result.allOf = constraints;
  else delete result.allOf;
  return resolveLocalRefs(result, schema);
}

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
      const resolved = resolveLocalRefs(definition, base);
      properties[name] = name in properties ? refineProperty(properties[name]!, resolved) : resolved;
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
