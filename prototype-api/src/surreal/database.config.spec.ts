import { describe, expect, it } from 'vitest';
import { getDatabaseConfig } from './database.config.js';

const credentials = {
  SURREALDB_USERNAME: 'test',
  SURREALDB_PASSWORD: 'secret',
};
describe('SurrealDB configuration', () => {
  it('uses local defaults with explicit credentials', () => {
    expect(getDatabaseConfig(credentials)).toEqual({
      endpoint: 'http://127.0.0.1:8000/rpc',
      namespace: 'ifs',
      database: 'prototype',
      authentication: { username: 'test', password: 'secret' },
    });
  });
  it('uses custom configuration', () => {
    expect(
      getDatabaseConfig({
        ...credentials,
        SURREALDB_URL: 'wss://db.example/rpc',
        SURREALDB_NAMESPACE: 'custom',
        SURREALDB_DATABASE: 'test',
      }).endpoint,
    ).toBe('wss://db.example/rpc');
  });
  it('rejects invalid endpoints, empty database names, and missing credentials', () => {
    expect(() =>
      getDatabaseConfig({ ...credentials, SURREALDB_URL: 'file:/tmp/data' }),
    ).toThrow('HTTP(S)');
    expect(() =>
      getDatabaseConfig({ ...credentials, SURREALDB_DATABASE: '' }),
    ).toThrow('must not be empty');
    expect(() => getDatabaseConfig({})).toThrow('SURREALDB_USERNAME');
  });
});
