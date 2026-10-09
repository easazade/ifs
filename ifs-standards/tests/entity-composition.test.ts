import { describe, expect, it } from 'vitest';
import { isAbstractEntity } from '../scripts/entity-metadata';
import { readEntitySchemas, resolveEntitySchema, type EntitySchema } from '../scripts/entity-schema';
import { createAjv } from './utils/createAjv';

const schemas = readEntitySchemas('src/entities');
const baseId = 'https://ifs-standards.org/schemas/v1/entities/entity.schema.json';
const commonRequired = ['id', 'entityType', 'entityDocumentationUrl', 'createdAt'];
const ajv = createAjv();
const action = {
  id: 'Action/approve',
  entityType: 'Action',
  entityDocumentationUrl: 'https://ifs-standards.org/entities/Action',
  createdAt: '2025-01-01T00:00:00Z',
  updatedAt: '2025-01-01T00:00:00Z',
  name: 'Approve',
  uniqueName: 'approve',
  requiresPermission: true,
  description: 'Approve a change',
  state: 'active',
};

describe('concrete entity composition', () => {
  for (const schema of schemas.values()) {
    if (isAbstractEntity(schema)) continue;
    it(`${schema.title} composes the base without duplicating shared fields or requiredness`, () => {
      expect(schema.allOf).toContainEqual({ $ref: baseId });
      for (const field of ['basedOn', 'entityDocumentationUrl', 'createdAt']) {
        expect(schema.properties).not.toHaveProperty(field);
      }
      for (const field of commonRequired) expect(schema.required ?? []).not.toContain(field);
      const effective = resolveEntitySchema(schema, schemas);
      expect(effective.required).toEqual(expect.arrayContaining(commonRequired));
      expect(effective.required).not.toContain('basedOn');
      expect(effective.properties!.entityType).toHaveProperty('const', schema.title);
      expect(effective.properties!.id).toHaveProperty(
        'pattern',
        `^${schema.title!.replace(/[^A-Za-z0-9]/g, '')}/[^/\\s]+$`
      );
      expect(schema.additionalProperties).toBe(true);
    });
  }

  const validateAction = ajv.getSchema('https://ifs-standards.org/schemas/v1/entities/action.schema.json')!;
  it('validates flat records and permits extra fields', () => {
    expect(validateAction(action), JSON.stringify(validateAction.errors)).toBe(true);
    expect(validateAction({ ...action, basedOn: 'Rule/original', extra: { enabled: true } })).toBe(true);
  });
  it.each(commonRequired)('rejects a missing inherited %s', (field) => {
    const incomplete: Record<string, unknown> = { ...action };
    delete incomplete[field];
    expect(validateAction(incomplete)).toBe(false);
  });
  it.each([
    { id: 'Member/1' },
    { id: 'Action/' },
    { id: 'Action/has space' },
    { entityType: 'Member' },
    { entityType: null },
    { createdAt: 'yesterday' },
    { entityDocumentationUrl: 'not a URL' },
    { basedOn: '1' },
  ])('rejects invalid inherited fields or concrete refinements: %j', (changes) => {
    expect(validateAction({ ...action, ...changes })).toBe(false);
  });
  it('gives Member an optional typed basedOn', () => {
    const validate = ajv.getSchema('https://ifs-standards.org/schemas/v1/entities/member.schema.json')!;
    const member = {
      id: 'Member/1',
      entityType: 'Member',
      name: 'Ali',
      roles: [],
      permissions: [],
      isOwner: false,
      entityDocumentationUrl: action.entityDocumentationUrl,
      createdAt: action.createdAt,
      updatedAt: action.updatedAt,
    };
    expect(validate(member), JSON.stringify(validate.errors)).toBe(true);
    expect(validate({ ...member, basedOn: 'Member/original', extra: true })).toBe(true);
    expect(validate({ ...member, basedOn: 'invalid' })).toBe(false);
  });
});

describe('scoped composition resolver', () => {
  it('preserves intersections even if a local pattern is wider', () => {
    const schema: EntitySchema = {
      type: 'object',
      allOf: [{ $ref: baseId }],
      properties: { id: { type: 'string', pattern: '.*' } },
    };
    const effective = resolveEntitySchema(schema, schemas);
    const validate = ajv.compile(effective.properties!.id!);
    expect(validate('Action/1')).toBe(true);
    expect(validate('invalid')).toBe(false);
    expect(effective.allOf).toEqual(schema.allOf);
  });
  it('keeps conditional composition branches untouched', () => {
    const schema = schemas.get('https://ifs-standards.org/schemas/v1/entities/change-item.schema.json')!;
    expect(resolveEntitySchema(schema, schemas).allOf).toEqual(schema.allOf);
    expect(schema.allOf).toHaveLength(4);
  });
  it('fails locally for unknown, non-abstract, closed, or circular bases', () => {
    expect(() => resolveEntitySchema({ allOf: [{ $ref: 'https://missing/base' }] }, schemas)).toThrow(
      'Unknown local base'
    );
    expect(() =>
      resolveEntitySchema(
        { allOf: [{ $ref: action.entityDocumentationUrl }] },
        new Map([[action.entityDocumentationUrl, { type: 'object', additionalProperties: true }]])
      )
    ).toThrow('open abstract object');
    const closed: EntitySchema = { $id: 'closed', type: 'object', additionalProperties: false, 'x-ifs-abstract': true };
    expect(() => resolveEntitySchema({ allOf: [{ $ref: 'closed' }] }, new Map([['closed', closed]]))).toThrow(
      'open abstract object'
    );
    const cyclic: EntitySchema = {
      $id: 'cyclic',
      type: 'object',
      additionalProperties: true,
      'x-ifs-abstract': true,
      allOf: [{ $ref: 'cyclic' }],
    };
    expect(() => resolveEntitySchema(cyclic, new Map([['cyclic', cyclic]]))).toThrow('Circular base schema');
  });
  it('rejects incompatible property types rather than silently overriding them', () => {
    expect(() =>
      resolveEntitySchema({ allOf: [{ $ref: baseId }], properties: { id: { type: 'number' } } }, schemas)
    ).toThrow('Conflicting base entity property types');
  });
});
