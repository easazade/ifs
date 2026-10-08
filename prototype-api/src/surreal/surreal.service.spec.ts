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
    await initializeDatabase(service.client, ['member', 'permission', 'role']);
  }, 20_000);
  afterAll(async () => {
    try {
      await service?.onModuleDestroy();
    } finally {
      vi.unstubAllEnvs();
      await server?.stop();
    }
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
