import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { readdir } from 'node:fs/promises';
import { join } from 'node:path';
import type { AnySchema } from 'ajv';
import { createAjv } from './utils/createAjv';

const ENTITIES_DIR = 'src/entities';

function readJson(path: string): unknown {
  return JSON.parse(readFileSync(path, 'utf8'));
}

async function listEntityNames() {
  const entries = await readdir(ENTITIES_DIR, { withFileTypes: true });
  return entries.filter((entry) => entry.isDirectory()).map((entry) => entry.name);
}

async function listExampleFiles(entityName: string, kind: 'valid' | 'invalid') {
  const examplesDir = join(ENTITIES_DIR, entityName, 'examples', kind);

  try {
    const entries = await readdir(examplesDir, { withFileTypes: true });
    return entries
      .filter((entry) => entry.isFile() && entry.name.endsWith('.json'))
      .map((entry) => join(examplesDir, entry.name));
  } catch (error) {
    if (error instanceof Error && 'code' in error && error.code === 'ENOENT') return [];
    throw error;
  }
}

const entityNames = await listEntityNames();
const entityExamples = await Promise.all(
  entityNames.map(async (entityName) => ({
    entityName,
    validExamples: await listExampleFiles(entityName, 'valid'),
    invalidExamples: await listExampleFiles(entityName, 'invalid'),
  }))
);

// Top-level await builds Vitest cases from filesystem, similar to awaiting config before Flutter tests run.
describe('entity schemas', () => {
  for (const { entityName, validExamples, invalidExamples } of entityExamples) {
    describe(entityName, () => {
      const schemaPath = join(ENTITIES_DIR, entityName, `${entityName}.schema.json`);
      const schema = readJson(schemaPath) as AnySchema;
      const ajv = createAjv();
      const validate = ajv.compile(schema);

      it('schema compiles', () => {
        expect(validate).toBeInstanceOf(Function);
        expect(typeof validate).toBe('function');
      });

      for (const examplePath of validExamples) {
        it(`${examplePath} is valid`, () => {
          const example = readJson(examplePath);
          const isValid = validate(example);

          expect(isValid, JSON.stringify(validate.errors, null, 2)).toBe(true);
        });
      }

      for (const examplePath of invalidExamples) {
        it(`${examplePath} is invalid`, () => {
          const example = readJson(examplePath);
          const isValid = validate(example);

          expect(isValid).toBe(false);
        });
      }
    });
  }
});
