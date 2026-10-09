import { readdirSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { createAjv } from './utils/createAjv';
import { isAbstractEntity } from '../scripts/entity-metadata';
import { readEntitySchema } from '../scripts/entity-schema';

const entitiesDir = 'src/entities';

describe('immutable entity types', () => {
  for (const entry of readdirSync(entitiesDir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const schema = readEntitySchema(join(entitiesDir, entry.name, `${entry.name}.schema.json`));
    if (isAbstractEntity(schema)) continue;
    it(`${entry.name} requires entityType to equal its exact title`, () => {
      const entityType = schema.properties!.entityType!;
      expect(entityType).toHaveProperty('type', 'string');
      expect(entityType).toHaveProperty('const', schema.title);
      expect(schema.required).toContain('entityType');
      const validate = createAjv().compile(entityType);
      expect(validate(schema.title)).toBe(true);
      for (const value of ['OtherEntity', schema.title!.toLowerCase(), null, 123]) {
        expect(validate(value)).toBe(false);
      }
    });
  }
});
