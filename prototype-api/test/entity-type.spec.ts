import { BadRequestException } from '@nestjs/common';
import { describe, expect, it, vi } from 'vitest';
import { assertEntityType } from '../src/surreal/entity-type.js';
import { MemberService } from '../src/member/member.service.js';
import { RelationshipService } from '../src/relationship/relationship.service.js';
import type { SurrealService } from '../src/surreal/surreal.service.js';

describe('entityType enforcement', () => {
  it('requires an exact discriminator on create', () => {
    expect(() =>
      assertEntityType({ entityType: 'Member' }, 'Member'),
    ).not.toThrow();
    expect(() =>
      assertEntityType({ entityType: 'Geographic Area' }, 'Geographic Area'),
    ).not.toThrow();
    for (const entityType of [
      undefined,
      null,
      'member',
      'Organization',
      123,
      {},
      ['Member'],
    ]) {
      expect(() => assertEntityType({ entityType }, 'Member')).toThrow(
        BadRequestException,
      );
    }
    for (const data of [undefined, null, [], 'Member', {}]) {
      expect(() => assertEntityType(data, 'Member')).toThrow(
        BadRequestException,
      );
    }
  });

  it('allows omitted or unchanged types on PATCH, but not invalid supplied values', () => {
    expect(() =>
      assertEntityType({ name: 'Alice' }, 'Member', true),
    ).not.toThrow();
    expect(() =>
      assertEntityType({ entityType: 'Member' }, 'Member', true),
    ).not.toThrow();
    for (const entityType of [undefined, null, 'member', 'Role', 123]) {
      expect(() => assertEntityType({ entityType }, 'Member', true)).toThrow(
        BadRequestException,
      );
    }
  });

  for (const Service of [MemberService, RelationshipService]) {
    it(`${Service.name} rejects mismatches before any database call`, () => {
      const database = {
        create: vi.fn(),
        update: vi.fn(),
        createEdge: vi.fn(),
        updateEdge: vi.fn(),
      };
      const service = new Service(database as unknown as SurrealService);
      expect(() => service.create({ entityType: 'Wrong' } as never)).toThrow(
        BadRequestException,
      );
      expect(() => service.create({} as never)).toThrow(BadRequestException);
      expect(() =>
        service.update('test', { entityType: 'Wrong' } as never),
      ).toThrow(BadRequestException);
      for (const method of Object.values(database))
        expect(method).not.toHaveBeenCalled();
    });
  }
});
