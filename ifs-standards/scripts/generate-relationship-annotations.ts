// Rebuilds schema-level relationship metadata from canonical default RelationshipType objects.
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { format, resolveConfig } from 'prettier';
import { isAbstractEntity } from './entity-metadata';

interface Annotation {
  relationshipTypeId: string;
  endpoint: 'source' | 'target';
}

interface EntitySchema {
  properties?: { entityType?: { const?: string } };
  'x-ifs-relationships'?: Annotation[];
  [key: string]: unknown;
}

async function findSchemas(directory: string): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true });
  const paths = await Promise.all(
    entries.map((entry) => {
      const path = join(directory, entry.name);
      if (entry.isDirectory()) return findSchemas(path);
      return Promise.resolve(entry.isFile() && entry.name.endsWith('.schema.json') ? [path] : []);
    })
  );
  return paths.flat().sort();
}

export async function generateRelationshipAnnotations(entitiesDir: string, defaultsDir: string): Promise<number> {
  const schemas = await Promise.all(
    (await findSchemas(entitiesDir)).map(async (path) => {
      const original = await readFile(path, 'utf8');
      const schema = JSON.parse(original) as EntitySchema;
      return { path, original, schema };
    })
  );
  const entities = schemas
    .filter(({ schema }) => !isAbstractEntity(schema))
    .map(({ path, original, schema }) => {
      const type = schema.properties?.entityType?.const;
      if (!type) throw new Error(`Missing entityType.const in ${path}`);
      return { path, original, schema, type, annotations: [] as Annotation[] };
    });
  const byType = new Map(entities.map((entity) => [entity.type, entity]));
  if (byType.size !== entities.length) throw new Error('Duplicate entityType.const values in entity schemas');

  const ids = new Set<string>();
  const filenames = (await readdir(defaultsDir)).filter((name) => name.endsWith('.json')).sort();
  for (const filename of filenames) {
    const definition = JSON.parse(await readFile(join(defaultsDir, filename), 'utf8')) as Record<string, unknown>;
    const id = definition.id;
    if (typeof id !== 'string' || !/^RelationshipType\/[^/\s]+$/.test(id)) {
      throw new Error(`Invalid RelationshipType ID in ${filename}`);
    }
    if (definition.entityType !== 'RelationshipType') throw new Error(`Invalid entityType in ${filename}`);
    if (ids.has(id)) throw new Error(`Duplicate RelationshipType ID: ${id}`);
    ids.add(id);

    for (const [field, endpoint] of [
      ['sourceTypes', 'source'],
      ['targetTypes', 'target'],
    ] as const) {
      const types = definition[field];
      if (!Array.isArray(types) || types.length === 0 || new Set(types).size !== types.length) {
        throw new Error(`Invalid ${field} in ${filename}`);
      }
      for (const type of types) {
        const entity = typeof type === 'string' ? byType.get(type) : undefined;
        if (!entity) throw new Error(`Unknown entity type ${String(type)} in ${filename}.${field}`);
        entity.annotations.push({ relationshipTypeId: id, endpoint });
      }
    }
  }

  // Prepare all output before writing, so invalid input does not leave partially updated schemas.
  const outputs = await Promise.all(
    entities.map(async (entity) => {
      entity.annotations.sort(
        (left, right) =>
          left.relationshipTypeId.localeCompare(right.relationshipTypeId) || left.endpoint.localeCompare(right.endpoint)
      );
      entity.schema['x-ifs-relationships'] = entity.annotations;
      const config = await resolveConfig(entity.path);
      const content = await format(JSON.stringify(entity.schema), { ...config, filepath: entity.path });
      return { ...entity, content };
    })
  );
  for (const { path, original, content } of outputs) {
    if (content !== original) await writeFile(path, content);
  }
  return entities.length;
}

const scriptPath = fileURLToPath(import.meta.url);
if (process.argv[1] && resolve(process.argv[1]) === scriptPath) {
  const projectDir = join(dirname(scriptPath), '..');
  const count = await generateRelationshipAnnotations(
    join(projectDir, 'src/entities'),
    join(projectDir, 'src/defaults/relationship-type')
  );
  console.log(`Generated relationship annotations for ${count} entity schemas.`);
}
