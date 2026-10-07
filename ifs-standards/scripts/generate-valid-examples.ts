import { createRemoteResolver, generate } from 'json-schema-faker';
import type { JsonSchema } from 'json-schema-faker';
import { access, mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import { basename, dirname, join } from 'node:path';

const ENTITIES_DIR = 'src/entities';
const SCHEMA_BASE_PATH = '/schemas/v1/entities/';

interface ResolutionAttempts {
  localPaths: string[];
  usedLocalPath?: string;
  usedRemote?: boolean;
}

const schemaResolutionAttempts = new Map<string, ResolutionAttempts>();
const localSchemaById = await indexLocalSchemas(ENTITIES_DIR);
const remoteSchemaResolver = createRemoteResolver();

const schemaDirs = await readdir(ENTITIES_DIR, { withFileTypes: true });
for (const schemaDir of schemaDirs) {
  if (!schemaDir.isDirectory()) {
    continue;
  }

  const schemaName = schemaDir.name;
  const schemaFilePath = join(ENTITIES_DIR, schemaName, `${schemaName}.schema.json`);
  const exampleObjectPath = join(ENTITIES_DIR, schemaName, `examples/${schemaName}.json`);
  console.log(`Generating example for schema: ${schemaFilePath}`);

  try {
    const schemaFileContent = await readFile(schemaFilePath, 'utf8');

    // json-schema-faker needs a parsed schema object, and generate() returns a Promise.
    const schema = JSON.parse(schemaFileContent) as JsonSchema;
    const fakeObject = await generate(schema, { refResolver: resolveLocalSchemaReferenceFirst });
    const entityType = toPascalCase(schemaName);
    const documentationUrl = `https://ifs-standards.org/entities/${entityType}`;

    if (typeof fakeObject === 'object' && fakeObject !== null && !Array.isArray(fakeObject)) {
      const example = fakeObject as Record<string, unknown>;
      example.id = '1001';
      example.ifsId = '1001';
      example.entityType = entityType;
      example.entityDocumentationUrl = documentationUrl;
      if ('basedOn' in example) example.basedOn = '1000';

      // Faker may choose empty arrays even when they represent the entity's key data.
      for (const [property, value] of Object.entries(example)) {
        if (Array.isArray(value) && value.length === 0) {
          if (property === 'polygons' && entityType === 'GeographicArea') {
            example[property] = [
              [
                [
                  [-122.42, 37.77],
                  [-122.41, 37.77],
                  [-122.41, 37.78],
                  [-122.42, 37.77],
                ],
              ],
            ];
            continue;
          }

          const propertySchema = (schema as Exclude<JsonSchema, boolean>).properties?.[property] as
            | JsonSchema
            | undefined;
          const objectPropertySchema = propertySchema && typeof propertySchema === 'object' ? propertySchema : undefined;
          example[property] = [
            objectPropertySchema?.items
              ? exampleValue(objectPropertySchema.items as Exclude<JsonSchema, boolean>)
              : 'Example',
          ];
        }
      }
    }

    // Node's writeFile creates the file, but not missing parent folders.
    await mkdir(dirname(exampleObjectPath), { recursive: true });
    await writeFile(exampleObjectPath, JSON.stringify(fakeObject, null, 2));
  } catch (error) {
    console.error(formatExampleGenerationError(schemaFilePath, error));
    process.exit(1);
  }
}

// Custom resolver mirrors hosted schema URLs to repo files before network fallback.
async function resolveLocalSchemaReferenceFirst(refUrl: string): Promise<JsonSchema> {
  const attempts = getResolutionAttempts(refUrl);
  attempts.localPaths = localSchemaCandidates(refUrl);

  for (const localPath of attempts.localPaths) {
    if (await fileExists(localPath)) {
      attempts.usedLocalPath = localPath;
      return JSON.parse(await readFile(localPath, 'utf8'));
    }
  }

  attempts.usedRemote = true;

  try {
    return await remoteSchemaResolver(refUrl);
  } catch (error) {
    if (error && typeof error === 'object') {
      Object.assign(error, { source: refUrl });
    }

    throw error;
  }
}

async function indexLocalSchemas(rootDir: string) {
  const schemaById = new Map<string, string>();
  const entries = await readdir(rootDir, { withFileTypes: true });

  for (const entry of entries) {
    if (!entry.isDirectory()) {
      continue;
    }

    const schemaPath = join(rootDir, entry.name, `${entry.name}.schema.json`);

    try {
      const schema = JSON.parse(await readFile(schemaPath, 'utf8')) as JsonSchema;

      if (typeof schema === 'object' && schema.$id) {
        schemaById.set(schema.$id, schemaPath);
      }
    } catch {
      // Skip missing/invalid schema files here; generation step reports actual failures.
    }
  }

  return schemaById;
}

function localSchemaCandidates(refUrl: string) {
  const candidates = [];
  const refUrlWithoutHash = stripHash(refUrl);
  const indexedPath = localSchemaById.get(refUrlWithoutHash);

  if (indexedPath) {
    candidates.push(indexedPath);
  }

  try {
    const { pathname } = new URL(refUrlWithoutHash);

    if (pathname.startsWith(SCHEMA_BASE_PATH)) {
      const schemaFileName = basename(pathname);
      const schemaName = schemaFileName.replace(/\.schema\.json$/, '');
      candidates.push(join(ENTITIES_DIR, schemaName, schemaFileName));
    }
  } catch {
    // URL parser only runs for HTTP refs; keep guard for clear failure.
  }

  return [...new Set(candidates)];
}

function formatExampleGenerationError(schemaFilePath: string, error: unknown) {
  const refUrl = extractRefUrl(error);
  const attempts = refUrl ? schemaResolutionAttempts.get(refUrl) : undefined;
  const lines = [
    '',
    `Failed to generate valid example from ${schemaFilePath}.`,
    'Resolution behavior: checked local schema files first, then fell back to the remote $ref URL.',
  ];

  if (refUrl) {
    lines.push(`Reference: ${refUrl}`);
  }

  if (attempts) {
    lines.push(
      `Local lookup: ${attempts.usedLocalPath ? `used ${attempts.usedLocalPath}` : `not found (${attempts.localPaths.join(', ') || 'no local candidates'})`}`
    );
  }

  if (attempts?.usedLocalPath) {
    lines.push('Remote lookup: skipped because local schema file was found.');
  } else if (attempts?.usedRemote) {
    lines.push(`Remote lookup: failed${refUrl ? ` (${refUrl})` : ''}.`);
  }

  lines.push(
    `Why failed: ${error instanceof Error ? error.message : String(error)}`,
    'Fix: add the referenced schema locally, fix the $ref URL/path, or make the remote schema reachable.'
  );

  return lines.join('\n');
}

function extractRefUrl(error: unknown) {
  const source =
    error && typeof error === 'object' && 'source' in error && typeof error.source === 'string'
      ? error.source
      : undefined;
  const message = error instanceof Error ? error.message : '';
  const unresolvedRefMatch = message.match(/Unresolved \$ref: (\S+)/);
  const fetchMatch = message.match(/(?:fetch|schema from) (https?:\/\/\S+)/);

  return source || unresolvedRefMatch?.[1] || fetchMatch?.[1];
}

function getResolutionAttempts(url: string): ResolutionAttempts {
  const existing = schemaResolutionAttempts.get(url);
  if (existing) return existing;

  const attempts: ResolutionAttempts = { localPaths: [], usedRemote: false };
  schemaResolutionAttempts.set(url, attempts);
  return attempts;
}

function stripHash(url: string) {
  return url.split('#', 1)[0] ?? url;
}

function toPascalCase(value: string) {
  return value
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
}

function exampleValue(schema: Exclude<JsonSchema, boolean>): unknown {
  if (schema.type === 'array') {
    return [exampleValue(schema.items as Exclude<JsonSchema, boolean>)];
  }
  if (schema.type === 'object') {
    return Object.fromEntries(
      Object.entries(schema.properties ?? {}).map(([key, value]) => [key, exampleValue(value as Exclude<JsonSchema, boolean>)])
    );
  }
  if (schema.type === 'number' || schema.type === 'integer') return 1;
  if (schema.type === 'boolean') return true;
  if (schema.enum?.length) return schema.enum[0];
  if (schema.format === 'date-time') return '2025-01-01T00:00:00Z';
  return 'Example';
}

async function fileExists(path: string) {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}
