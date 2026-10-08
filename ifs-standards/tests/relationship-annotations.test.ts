import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { generateRelationshipAnnotations } from '../scripts/generate-relationship-annotations';
import { createAjv } from './utils/createAjv';

const temporaryDirs: string[] = [];

afterEach(async () => {
  await Promise.all(temporaryDirs.splice(0).map((directory) => rm(directory, { recursive: true, force: true })));
});

async function fixture() {
  const root = await mkdtemp(join(tmpdir(), 'ifs-relationships-'));
  temporaryDirs.push(root);
  const entities = join(root, 'entities');
  const defaults = join(root, 'defaults');
  await mkdir(defaults);
  for (const type of ['Member', 'Group', 'Place']) {
    await mkdir(join(entities, type), { recursive: true });
    await writeFile(
      join(entities, type, `${type}.schema.json`),
      JSON.stringify({
        type: 'object',
        properties: { entityType: { const: type } },
        'x-ifs-relationships': [{ relationshipTypeId: 'RelationshipType/stale', direction: 'incoming' }],
        description: 'Preserve this description',
      })
    );
  }
  async function define(name: string, sourceTypes: string[], targetTypes: string[]) {
    await writeFile(
      join(defaults, `${name}.json`),
      JSON.stringify({
        id: `RelationshipType/${name}`,
        entityType: 'RelationshipType',
        sourceTypes,
        targetTypes,
      })
    );
  }
  async function schema(type: string) {
    return JSON.parse(await readFile(join(entities, type, `${type}.schema.json`), 'utf8')) as {
      description: string;
      'x-ifs-relationships': unknown[];
    };
  }
  return { entities, defaults, define, schema };
}

describe('relationship annotation generation', () => {
  it('rebuilds sorted lists for both endpoints, replaces legacy metadata, and is idempotent', async () => {
    const { entities, defaults, define, schema } = await fixture();
    await define('z-member-of', ['Member'], ['Group']);
    await define('a-partnered', ['Member', 'Group'], ['Member', 'Group']);
    expect(await generateRelationshipAnnotations(entities, defaults)).toBe(3);
    expect((await schema('Member'))['x-ifs-relationships']).toEqual([
      { relationshipTypeId: 'RelationshipType/a-partnered', endpoint: 'source' },
      { relationshipTypeId: 'RelationshipType/a-partnered', endpoint: 'target' },
      { relationshipTypeId: 'RelationshipType/z-member-of', endpoint: 'source' },
    ]);
    expect((await schema('Group'))['x-ifs-relationships']).toContainEqual({
      relationshipTypeId: 'RelationshipType/z-member-of',
      endpoint: 'target',
    });
    expect((await schema('Place'))['x-ifs-relationships']).toEqual([]);
    expect((await schema('Member')).description).toBe('Preserve this description');
    const path = join(entities, 'Member/Member.schema.json');
    const first = await readFile(path, 'utf8');
    await generateRelationshipAnnotations(entities, defaults);
    expect(await readFile(path, 'utf8')).toBe(first);
    await rm(join(defaults, 'z-member-of.json'));
    await generateRelationshipAnnotations(entities, defaults);
    expect((await schema('Member'))['x-ifs-relationships']).toHaveLength(2);
  });

  it('rejects unknown endpoint types before writing any schema', async () => {
    const { entities, defaults, define, schema } = await fixture();
    await define('a-valid', ['Member'], ['Group']);
    await define('z-invalid', ['Missing'], ['Place']);
    const before = await schema('Member');
    await expect(generateRelationshipAnnotations(entities, defaults)).rejects.toThrow('Unknown entity type Missing');
    expect(await schema('Member')).toEqual(before);
  });

  it('rejects duplicate relationship IDs before writing', async () => {
    const { entities, defaults, define } = await fixture();
    await define('member-of', ['Member'], ['Group']);
    await writeFile(join(defaults, 'duplicate.json'), await readFile(join(defaults, 'member-of.json')));
    await expect(generateRelationshipAnnotations(entities, defaults)).rejects.toThrow('Duplicate RelationshipType ID');
  });

  it('allows strict validation to treat generated metadata as an annotation', () => {
    const validate = createAjv().compile({
      type: 'object',
      'x-ifs-relationships': [{ relationshipTypeId: 'RelationshipType/owns', endpoint: 'target' }],
    });
    expect(validate({})).toBe(true);
  });
});
