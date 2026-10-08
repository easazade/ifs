import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import type { AnySchema } from 'ajv';
import { describe, expect, it } from 'vitest';
import { createAjv } from './utils/createAjv';

interface RelationshipType {
  id: string;
  type: string;
  inverseType: string;
  sourceTypes: string[];
  targetTypes: string[];
  symmetric: boolean;
}

const defaultsDir = 'src/defaults/relationship-type';
const definitions = readdirSync(defaultsDir)
  .filter((name) => name.endsWith('.json'))
  .map((name) => ({
    name,
    definition: JSON.parse(readFileSync(join(defaultsDir, name), 'utf8')) as RelationshipType,
  }));
const entityDir = 'src/entities';
const entityTypes = readdirSync(entityDir, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => {
    const schema = JSON.parse(readFileSync(join(entityDir, entry.name, `${entry.name}.schema.json`), 'utf8'));
    return schema.title as string;
  });
const ajv = createAjv();
// IFS ID metadata is an annotation, not an additional validation constraint.
ajv.addKeyword({ keyword: 'x-ifs-id', schemaType: 'boolean', valid: true });
const validate = ajv.compile(
  JSON.parse(readFileSync(join(entityDir, 'relationship-type/relationship-type.schema.json'), 'utf8')) as AnySchema
);

describe('standard relationship type defaults', () => {
  it('contains unique standard IDs', () => {
    expect(definitions.length).toBeGreaterThan(0);
    const ids = definitions.map(({ definition }) => definition.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) expect(id).toMatch(/^RelationshipType\/ifs\.[a-z][a-z0-9-]*$/);
  });

  for (const { name, definition } of definitions) {
    it(`${name} conforms to the canonical schema`, () => {
      expect(validate(definition), JSON.stringify(validate.errors)).toBe(true);
    });

    it(`${name} allows only known entity types`, () => {
      for (const type of [...definition.sourceTypes, ...definition.targetTypes]) {
        expect(entityTypes).toContain(type);
      }
    });

    it(`${name} has consistent symmetric semantics`, () => {
      if (definition.symmetric) {
        expect(definition.inverseType).toBe(definition.type);
        expect([...definition.sourceTypes].sort()).toEqual([...definition.targetTypes].sort());
      }
    });
  }

  it.each([
    {
      key: 'owns',
      type: 'owns',
      inverseType: 'owned by',
      sourceTypes: ['Member', 'Group', 'Organization'],
      targetTypes: ['Organization', 'Place'],
      symmetric: false,
    },
    {
      key: 'manages',
      type: 'manages',
      inverseType: 'managed by',
      sourceTypes: ['Member', 'Group', 'Organization'],
      targetTypes: ['Group', 'Organization', 'Place'],
      symmetric: false,
    },
    {
      key: 'protects',
      type: 'protects',
      inverseType: 'protected by',
      sourceTypes: ['Member', 'Group', 'Organization'],
      targetTypes: ['Member', 'Group', 'Organization', 'Place'],
      symmetric: false,
    },
    {
      key: 'oversees',
      type: 'oversees',
      inverseType: 'overseen by',
      sourceTypes: ['Member', 'Group', 'Organization'],
      targetTypes: ['Group', 'Organization', 'Place'],
      symmetric: false,
    },
    {
      key: 'employed-by',
      type: 'employed by',
      inverseType: 'employs',
      sourceTypes: ['Member'],
      targetTypes: ['Member', 'Group', 'Organization'],
      symmetric: false,
    },
    {
      key: 'partnered-with',
      type: 'partnered with',
      inverseType: 'partnered with',
      sourceTypes: ['Member', 'Group', 'Organization'],
      targetTypes: ['Member', 'Group', 'Organization'],
      symmetric: true,
    },
  ])('defines $key with the intended direction and endpoints', ({ key, ...expected }) => {
    const definition = definitions.find(({ definition }) => definition.id === `RelationshipType/ifs.${key}`);
    expect(definition?.definition).toMatchObject(expected);
  });

  it('defines direct member membership with an inverse label', () => {
    const memberOf = definitions.find(({ definition }) => definition.id === 'RelationshipType/ifs.member-of');
    expect(memberOf?.definition).toMatchObject({
      type: 'member of',
      inverseType: 'has member',
      sourceTypes: ['Member'],
      targetTypes: ['Group', 'Organization'],
      symmetric: false,
    });
  });
});
