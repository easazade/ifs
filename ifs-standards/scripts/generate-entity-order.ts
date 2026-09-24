import type { JSONSchema7 } from 'json-schema';
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { basename, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const SCRIPTS_DIR = dirname(fileURLToPath(import.meta.url));
const PROJECT_DIR = join(SCRIPTS_DIR, '..');
const ENTITIES_DIR = join(PROJECT_DIR, 'src/entities');
const OUTPUT_PATH = join(SCRIPTS_DIR, 'generate-order.json');

// Each graph node keeps entity name plus entities its schema references.
interface EntityNode {
  name: string;
  schemaId?: string;
  filePath: string;
  references: Set<string>;
}

const schemaFiles = await findSchemaFiles(ENTITIES_DIR);
const entities = await readEntities(schemaFiles);
const entityByReference = indexEntities(entities);

for (const entity of entities) {
  for (const reference of await readSchemaReferences(entity.filePath)) {
    const dependency = resolveEntityReference(reference, entity, entityByReference);

    // Self-references describe revisions or trees, not a separate entity generation dependency.
    if (dependency && dependency.name !== entity.name) {
      entity.references.add(dependency.name);
    }
  }
}

const generateOrder = topologicalSort(entities);
await writeFile(OUTPUT_PATH, `${JSON.stringify(generateOrder, null, 2)}\n`);
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

async function readEntities(filePaths: string[]): Promise<EntityNode[]> {
  return Promise.all(
    filePaths.map(async (filePath) => {
      const schema = JSON.parse(await readFile(filePath, 'utf8')) as JSONSchema7;

      return {
        name: schema.title || basename(filePath, '.schema.json'),
        schemaId: schema.$id,
        filePath,
        references: new Set<string>(),
      };
    })
  );
}

function indexEntities(entities: EntityNode[]): Map<string, EntityNode> {
  const index = new Map<string, EntityNode>();

  for (const entity of entities) {
    if (entity.schemaId) index.set(stripHash(entity.schemaId), entity);
    index.set(basename(entity.filePath, '.schema.json'), entity);
  }

  return index;
}

async function readSchemaReferences(filePath: string): Promise<string[]> {
  const schema = JSON.parse(await readFile(filePath, 'utf8')) as unknown;
  return collectReferences(schema);
}

// Recursive walk finds $ref at any schema depth, including arrays and compositions.
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
  source: EntityNode,
  entityByReference: Map<string, EntityNode>
): EntityNode | undefined {
  const referenceWithoutHash = stripHash(reference);

  if (!referenceWithoutHash) return source;

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

// Kahn's algorithm emits dependencies first, like constructing child objects before parents in Dart.
function topologicalSort(entities: EntityNode[]): string[] {
  const remainingDependencies = new Map(entities.map((entity) => [entity.name, new Set(entity.references)] as const));
  const generateOrder: string[] = [];

  while (remainingDependencies.size > 0) {
    const ready = [...remainingDependencies.entries()]
      .filter(([, dependencies]) => dependencies.size === 0)
      .map(([name]) => name)
      .sort((left, right) => left.localeCompare(right));

    if (ready.length === 0) {
      const cycle = [...remainingDependencies.keys()].sort().join(', ');
      throw new Error(`Entity dependency cycle detected among: ${cycle}`);
    }

    for (const name of ready) {
      generateOrder.push(name);
      remainingDependencies.delete(name);
    }

    for (const dependencies of remainingDependencies.values()) {
      for (const generatedName of ready) dependencies.delete(generatedName);
    }
  }

  return generateOrder;
}

function stripHash(reference: string): string {
  return reference.split('#', 1)[0] ?? reference;
}
