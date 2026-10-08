import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

function readSchema(entity: string) {
  return JSON.parse(readFileSync(`src/entities/${entity}/${entity}.schema.json`, 'utf8')) as {
    description: string;
    properties: Record<string, unknown>;
  };
}

describe('group and place relationships', () => {
  it('records group membership and containment through Relationship objects', () => {
    const schema = readSchema('group');

    for (const field of ['members', 'organizations', 'groups']) {
      expect(schema.properties).not.toHaveProperty(field);
    }
    expect(schema.description).toContain('Relationship objects');
    expect(schema.description).toContain('do not grant delegated authority or imply transitive membership');
  });

  it('records place ownership through Relationship objects while preserving geography and roles', () => {
    const schema = readSchema('place');

    expect(schema.properties).not.toHaveProperty('owners');
    expect(schema.properties).toHaveProperty('geographicArea');
    expect(schema.properties).toHaveProperty('roles');
    expect(schema.description).toContain('Relationship objects');
    expect(schema.description).toContain('do not grant permissions');
  });
});
