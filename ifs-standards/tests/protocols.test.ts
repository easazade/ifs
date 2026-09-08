import { describe, expect, it } from 'vitest';
import { getProtocolById, PROTOCOLS } from '../src/data/protocols';
import { ROUTES, SEGMENTS } from '../src/routes';

describe('protocol catalog and routes', () => {
  it.each(PROTOCOLS)('finds $id and constructs its detail route', (protocol) => {
    expect(getProtocolById(protocol.id)).toBe(protocol);
    expect(ROUTES.PROTOCOL_DETAIL(protocol.id)).toBe(`/${SEGMENTS.PROTOCOL}/${protocol.id}`);
  });

  it.each([undefined, '', 'unknown-protocol'])('handles a missing or unknown ID: %s', (id) => {
    expect(getProtocolById(id)).toBeUndefined();
  });

  it('preserves public route paths', () => {
    expect(ROUTES.INDEX).toBe('/');
    expect(ROUTES.WELCOME).toBe('/welcome');
    expect(ROUTES.ABOUT).toBe('/about');
    expect(ROUTES.FAQ).toBe('/faq');
    expect(ROUTES.HOW_IT_WORKS).toBe('/how-it-works');
    expect(ROUTES.PROTOCOL).toBe('/protocol');
  });

  it('keeps route definitions frozen at runtime', () => {
    expect(Object.isFrozen(ROUTES)).toBe(true);
    expect(Object.isFrozen(SEGMENTS)).toBe(true);
  });
});
