import type { JSONSchema7 } from 'json-schema';
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { basename, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { format } from 'prettier';

const SCRIPTS_DIR = dirname(fileURLToPath(import.meta.url));
const PROJECT_DIR = join(SCRIPTS_DIR, '..');
const ENTITIES_DIR = join(PROJECT_DIR, 'src/entities');
const OUTPUT_PATH = join(SCRIPTS_DIR, 'entity-relations.json');

interface EntitySchema {
  name: string;
  schemaId?: string;
  filePath: string;
  schema: JSONSchema7;
}

// Like a Dart record, this preserves both ends of each property-level relation.
interface EntityRelation {
  property: string;
  type: string;
}

type EntityRelations = Record<string, EntityRelation[]>;

const schemaFiles = await findSchemaFiles(ENTITIES_DIR);
const entities = await readEntities(schemaFiles);
const entityByReference = indexEntities(entities);
const relations = buildRelations(entities, entityByReference);

const output = await format(JSON.stringify(relations), { parser: 'json' });
await writeFile(OUTPUT_PATH, output);
console.log(`Generated ${OUTPUT_PATH} from ${entities.length} entity schemas.`);

async function findSchemaFiles(directory: string): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true });
  const nestedFiles = await Promise.all(
    entries.map(async (entry) => {
      const entryPath = join(directory, entry.name);

      if (entry.isDirectory()) return findSchemaFiles(entryPath);
      return entry.isFile() && entry.name.endsWith('.schema.json') ? [entryPath] : [];
    })
  );

  return nestedFiles.flat().sort();
}

async function readEntities(filePaths: string[]): Promise<EntitySchema[]> {
  const entities = await Promise.all(
    filePaths.map(async (filePath) => {
      const schema = JSON.parse(await readFile(filePath, 'utf8')) as JSONSchema7;

      return {
        name: schema.title || basename(filePath, '.schema.json'),
        schemaId: schema.$id,
        filePath,
        schema,
      };
    })
  );

  return entities.sort((left, right) => left.name.localeCompare(right.name));
}

function indexEntities(entities: EntitySchema[]): Map<string, EntitySchema> {
  const index = new Map<string, EntitySchema>();

  for (const entity of entities) {
    if (entity.schemaId) index.set(stripHash(entity.schemaId), entity);
    index.set(basename(entity.filePath, '.schema.json'), entity);
  }

  return index;
}

function buildRelations(entities: EntitySchema[], entityByReference: Map<string, EntitySchema>): EntityRelations {
  return Object.fromEntries(
    entities.map((entity) => {
      const relationsByPropertyAndType = new Map<string, EntityRelation>();

      for (const [property, propertySchema] of Object.entries(entity.schema.properties ?? {})) {
        for (const reference of collectReferences(propertySchema)) {
          const relatedEntity = resolveEntityReference(reference, entity, entityByReference);
          if (!relatedEntity) continue;

          const relation = { property, type: relatedEntity.name };
          relationsByPropertyAndType.set(`${property}\0${relatedEntity.name}`, relation);
        }
      }

      const entityRelations = [...relationsByPropertyAndType.values()].sort(
        (left, right) => left.property.localeCompare(right.property) || left.type.localeCompare(right.type)
      );

      return [entity.name, entityRelations];
    })
  );
}

// Recursive walking finds direct schema references inside arrays and schema compositions.
function collectReferences(value: unknown): string[] {
  if (Array.isArray(value)) return value.flatMap(collectReferences);
  if (!value || typeof value !== 'object') return [];

  const object = value as Record<string, unknown>;
  const references = typeof object.$ref === 'string' ? [object.$ref] : [];

  return references.concat(
    Object.entries(object)
      .filter(([key]) => key !== '$ref')
      .flatMap(([, child]) => collectReferences(child))
  );
}

function resolveEntityReference(
  reference: string,
  source: EntitySchema,
  entityByReference: Map<string, EntitySchema>
): EntitySchema | undefined {
  const referenceWithoutHash = stripHash(reference);

  // A fragment-only ref points to a definition inside this schema, not another entity type.
  if (!referenceWithoutHash) return undefined;

  const exactMatch = entityByReference.get(referenceWithoutHash);
  if (exactMatch) return exactMatch;

  const schemaName = getReferencedSchemaName(referenceWithoutHash);
  const fileMatch = entityByReference.get(schemaName);
  if (fileMatch) return fileMatch;

  if (referenceWithoutHash.endsWith('.schema.json')) {
    throw new Error(`Unknown entity reference "${reference}" in ${source.filePath}`);
  }

  return undefined;
}

function getReferencedSchemaName(reference: string): string {
  try {
    return basename(new URL(reference).pathname, '.schema.json');
  } catch {
    return basename(reference, '.schema.json');
  }
}

function stripHash(reference: string): string {
  return reference.split('#', 1)[0] ?? reference;
}
