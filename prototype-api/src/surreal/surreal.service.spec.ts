import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { RecordId } from 'surrealdb';
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';
import { startSurrealServer } from '../../test/support/surreal-server.js';
import { SurrealService } from './surreal.service.js';
import { initializeDatabase } from './database.setup.js';

const relations = [
  {
    property: 'permissions',
    table: 'permission',
    isArray: true,
    readOnly: false,
  },
  { property: 'roles', table: 'role', isArray: true, readOnly: true },
];
describe('SurrealService (real database)', () => {
  let server: Awaited<ReturnType<typeof startSurrealServer>>;
  let service: SurrealService;
  beforeAll(async () => {
    server = await startSurrealServer();
    vi.stubEnv('SURREALDB_URL', server.endpoint);
    vi.stubEnv('SURREALDB_NAMESPACE', 'service_test');
    vi.stubEnv('SURREALDB_DATABASE', 'test');
    vi.stubEnv('SURREALDB_USERNAME', 'test');
    vi.stubEnv('SURREALDB_PASSWORD', 'test');
    service = new SurrealService();
    await service.onModuleInit();
    await initializeDatabase(service.client, [
      'member',
      'permission',
      'role',
      'organization',
      'relationship_type',
      'relationship',
    ]);
  }, 20_000);
  afterAll(async () => {
    try {
      await service?.onModuleDestroy();
    } finally {
      vi.unstubAllEnvs();
      await server?.stop();
    }
  });

  it('creates traversable graph edges, preserves public IDs and supports edge CRUD', async () => {
    await service.create('organization', { id: 'Organization/source' });
    await service.create('member', { id: 'Member/target' });
    await service.create('relationship_type', {
      id: 'RelationshipType/membership',
      type: 'has member',
      inverseType: 'member of',
      sourceTypes: ['Organization'],
      targetTypes: ['Member'],
    });
    const data = {
      id: 'Relationship/edge',
      sourceId: 'Organization/source',
      targetId: 'Member/target',
      relationshipTypeId: 'RelationshipType/membership',
      type: 'has member',
      inverseType: 'member of',
      startedAt: '2026-01-01',
      notes: { trace: 'test' },
    };
    expect(await service.createEdge('relationship', data)).toEqual(data);
    const stored = await service.client.select<Record<string, unknown>>(
      new RecordId('relationship', data.id),
    );
    expect(stored?.in).toEqual(new RecordId('organization', data.sourceId));
    expect(stored?.out).toEqual(new RecordId('member', data.targetId));
    expect(stored).not.toHaveProperty('sourceId');
    const [traversed] = await service.client.query<[RecordId[]]>(
      'RETURN $source->relationship->member;',
      { source: new RecordId('organization', data.sourceId) },
    );
    expect(traversed).toEqual([new RecordId('member', data.targetId)]);
    await expect(
      service.createEdge('relationship', data),
    ).rejects.toBeInstanceOf(ConflictException);
    expect(await service.findAll('relationship')).toEqual([data]);
    expect(
      await service.updateEdge('relationship', data.id, {
        endedAt: '2026-02-01',
      }),
    ).toEqual({ ...data, endedAt: '2026-02-01' });
    for (const patch of [
      { sourceId: data.sourceId },
      { targetId: data.targetId },
      { in: 'bad' },
      { out: 'bad' },
      { id: 'Relationship/other' },
      { type: 'incorrect' },
      { relationshipTypeId: 'RelationshipType/missing' },
    ]) {
      await expect(
        service.updateEdge('relationship', data.id, patch),
      ).rejects.toBeInstanceOf(BadRequestException);
    }
    for (const patch of [
      { sourceId: 'Organization/missing' },
      { sourceId: 'Member/target' },
      { targetId: 'Unknown/target' },
      { targetId: 'invalid' },
      { in: 'bad' },
      { relationshipTypeId: 'Member/target' },
    ]) {
      await expect(
        service.createEdge('relationship', {
          ...data,
          id: 'Relationship/invalid',
          ...patch,
        }),
      ).rejects.toBeInstanceOf(BadRequestException);
    }
    await expect(service.create('relationship', data)).rejects.toBeInstanceOf(
      BadRequestException,
    );
    await expect(
      service.client.query(
        'RELATE organization:missing->relationship->member:missing;',
      ),
    ).rejects.toThrow();
    expect(await service.remove('relationship', data.id)).toEqual({
      ...data,
      endedAt: '2026-02-01',
    });
    expect(await service.findOne('relationship', data.id)).toBeNull();
    await expect(
      service.updateEdge('relationship', data.id, {}),
    ).rejects.toBeInstanceOf(NotFoundException);
    await expect(
      service.remove('relationship', data.id),
    ).rejects.toBeInstanceOf(NotFoundException);
    await service.createEdge('relationship', {
      ...data,
      id: 'Relationship/cascade',
    });
    await service.remove('member', data.targetId);
    expect(
      await service.findOne('relationship', 'Relationship/cascade'),
    ).toBeNull();
    const [afterDelete] = await service.client.query<[RecordId[]]>(
      'RETURN $source->relationship->member;',
      { source: new RecordId('organization', data.sourceId) },
    );
    expect(afterDelete).toEqual([]);
    await service.remove('organization', data.sourceId);
  });

  it('sets up relation tables idempotently and refuses ordinary-table conversion without data loss', async () => {
    await initializeDatabase(service.client, ['relationship']);
    await service.client.query(
      'REMOVE TABLE relationship; DEFINE TABLE relationship TYPE NORMAL SCHEMALESS; CREATE relationship:legacy SET notes = "keep";',
    );
    await expect(
      initializeDatabase(service.client, ['relationship']),
    ).rejects.toThrow('not a graph relation');
    expect(await service.findOne('relationship', 'legacy')).not.toBeNull();
    await service.client.query('REMOVE TABLE relationship;');
    await initializeDatabase(service.client, ['relationship']);
  });

  it('round-trips IDs, embedded JSON and arrays, and patches without replacing fields', async () => {
    const data = {
      id: 'a:complex-id',
      name: 'Alice',
      extensions: { values: [1, 2] },
    };
    expect(await service.create('member', data)).toEqual(data);
    expect(await service.findAll('member')).toEqual([data]);
    expect(await service.update('member', data.id, { name: 'Bob' })).toEqual({
      ...data,
      name: 'Bob',
    });
    await expect(service.create('member', data)).rejects.toBeInstanceOf(
      ConflictException,
    );
    await expect(
      service.update('member', data.id, { id: 'other' }),
    ).rejects.toBeInstanceOf(BadRequestException);
    expect(await service.remove('member', data.id)).toEqual({
      ...data,
      name: 'Bob',
    });
    expect(await service.findOne('member', data.id)).toBeNull();
    await expect(
      service.update('member', 'absent', { name: 'Nobody' }),
    ).rejects.toBeInstanceOf(NotFoundException);
    await expect(service.remove('member', 'absent')).rejects.toBeInstanceOf(
      NotFoundException,
    );
    expect(await service.findAll('member')).toEqual([]);
  });

  it('stores real record links, expands relations, omits read-only writes, and clears arrays', async () => {
    const permission = { id: 'p1', name: 'Read' };
    await service.create('permission', permission);
    const member = await service.create(
      'member',
      { id: 'm1', permissions: [permission], roles: [{ id: 'ignored' }] },
      relations,
    );
    expect(member).toEqual({ id: 'm1', permissions: [permission], roles: [] });
    const stored = await service.client.select<{ permissions: RecordId[] }>(
      new RecordId('member', 'm1'),
    );
    expect(stored?.permissions[0]).toBeInstanceOf(RecordId);
    expect(
      await service.update('member', 'm1', { permissions: [] }, relations),
    ).toEqual({ id: 'm1', permissions: [], roles: [] });
    await expect(
      service.update(
        'member',
        'm1',
        { permissions: [{ id: 'missing' }] },
        relations,
      ),
    ).rejects.toBeInstanceOf(BadRequestException);
    await expect(
      service.update('member', 'm1', { permissions: [null] }, relations),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('supports singular and nullable links and persists across client connections', async () => {
    const singular = [
      {
        property: 'permission',
        table: 'permission',
        isArray: false,
        readOnly: false,
      },
    ];
    expect(
      await service.create(
        'role',
        { id: 'r1', permission: { id: 'p1' }, permissionId: 'p1' },
        singular,
      ),
    ).toEqual({
      id: 'r1',
      permission: { id: 'p1', name: 'Read' },
      permissionId: 'p1',
    });
    expect(
      await service.update('role', 'r1', { permission: null }, singular),
    ).toEqual({ id: 'r1', permission: null, permissionId: 'p1' });
    const second = new SurrealService();
    await second.onModuleInit();
    try {
      expect(await second.findOne('role', 'r1', singular)).toEqual({
        id: 'r1',
        permission: null,
        permissionId: 'p1',
      });
    } finally {
      await second.onModuleDestroy();
    }
  });
});
