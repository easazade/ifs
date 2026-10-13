import { BadRequestException } from '@nestjs/common';
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';
import { startSurrealServer } from '../../test/support/surreal-server.js';
import { baseEntity } from '../../test/support/entity-data.js';
import { initializeDatabase } from './database.setup.js';
import { SurrealService } from './surreal.service.js';
import { EntityValidator, graphSchema } from './entity-validation.js';

const recurrence = (key: string) => ({
  ...baseEntity('Recurrence', key),
  startsAt: '2026-07-01T10:00:00Z',
  frequency: 'weekly',
  interval: 1,
});
const occurrence = (key: string) => ({
  ...baseEntity('Occurrence', key),
  startsAt: '2026-07-01T10:00:00Z',
  duration: 'PT1H',
});
const schedule = (key: string) => ({
  ...baseEntity('When', key),
  updatedAt: '2026-07-01T00:00:00Z',
  timezone: 'UTC',
  duration: 'PT1H',
  occurrences: [],
  recurrences: [],
});

describe('canonical entity validation', () => {
  const validator = new EntityValidator();
  it('enforces inherited requirements and retains local $defs', () => {
    expect(() =>
      validator.validate('recurrence', recurrence('valid')),
    ).not.toThrow();
    expect(() =>
      validator.validate('recurrence', {
        ...recurrence('valid'),
        createdAt: undefined,
      }),
    ).toThrow(BadRequestException);
    expect(() =>
      validator.validate('recurrence', {
        ...recurrence('valid'),
        frequency: 'PT1H',
      }),
    ).not.toThrow();
    expect(() =>
      validator.validate('recurrence', {
        ...recurrence('valid'),
        duration: 'PT0S',
      }),
    ).not.toThrow();
  });
  it.each([
    { interval: undefined },
    { daysOfWeek: ['monday'], frequency: 'daily' },
    { interval: 1.5 },
    { duration: 'invalid' },
    { duration: 'P1.5DT1H' },
    { frequency: 'PT0S' },
    { frequency: 'sometimes' },
    { startsAt: '2026-07-01T10:00:00+02:00' },
    { daysOfWeek: [] },
    { daysOfWeek: ['monday', 'monday'] },
  ])('rejects recurrence restrictions: %j', (patch) => {
    expect(() =>
      validator.validate('recurrence', { ...recurrence('invalid'), ...patch }),
    ).toThrow(BadRequestException);
  });
  it('fails explicitly on entity-reference siblings that cannot be validated as record identities', () => {
    expect(() =>
      graphSchema({
        $ref: 'https://ifs-standards.org/v0.1/schemas/entities/occurrence.schema.json',
        required: ['duration'],
      }),
    ).toThrow('Unsupported inline entity-reference restriction');
  });
  it('allows omitted interval when a weekly weekday filter supplies the alternative', () => {
    expect(() =>
      validator.validate('recurrence', {
        ...recurrence('weekly'),
        interval: undefined,
        daysOfWeek: ['monday'],
      }),
    ).not.toThrow();
  });
});

describe('validated transactions (real database)', () => {
  let server: Awaited<ReturnType<typeof startSurrealServer>>;
  let service: SurrealService;
  beforeAll(async () => {
    server = await startSurrealServer();
    vi.stubEnv('SURREALDB_URL', server.endpoint);
    vi.stubEnv('SURREALDB_NAMESPACE', 'validated_test');
    vi.stubEnv('SURREALDB_DATABASE', 'test');
    vi.stubEnv('SURREALDB_USERNAME', 'test');
    vi.stubEnv('SURREALDB_PASSWORD', 'test');
    service = new SurrealService();
    await service.onModuleInit();
    await initializeDatabase(service.client, [
      'when',
      'occurrence',
      'recurrence',
      'member',
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

  it('validates merged PATCH state, and rolls back invalid scalar and conditional updates', async () => {
    const valid = { ...recurrence('patch'), daysOfWeek: ['monday'] };
    await service.createEntity('recurrence', valid);
    await expect(
      service.updateEntity('recurrence', valid.id, { frequency: 'daily' }),
    ).rejects.toBeInstanceOf(BadRequestException);
    expect(await service.findOne('recurrence', valid.id)).toEqual(valid);
    await expect(
      service.updateEntity('recurrence', valid.id, { interval: 1.5 }),
    ).rejects.toBeInstanceOf(BadRequestException);
    expect(
      await service.updateEntity('recurrence', valid.id, { duration: 'PT2H' }),
    ).toEqual({ ...valid, duration: 'PT2H' });
  });
  it('rejects empty schedules and reports useful schema paths without persisting them', async () => {
    try {
      await service.createEntity('when', schedule('empty'));
      throw new Error('Expected validation rejection');
    } catch (error) {
      expect(error).toBeInstanceOf(BadRequestException);
      const response = (error as BadRequestException).getResponse() as {
        errors: { instancePath: string; keyword: string }[];
      };
      expect(response.errors.some((item) => item.keyword === 'anyOf')).toBe(
        true,
      );
      expect(
        response.errors.some((item) => item.instancePath === '/occurrences'),
      ).toBe(true);
    }
    expect(await service.findOne('when', 'When/empty')).toBeNull();
  });
  it('validates generated child IDs and checks complete resulting nested entities', async () => {
    const child = { ...occurrence('unused'), id: null };
    const result = await service.createEntity<{
      occurrences: { id: string; duration: string }[];
    }>('when', { ...schedule('nested'), occurrences: [child] });
    const id = result.occurrences[0].id;
    expect(id).toMatch(/^Occurrence\//);
    await service.updateEntity('when', 'When/nested', {
      occurrences: [{ id, duration: 'PT2H' }],
    });
    const snapshot = await service.findOne('occurrence', id);
    await expect(
      service.updateEntity('when', 'When/nested', {
        occurrences: [
          { id, duration: 'PT99H' },
          { ...occurrence('bad'), startsAt: 'not-a-date' },
        ],
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
    expect(await service.findOne('occurrence', id)).toEqual(snapshot);
    expect(await service.findOne('occurrence', 'Occurrence/bad')).toBeNull();
    await expect(
      service.createEntity('when', {
        ...schedule('incomplete'),
        occurrences: [{ id: null, startsAt: '2026-07-01T00:00:00Z' }],
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
    expect(await service.findOne('when', 'When/incomplete')).toBeNull();
  });
  it('validates actual stored ID-only references, not fabricated submitted fields', async () => {
    await service.create('occurrence', {
      id: 'Occurrence/legacy-invalid',
      startsAt: 'invalid',
    });
    await expect(
      service.createEntity('when', {
        ...schedule('invalid-link'),
        occurrences: [{ id: 'Occurrence/legacy-invalid' }],
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
    expect(await service.findOne('when', 'When/invalid-link')).toBeNull();
  });
  it('permits server-derived read-only collections without accepting read-only writes', async () => {
    const member = {
      ...baseEntity('Member', 'readonly'),
      name: 'Alice',
      permissions: [],
      isOwner: false,
      updatedAt: '2026-07-01T00:00:00Z',
    };
    expect(
      await service.createEntity('member', {
        ...member,
        roles: [{ id: null }],
      }),
    ).toEqual({ ...member, roles: [] });
  });
  it('validates cyclic graphs entity-by-entity without recursive JSON expansion', async () => {
    const metric = {
      ...baseEntity('Metric', 'cycle'),
      name: 'Composite',
      description: 'Test',
      measurementWay: 'manual',
      measurementType: 'composite',
      method: baseEntity('MeasurementMethod', 'cycle-method'),
      compositionItems: [{ id: 'Metric/cycle' }],
    };
    const result = await service.createEntity<{
      compositionItems: { id: string }[];
    }>('metric', metric);
    expect(result.compositionItems).toEqual([{ id: metric.id }]);
  });
});
