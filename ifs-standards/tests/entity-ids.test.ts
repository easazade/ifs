import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { JSONSchema7 } from 'json-schema';
import { describe, expect, it } from 'vitest';
import { createAjv } from './utils/createAjv';

const entitiesDir = 'src/entities';
const entities = readdirSync(entitiesDir, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map(({ name }) => ({
    name,
    schema: JSON.parse(readFileSync(join(entitiesDir, name, `${name}.schema.json`), 'utf8')) as JSONSchema7,
  }));

describe('unified entity IDs', () => {
  for (const { name, schema } of entities) {
    it(`${schema.title} uses typed string IDs without a separate IFS ID`, () => {
      expect(schema.properties).not.toHaveProperty('ifsId');
      expect(schema.required).not.toContain('ifsId');
      expect(JSON.stringify(schema)).not.toContain('ifs-ref');
      for (const [property, definition] of Object.entries(schema.properties ?? {})) {
        expect(property).not.toMatch(/(Ref|Refs|Reference|References)$/);
        if (typeof definition === 'boolean') continue;
        if (
          property !== 'id' &&
          property !== 'basedOn' &&
          !/Ids?$/.test(property) &&
          property !== 'subject' &&
          property !== 'owners'
        )
          continue;
        const item = (definition.type === 'array' ? definition.items : definition) as JSONSchema7;
        expect(item.type).toContain('string');
        expect(item.pattern).toBeDefined();
        const validate = createAjv().compile(item);
        const entityType =
          property === 'id'
            ? name
                .split('-')
                .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
                .join('')
            : (item.pattern?.match(/^\^\(?([A-Z][A-Za-z0-9]*)(?:\/|\|)/)?.[1] ?? 'Member');
        expect(validate(`${entityType}/1`)).toBe(true);
        for (const invalid of [
          '1',
          '',
          'Member/',
          '/1',
          'member/1',
          'Member/1/2',
          'Member/has space',
          'ifs://object/1',
          1,
        ]) {
          expect(validate(invalid), `${property}: ${String(invalid)}`).toBe(false);
        }
        if (property === 'id') expect(validate('Unknown/1')).toBe(false);
      }
    });
  }

  const changeItem = entities.find(({ name }) => name === 'change-item')!.schema;
  const validateChangeItem = createAjv().compile(changeItem);
  it.each(['create', 'delete', 'update', 'replace'])('preserves ChangeItem nullability for %s', (operation) => {
    const example = {
      id: 'ChangeItem/1',
      entityType: 'ChangeItem',
      entityDocumentationUrl: 'https://ifs-standards.org/entities/ChangeItem',
      createdAt: '2025-01-01T00:00:00Z',
      updatedAt: '2025-01-01T00:00:00Z',
      resourceType: 'rule',
      operation,
      targetId: operation === 'create' ? null : 'Rule/1',
      baseId: operation === 'create' ? null : 'Rule/2',
      proposedId: operation === 'delete' ? null : 'Rule/3',
    };
    expect(validateChangeItem(example), JSON.stringify(validateChangeItem.errors)).toBe(true);
    expect(validateChangeItem({ ...example, proposedId: operation === 'delete' ? 'Rule/3' : null })).toBe(false);
    expect(validateChangeItem({ ...example, targetId: operation === 'create' ? 'Rule/1' : null })).toBe(false);
  });
});
