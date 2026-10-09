import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { readdir } from 'node:fs/promises';
import { join } from 'node:path';
import type { AnySchema } from 'ajv';
import { createAjv } from './utils/createAjv';
import { isAbstractEntity } from '../scripts/entity-metadata';

const ENTITIES_DIR = 'src/entities';
const entries = await readdir(ENTITIES_DIR, { withFileTypes: true });
const entityNames = entries.filter((entry) => entry.isDirectory()).map((entry) => entry.name);

describe('entity schemas', () => {
  for (const entityName of entityNames) {
    const schemaPath = join(ENTITIES_DIR, entityName, `${entityName}.schema.json`);
    const schema = JSON.parse(readFileSync(schemaPath, 'utf8')) as AnySchema;

    it(`${entityName} allows additional properties`, () => {
      expect(schema).toHaveProperty('additionalProperties', true);
    });

    // Abstract base validation is covered by base-entity.test.ts, including its metadata.
    if (typeof schema === 'object' && isAbstractEntity(schema)) continue;

    it(`${entityName} schema compiles`, () => {
      const validate = createAjv().compile(schema);

      expect(validate).toBeInstanceOf(Function);
      expect(typeof validate).toBe('function');
    });
  }
});
