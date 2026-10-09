import { readFileSync } from 'node:fs';
import type { AnySchema } from 'ajv';
import { describe, expect, it } from 'vitest';
import { isAbstractEntity } from '../scripts/entity-metadata';
import { createAjv } from './utils/createAjv';

const schema = JSON.parse(readFileSync('src/entities/entity/entity.schema.json', 'utf8'));
const ajv = createAjv();
// These keywords carry schema metadata; standard keywords enforce instance constraints.
ajv.addKeyword({ keyword: 'x-ifs-id', schemaType: 'boolean', valid: true });
ajv.addKeyword({ keyword: 'x-ifs-abstract', schemaType: 'boolean', valid: true });
ajv.addSchema(schema as AnySchema);
const validate = ajv.getSchema(schema.$id)!;
const record = {
  id: 'Action/1',
  entityType: 'Action',
  entityDocumentationUrl: 'https://ifs-standards.org/entities/Action',
  createdAt: '2025-01-01T00:00:00Z',
};

// allOf validates the same flat object against both the base and concrete constraints.
const validateAction = ajv.compile({
  type: 'object',
  additionalProperties: true,
  allOf: [{ $ref: schema.$id }],
  properties: {
    id: { type: 'string', pattern: '^Action/[^/\\s]+$' },
    entityType: { type: 'string', const: 'Action' },
    name: { type: 'string' },
  },
  required: ['name'],
});

describe('abstract Entity base schema', () => {
  it('contains exactly the agreed fields and remains open', () => {
    expect(schema.title).toBe('Entity');
    expect(isAbstractEntity(schema)).toBe(true);
    expect(isAbstractEntity({ title: 'Member' })).toBe(false);
    expect(Object.keys(schema.properties)).toEqual([
      'id',
      'entityType',
      'basedOn',
      'entityDocumentationUrl',
      'createdAt',
    ]);
    expect(schema.required).toEqual(['id', 'entityType', 'entityDocumentationUrl', 'createdAt']);
    expect(schema.properties.entityType).not.toHaveProperty('const');
    expect(schema.additionalProperties).toBe(true);
    expect(validate({ ...record, customField: { enabled: true } })).toBe(true);
  });

  it.each(['Action', 'Member', 'Observation'])('accepts %s records without fixing the base discriminator', (type) => {
    expect(validate({ ...record, id: `${type}/1`, entityType: type })).toBe(true);
  });

  it.each(['id', 'entityType', 'entityDocumentationUrl', 'createdAt'])('requires %s', (field) => {
    const incomplete: Record<string, unknown> = { ...record };
    delete incomplete[field];
    expect(validate(incomplete)).toBe(false);
  });

  it('keeps basedOn optional and validates typed IDs', () => {
    expect(validate(record)).toBe(true);
    expect(validate({ ...record, basedOn: 'Rule/original' })).toBe(true);
    for (const invalid of ['1', 'member/1', 'Member/', 'Member/has space', 'Member/1/2', null, 1]) {
      expect(validate({ ...record, id: invalid })).toBe(false);
      expect(validate({ ...record, basedOn: invalid })).toBe(false);
    }
  });

  it('validates discriminator types, documentation URLs, and timestamps', () => {
    expect(validate({ ...record, entityType: 1 })).toBe(false);
    expect(validate({ ...record, entityDocumentationUrl: 'not a URI' })).toBe(false);
    expect(validate({ ...record, createdAt: 'not a timestamp' })).toBe(false);
  });

  it('supports flat composition with concrete ID and discriminator refinements', () => {
    const action = { ...record, name: 'Approve', customField: true };
    expect(validateAction(action), JSON.stringify(validateAction.errors)).toBe(true);
    expect(validateAction({ ...action, entityType: 'Member' })).toBe(false);
    expect(validateAction({ ...action, id: 'Member/1' })).toBe(false);
    expect(validateAction({ ...action, createdAt: undefined })).toBe(false);
    expect(validateAction(record)).toBe(false);
  });

  it('is excluded from concrete resource generation artifacts', () => {
    const order = JSON.parse(readFileSync('scripts/generate-order.json', 'utf8'));
    const relations = JSON.parse(readFileSync('scripts/entity-relations.json', 'utf8'));
    const overview = readFileSync('src/entities/overview.md', 'utf8');
    expect(order).not.toContain('entity');
    expect(order).toContain('action');
    expect(relations).not.toHaveProperty('Entity');
    expect(overview).not.toContain('  ENTITY {');
    expect(schema).not.toHaveProperty('x-ifs-relationships');
  });
});
