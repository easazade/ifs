import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { createAjv } from './utils/createAjv';

const entitiesDir = 'src/entities';

describe('immutable entity types', () => {
  for (const entry of readdirSync(entitiesDir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const schema = JSON.parse(readFileSync(join(entitiesDir, entry.name, `${entry.name}.schema.json`), 'utf8'));
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
    it(`${entry.name} generated example preserves its fixed entityType`, () => {
      const example = JSON.parse(readFileSync(join(entitiesDir, entry.name, 'examples', `${entry.name}.json`), 'utf8'));
      expect(example.entityType).toBe(schema.title);
    });
  }
});
