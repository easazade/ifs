import assert from 'node:assert/strict';
import { test } from 'node:test';
import { checkReferences } from './check-fake-references.js';

function fixture(exports: Record<string, unknown>, file = 'src/fake/ifs/test.ts') {
  return { file, exports };
}

test('uses canonical ids directly and excludes identity declarations from references', () => {
  const result = checkReferences([
    fixture({
      members: [
        { entityType: 'Member', id: 'Member/1' },
        { entityType: 'Member', id: 'Member/ali' },
      ],
    }),
  ]);
  assert.deepEqual([...result.identities], ['Member/1', 'Member/ali']);
  assert.deepEqual(result.references, []);
  assert.deepEqual(result.missing, []);
});

test('does not derive the id prefix from the display discriminator', () => {
  const result = checkReferences([fixture({ area: { entityType: 'Geographic Area', id: 'GeographicArea/rasht' } })]);
  assert.deepEqual([...result.identities], ['GeographicArea/rasht']);
  assert.deepEqual(result.missing, []);
});

test('resolves forward references across modules and nested arrays', () => {
  const result = checkReferences([
    fixture({
      place: { entityType: 'Place', id: 'Place/hospital', basedOn: 'Place/original', nested: [['Member/1']] },
    }),
    fixture(
      { original: { entityType: 'Place', id: 'Place/original' }, members: [{ entityType: 'Member', id: 'Member/1' }] },
      'src/fake/ifs/nested/other.ts'
    ),
  ]);
  assert.equal(result.identities.size, 3);
  assert.equal(result.references.length, 2);
  assert.deepEqual(result.missing, []);
});

test('reports missing foreign references with their export and property locations', () => {
  const result = checkReferences([
    fixture({
      role: { entityType: 'Role', id: 'Role/steward', memberId: 'Member/missing', scopeIds: ['Scope/missing'] },
    }),
  ]);
  assert.deepEqual(result.missing, [
    { value: 'Member/missing', location: 'src/fake/ifs/test.ts:role.memberId' },
    { value: 'Scope/missing', location: 'src/fake/ifs/test.ts:role.scopeIds[0]' },
  ]);
});

test('checks id fields on non-entity reference objects', () => {
  const result = checkReferences([fixture({ relation: { id: 'Member/missing' } })]);
  assert.equal(result.identities.size, 0);
  assert.deepEqual(result.missing, [{ value: 'Member/missing', location: 'src/fake/ifs/test.ts:relation.id' }]);
});

test('does not accept obsolete local ids or ifsId as canonical identity declarations', () => {
  const result = checkReferences([
    fixture({ legacy: { entityType: 'Member', id: '1', ifsId: 'Member/1' }, reference: 'Member/1' }),
  ]);
  assert.equal(result.identities.size, 0);
  assert.equal(result.missing.length, 2);
});

test('ignores non-reference strings and primitives without claiming schema validity', () => {
  const result = checkReferences([
    fixture({
      values: [null, 1, true, 'https://ifs-standards.org/entities/member', 'Member/', 'Member/a b', 'Member/a/b'],
    }),
  ]);
  assert.deepEqual(result.references, []);
  assert.equal(result.identities.size, 0);
});

test('handles cycles and shared objects without losing references', () => {
  const member = { entityType: 'Member', id: 'Member/1' };
  const cyclic: Record<string, unknown> = { member, memberId: 'Member/1' };
  cyclic.self = cyclic;
  const result = checkReferences([fixture({ cyclic, member }), fixture({ member }, 'src/fake/ifs/alias.ts')]);
  assert.deepEqual([...result.identities], ['Member/1']);
  assert.deepEqual(result.references, [{ value: 'Member/1', location: 'src/fake/ifs/test.ts:cyclic.memberId' }]);
  assert.deepEqual(result.missing, []);
});
