import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { RecordId } from 'surrealdb';
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';
import { startSurrealServer } from '../../test/support/surreal-server.js';
import { initializeDatabase } from './database.setup.js';
import { entityRelations } from './entity-tables.generated.js';
import { SurrealService } from './surreal.service.js';

// Disposable memory database only; no configured/persistent database is touched.
describe('nested entity writes (real database)', () => {
  let server: Awaited<ReturnType<typeof startSurrealServer>>;
  let service: SurrealService;
  const whenRelations = entityRelations.when;
  const metricRelations = entityRelations.metric;
  beforeAll(async () => {
    server = await startSurrealServer();
    vi.stubEnv('SURREALDB_URL', server.endpoint);
    vi.stubEnv('SURREALDB_NAMESPACE', 'nested_test');
    vi.stubEnv('SURREALDB_DATABASE', 'test');
    vi.stubEnv('SURREALDB_USERNAME', 'test');
    vi.stubEnv('SURREALDB_PASSWORD', 'test');
    service = new SurrealService();
    await service.onModuleInit();
    await initializeDatabase(service.client, [
      'when',
      'occurrence',
      'recurrence',
      'metric',
      'measurement_method',
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

  it('creates and attaches nested objects with omitted, null, or empty IDs without mutating input', async () => {
    const input = {
      id: 'When/generated',
      occurrences: [
        { startsAt: '2026-07-01T10:00:00Z' },
        { id: null, startsAt: '2026-07-02T10:00:00Z' },
        { id: '', startsAt: '2026-07-03T10:00:00Z' },
      ],
      recurrences: [{ id: null, frequency: 'weekly', interval: 1 }],
    };
    const snapshot = structuredClone(input);
    const result = await service.create<any>('when', input, whenRelations);
    expect(input).toEqual(snapshot);
    expect(new Set(result.occurrences.map((child: any) => child.id)).size).toBe(
      3,
    );
    for (const child of result.occurrences) {
      expect(child.id).toMatch(/^Occurrence\/[0-9a-f-]+$/);
      expect(child.entityType).toBe('Occurrence');
      expect(await service.findOne('occurrence', child.id)).toEqual(child);
    }
    expect(result.recurrences[0].id).toMatch(/^Recurrence\/[0-9a-f-]+$/);
    const stored = await service.client.select<{ occurrences: RecordId[] }>(
      new RecordId('when', input.id),
    );
    expect(
      stored?.occurrences.every((child) => child instanceof RecordId),
    ).toBe(true);
  });

  it('creates missing explicit IDs, merges existing children, and keeps omitted fields', async () => {
    await service.create('occurrence', {
      id: 'Occurrence/shared',
      startsAt: '2026-07-01T10:00:00Z',
      duration: 'PT1H',
    });
    const first = await service.create<any>(
      'when',
      {
        id: 'When/upsert',
        occurrences: [
          { id: 'Occurrence/shared', duration: 'PT2H' },
          { id: 'Occurrence/new', startsAt: '2026-07-02T10:00:00Z' },
        ],
        recurrences: [],
      },
      whenRelations,
    );
    expect(first.occurrences[0]).toMatchObject({
      duration: 'PT2H',
      startsAt: '2026-07-01T10:00:00Z',
    });
    expect(first.occurrences[1].id).toBe('Occurrence/new');
    await service.create(
      'when',
      {
        id: 'When/shared-link',
        occurrences: [{ id: 'Occurrence/shared' }],
        recurrences: [],
      },
      whenRelations,
    );
    await service.update(
      'when',
      'When/upsert',
      { occurrences: [{ id: 'Occurrence/shared', duration: 'PT3H' }] },
      whenRelations,
    );
    const linked = await service.findOne<any>(
      'when',
      'When/shared-link',
      whenRelations,
    );
    expect(linked.occurrences[0].duration).toBe('PT3H');
    expect(
      await service.update<any>(
        'when',
        'When/upsert',
        { timezone: 'UTC' },
        whenRelations,
      ),
    ).toMatchObject({ occurrences: [{ id: 'Occurrence/shared' }] });
    expect(
      await service.update<any>(
        'when',
        'When/upsert',
        { occurrences: [] },
        whenRelations,
      ),
    ).toMatchObject({ occurrences: [] });
    expect(
      await service.findOne('occurrence', 'Occurrence/shared'),
    ).not.toBeNull();
    expect(
      await service.findOne('occurrence', 'Occurrence/new'),
    ).not.toBeNull();
  });

  it('recursively writes and returns deeper graphs and resolves forward ID-only references', async () => {
    const result = await service.create<any>(
      'metric',
      {
        id: 'Metric/root',
        method: { name: 'Root method' },
        compositionItems: [
          {
            id: 'Metric/component-a',
            method: { id: 'MeasurementMethod/shared' },
          },
          {
            id: 'Metric/component-b',
            method: { id: 'MeasurementMethod/shared', name: 'Shared method' },
          },
        ],
      },
      metricRelations,
    );
    expect(result.method.id).toMatch(/^MeasurementMethod\//);
    expect(result.compositionItems[0].method).toMatchObject({
      id: 'MeasurementMethod/shared',
      name: 'Shared method',
    });
    expect(result.compositionItems[1].method).toEqual(
      result.compositionItems[0].method,
    );
    expect(
      await service.findOne('metric', 'Metric/root', metricRelations),
    ).toEqual(result);
  });

  it('rolls back every nested write when a reference is missing', async () => {
    const previous = await service.findOne('occurrence', 'Occurrence/shared');
    await expect(
      service.create(
        'when',
        {
          id: 'When/rollback',
          occurrences: [
            { id: 'Occurrence/shared', duration: 'PT99H' },
            { id: 'Occurrence/rolled-back', startsAt: '2026-07-01T10:00:00Z' },
            { id: 'Occurrence/missing' },
          ],
        },
        whenRelations,
      ),
    ).rejects.toBeInstanceOf(BadRequestException);
    expect(await service.findOne('when', 'When/rollback')).toBeNull();
    expect(
      await service.findOne('occurrence', 'Occurrence/rolled-back'),
    ).toBeNull();
    expect(await service.findOne('occurrence', 'Occurrence/shared')).toEqual(
      previous,
    );
  });

  it('does not leave children behind when the root conflicts or an update root is missing', async () => {
    await expect(
      service.create(
        'when',
        {
          id: 'When/upsert',
          occurrences: [
            {
              id: 'Occurrence/conflict-child',
              startsAt: '2026-07-01T10:00:00Z',
            },
          ],
        },
        whenRelations,
      ),
    ).rejects.toBeInstanceOf(ConflictException);
    expect(
      await service.findOne('occurrence', 'Occurrence/conflict-child'),
    ).toBeNull();
    await expect(
      service.update(
        'when',
        'When/missing',
        {
          occurrences: [
            {
              id: 'Occurrence/missing-root-child',
              startsAt: '2026-07-01T10:00:00Z',
            },
          ],
        },
        whenRelations,
      ),
    ).rejects.toBeInstanceOf(NotFoundException);
    expect(
      await service.findOne('occurrence', 'Occurrence/missing-root-child'),
    ).toBeNull();
  });

  it.each([
    [{ id: 42, startsAt: '2026-07-01T10:00:00Z' }],
    [{ id: '   ', startsAt: '2026-07-01T10:00:00Z' }],
    [{ id: 'Recurrence/wrong', startsAt: '2026-07-01T10:00:00Z' }],
    [{ id: null }],
    [{ id: 'Occurrence/wrong-type', entityType: 'Recurrence' }],
    [null],
  ])('rejects invalid nested identity/object: %j', async (child) => {
    await expect(
      service.create(
        'when',
        { id: 'When/invalid', occurrences: [child] },
        whenRelations,
      ),
    ).rejects.toBeInstanceOf(BadRequestException);
    expect(await service.findOne('when', 'When/invalid')).toBeNull();
  });

  it('rejects conflicting duplicate definitions before writing', async () => {
    await expect(
      service.create(
        'when',
        {
          id: 'When/duplicates',
          occurrences: [
            { id: 'Occurrence/duplicate', duration: 'PT1H' },
            { id: 'Occurrence/duplicate', duration: 'PT2H' },
          ],
        },
        whenRelations,
      ),
    ).rejects.toBeInstanceOf(BadRequestException);
    expect(
      await service.findOne('occurrence', 'Occurrence/duplicate'),
    ).toBeNull();
  });

  it('supports ID-only cycles without producing cyclic JSON responses', async () => {
    const result = await service.create<any>(
      'metric',
      {
        id: 'Metric/cycle',
        compositionItems: [{ id: 'Metric/cycle' }],
      },
      metricRelations,
    );
    expect(result.compositionItems).toEqual([{ id: 'Metric/cycle' }]);
    expect(() => JSON.stringify(result)).not.toThrow();
  });
});
