import { compileFromFile } from 'json-schema-to-typescript';
import type { JSONSchema7 } from 'json-schema';
import { access, readdir, readFile, writeFile } from 'node:fs/promises';
import { basename, join } from 'node:path';

const ENTITIES_DIR = 'src/entities';
const SCHEMA_BASE_PATH = '/schemas/v1/entities/';

interface ResolutionAttempts {
  localPaths: string[];
  usedLocalPath?: string;
}

const schemaResolutionAttempts = new Map<string, ResolutionAttempts>();
const localSchemaById = await indexLocalSchemas(ENTITIES_DIR);

const schemas = await readdir(ENTITIES_DIR, { withFileTypes: true });

for (const schemaDir of schemas) {
  if (!schemaDir.isDirectory()) {
    continue;
  }

  const schemaName = schemaDir.name;
  const schemaFilePath = join(ENTITIES_DIR, schemaName, `${schemaName}.schema.json`);
  const interfaceFilePath = join(ENTITIES_DIR, schemaName, `${schemaName}.ts`);
  console.log(schemaFilePath);

  try {
    const ts = await compileFromFile(schemaFilePath, {
      bannerComment: '// GENERATED FOR SCENARIO TESTING PURPOSES. DO NOT MODIFY BY HAND',
      $refOptions: {
        resolve: {
          localHttpFirst: {
            order: 1,
            canRead: ({ url }: { url: string }) => isHttpUrl(url),
            read: readLocalSchemaReference,
          },
        },
      },
    });

    await writeFile(interfaceFilePath, ts);
  } catch (error) {
    console.error(formatSchemaGenerationError(schemaFilePath, error));
    process.exit(1);
  }
}

// Custom resolver mirrors hosted schema URLs to repo files before network fallback.
async function readLocalSchemaReference({ url }: { url: string }) {
  const attempts = getResolutionAttempts(url);
  attempts.localPaths = localSchemaCandidates(url);

  for (const localPath of attempts.localPaths) {
    if (await fileExists(localPath)) {
      attempts.usedLocalPath = localPath;
      return readFile(localPath);
    }
  }

  throw new Error(
    `Local schema not found for ${url}. Tried: ${attempts.localPaths.join(', ') || 'no local candidates'}`
  );
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
      const schema = JSON.parse(await readFile(schemaPath, 'utf8')) as JSONSchema7;

      if (schema.$id) {
        schemaById.set(schema.$id, schemaPath);
      }
    } catch {
      // Skip missing/invalid schema files here; compile step reports actual failures.
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
    // URL parser only runs for HTTP refs matched by canRead; keep guard for clear failure.
  }

  return [...new Set(candidates)];
}

function formatSchemaGenerationError(schemaFilePath: string, error: unknown) {
  const refUrl =
    error && typeof error === 'object' && 'source' in error && typeof error.source === 'string'
      ? error.source
      : undefined;
  const attempts = refUrl ? schemaResolutionAttempts.get(refUrl) : undefined;
  const lines = [
    '',
    `Failed to generate TypeScript from ${schemaFilePath}.`,
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
  } else if (attempts) {
    lines.push(`Remote lookup: failed${refUrl ? ` (${refUrl})` : ''}.`);
  }

  lines.push(
    `Why failed: ${error instanceof Error ? error.message : String(error)}`,
    'Fix: add the referenced schema locally, fix the $ref URL/path, or make the remote schema reachable.'
  );

  return lines.join('\n');
}

function getResolutionAttempts(url: string): ResolutionAttempts {
  const existing = schemaResolutionAttempts.get(url);
  if (existing) return existing;

  const attempts: ResolutionAttempts = { localPaths: [] };
  schemaResolutionAttempts.set(url, attempts);
  return attempts;
}

function isHttpUrl(value: string) {
  return /^https?:\/\//.test(value);
}

function stripHash(url: string) {
  return url.split('#', 1)[0] ?? url;
}

async function fileExists(path: string) {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}
