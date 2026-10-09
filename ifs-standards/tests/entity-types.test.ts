import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { createAjv } from './utils/createAjv';
import { isAbstractEntity } from '../scripts/entity-metadata';

const entitiesDir = 'src/entities';

describe('immutable entity types', () => {
  for (const entry of readdirSync(entitiesDir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const schema = JSON.parse(readFileSync(join(entitiesDir, entry.name, `${entry.name}.schema.json`), 'utf8'));
    if (isAbstractEntity(schema)) continue;
    it(`${entry.name} requires entityType to equal its exact title`, () => {
      expect(schema.properties.entityType.type).toBe('string');
      expect(schema.properties.entityType.const).toBe(schema.title);
      expect(schema.required).toContain('entityType');
      const validate = createAjv().compile(schema.properties.entityType);
      expect(validate(schema.title)).toBe(true);
      for (const value of ['OtherEntity', schema.title.toLowerCase(), null, 123]) {
        expect(validate(value)).toBe(false);
      }
    });
  }
});
