import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { entityContract, readEntitySchemas, resolveLocalRefs, type EntitySchema } from '../scripts/entity-schema';

const schemas = readEntitySchemas('src/entities');
const recurrence = [...schemas.values()].find((schema) => schema.title === 'Recurrence')!;

describe('shared local schema resolution', () => {
  it('resolves recurrence duration as a string and preserves intersecting frequency patterns', () => {
    const contract = entityContract(recurrence, schemas);
    expect(contract.properties?.duration).toMatchObject({ type: 'string' });
    const frequency = contract.properties?.frequency as EntitySchema;
    expect(frequency.anyOf?.[1]).toMatchObject({
      type: 'string',
      allOf: [
        { type: 'string', pattern: (recurrence.$defs?.duration as EntitySchema).pattern },
        { pattern: '^P(?=.*[1-9])' },
      ],
    });
    expect(JSON.stringify(contract.properties)).not.toContain('#/$defs/');
    expect(contract.anyOf).toEqual(recurrence.anyOf);
    expect(contract.allOf).toContainEqual(recurrence.allOf?.[1]);
    expect(contract.required).toContain('createdAt');
  });
  it('does not resolve reference-looking JSON data in defaults or examples', () => {
    const schema = { type: 'object', default: { $ref: '#/missing' }, examples: [{ $ref: '#/missing' }] };
    expect(resolveLocalRefs(schema, schema)).toEqual(schema);
  });
  it('supports escaped pointers and boolean definitions with siblings', () => {
    const schema = { $defs: { 'a/b~': { type: 'string' }, never: false } };
    expect(resolveLocalRefs({ $ref: '#/$defs/a~1b~0' }, schema)).toEqual({ type: 'string' });
    expect(resolveLocalRefs({ $ref: '#/$defs/never', description: 'Never' }, schema)).toEqual({
      description: 'Never',
      allOf: [false],
    });
  });
  it('rejects missing and circular definitions instead of weakening contracts', () => {
    expect(() => resolveLocalRefs({ $ref: '#/$defs/missing' }, {})).toThrow('Unknown or unsupported');
    expect(() => resolveLocalRefs({ $ref: '#/$defs/a' }, { $defs: { a: { $ref: '#/$defs/a' } } })).toThrow('Circular');
  });
  it('resolves inherited local fields in the defining base document', () => {
    const base: EntitySchema = {
      $id: 'base',
      type: 'object',
      additionalProperties: true,
      'x-ifs-abstract': true,
      properties: { inherited: { $ref: '#/$defs/text' } },
      $defs: { text: { type: 'string' } },
    };
    const child: EntitySchema = { type: 'object', allOf: [{ $ref: 'base' }] };
    expect(entityContract(child, new Map([['base', base]])).properties?.inherited).toEqual({ type: 'string' });
  });
  it('documents recurrence duration as a string, not an entity relationship', () => {
    const overview = readFileSync('src/entities/overview.md', 'utf8');
    const block = overview.match(/\n {2}RECURRENCE \{([\s\S]*?)\n {2}\}/)?.[1];
    expect(block).toContain('duration string');
    expect(block).not.toContain('duration object');
    expect(block).not.toContain('duration string FK');
  });
});
