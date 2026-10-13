import { Ajv } from 'ajv';
import { describe, expect, it } from 'vitest';
import type { OpenAPIObject } from '@nestjs/swagger';
import { applyEntityContracts, toOpenApiSchema } from './schema-openapi.js';
import { entityContracts } from './surreal/entity-schemas.generated.js';
import { baseEntity } from '../test/support/entity-data.js';

function document() {
  return applyEntityContracts({
    components: {
      schemas: Object.fromEntries(
        [
          'CreateRecurrenceDto',
          'RecurrenceResponseDto',
          'UpdateRecurrenceDto',
          'NestedRecurrenceDto',
          'CreateWhenDto',
          'WhenResponseDto',
          'NestedOccurrenceDto',
          'MetricResponseDto',
          'MeasurementMethodResponseDto',
        ].map((name) => [name, {}]),
      ),
    },
  } as unknown as OpenAPIObject);
}

describe('canonical OpenAPI conversion', () => {
  it('retains root recurrence restrictions, local duration constraints, and integer interval', () => {
    const schemas = document().components!.schemas!;
    const recurrence = schemas.CreateRecurrenceDto as Record<string, any>;
    expect(recurrence.properties.interval.type).toBe('integer');
    expect(recurrence.anyOf).toEqual(entityContracts.recurrence.anyOf);
    expect(recurrence.allOf).toContainEqual({
      anyOf: [
        { not: { required: ['daysOfWeek'] } },
        { properties: { frequency: { enum: ['weekly'] } } },
      ],
    });
    expect(JSON.stringify(recurrence)).not.toContain('#/$defs/');
    expect(recurrence.properties.duration.type).toBe('string');
    expect(recurrence.properties.duration.pattern).toBeTruthy();
    expect(recurrence.properties.frequency.anyOf[1].allOf).toHaveLength(2);
    expect(schemas.RecurrenceResponseDto).toEqual(recurrence);
  });
  it('does not demand complete entities in PATCH/nested write bodies', () => {
    const schemas = document().components!.schemas!;
    for (const name of ['UpdateRecurrenceDto', 'NestedRecurrenceDto']) {
      expect(schemas[name]).not.toHaveProperty('required');
      expect(schemas[name]).not.toHaveProperty('anyOf');
      expect(schemas[name]).not.toHaveProperty('allOf');
    }
    expect((schemas.NestedRecurrenceDto as any).properties.id).toMatchObject({
      type: 'string',
      nullable: true,
    });
    expect(
      (schemas.NestedRecurrenceDto as any).properties.id,
    ).not.toHaveProperty('pattern');
  });
  it('keeps the nonempty When alternatives and maps write/response relation references separately', () => {
    const schemas = document().components!.schemas!;
    expect((schemas.CreateWhenDto as any).anyOf).toEqual(
      entityContracts.when.anyOf,
    );
    expect(
      (schemas.CreateWhenDto as any).properties.occurrences.items.$ref,
    ).toBe('#/components/schemas/NestedOccurrenceDto');
    expect(
      (schemas.WhenResponseDto as any).properties.occurrences.items.anyOf[0]
        .$ref,
    ).toBe('#/components/schemas/OccurrenceResponseDto');
  });
  it('exports restrictions that reject invalid recurrence data, not just matching metadata', () => {
    const converted = toOpenApiSchema(entityContracts.recurrence);
    const validate = new Ajv({ strict: false, validateFormats: false }).compile(
      converted,
    );
    const valid = {
      ...baseEntity('Recurrence', 'openapi'),
      startsAt: '2026-07-01T00:00:00Z',
      frequency: 'weekly',
      interval: 1,
    };
    expect(validate(valid)).toBe(true);
    for (const patch of [
      { interval: undefined },
      { interval: 1.5 },
      { frequency: 'daily', daysOfWeek: ['monday'] },
      { duration: 'invalid' },
      { frequency: 'PT0S' },
    ]) {
      expect(validate({ ...valid, ...patch })).toBe(false);
    }
  });
  it('describes ID-only cycle responses without accepting incomplete expanded entities', () => {
    const schemas = document().components!.schemas!;
    const validate = new Ajv({ strict: false, validateFormats: false }).compile(
      {
        $ref: '#/components/schemas/MetricResponseDto',
        components: { schemas },
      },
    );
    const metric = {
      ...baseEntity('Metric', 'cycle'),
      name: 'Composite',
      description: 'Test',
      measurementWay: 'manual',
      measurementType: 'composite',
      method: baseEntity('MeasurementMethod', 'method'),
      compositionItems: [{ id: 'Metric/cycle' }],
    };
    expect(validate(metric)).toBe(true);
    expect(
      validate({
        ...metric,
        compositionItems: [{ id: 'Metric/cycle', name: 'Incomplete' }],
      }),
    ).toBe(false);
  });
  it('translates if/then/else equivalently and rejects unsupported keywords loudly', () => {
    const converted = toOpenApiSchema({
      type: 'object',
      if: { properties: { mode: { const: 'a' } }, required: ['mode'] },
      // oxlint-disable-next-line unicorn/no-thenable -- JSON Schema conditional, not a Promise.
      then: { required: ['a'] },
      else: { required: ['b'] },
    });
    const validate = new Ajv({ strict: false }).compile(converted);
    expect(validate({ mode: 'a', a: true })).toBe(true);
    expect(validate({ mode: 'a', b: true })).toBe(false);
    expect(validate({ mode: 'b', b: true })).toBe(true);
    expect(validate({ mode: 'b', a: true })).toBe(false);
    expect(() => toOpenApiSchema({ contains: { type: 'string' } })).toThrow(
      'Unsupported OpenAPI validation keyword',
    );
    expect(() => toOpenApiSchema({ $ref: '#/$defs/missing' })).toThrow(
      'Unsupported OpenAPI schema reference',
    );
  });
  it('preserves intersecting enum/const and null-only restrictions', () => {
    const ajv = new Ajv({ strict: false });
    const intersection = ajv.compile(
      toOpenApiSchema({ type: 'string', enum: ['a', 'b'], const: 'a' }),
    );
    expect(intersection('a')).toBe(true);
    expect(intersection('b')).toBe(false);
    const nullOnly = ajv.compile(toOpenApiSchema({ type: 'null' }));
    expect(nullOnly(null)).toBe(true);
    expect(nullOnly('anything')).toBe(false);
    const impossible = ajv.compile(
      toOpenApiSchema({ type: 'null', enum: ['a'] }),
    );
    expect(impossible(null)).toBe(false);
    expect(impossible('a')).toBe(false);
  });
  it('preserves constraints alongside entity refs using an OpenAPI 3.0 allOf intersection', () => {
    const result = toOpenApiSchema({
      $ref: entityContracts.occurrence.$id,
      description: 'Child',
    });
    expect(result).toEqual({
      description: 'Child',
      allOf: [
        {
          anyOf: [
            { $ref: '#/components/schemas/OccurrenceResponseDto' },
            {
              type: 'object',
              required: ['id'],
              additionalProperties: false,
              properties: {
                id: toOpenApiSchema(
                  (
                    entityContracts.occurrence.properties as Record<
                      string,
                      unknown
                    >
                  ).id,
                ),
              },
            },
          ],
        },
      ],
    });
  });
});
