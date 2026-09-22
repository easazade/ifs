import { fileURLToPath } from 'node:url';
import { getDatabaseUrl } from './database.config.js';

const projectRoot = fileURLToPath(new URL('../../', import.meta.url));

describe('SQLite configuration', () => {
  afterEach(() => vi.unstubAllEnvs());

  it('defaults to the package-local development database', () => {
    vi.stubEnv('DATABASE_URL', undefined);
    expect(getDatabaseUrl()).toBe(`file:${projectRoot}prisma/dev.db`);
  });

  it('resolves relative URLs consistently for the CLI and application', () => {
    expect(getDatabaseUrl('file:./prisma/custom.db')).toBe(
      `file:${projectRoot}prisma/custom.db`,
    );
  });

  it('respects an explicit absolute database URL from the environment', () => {
    const url = `file:${projectRoot}prisma/custom.db`;
    vi.stubEnv('DATABASE_URL', url);
    expect(getDatabaseUrl()).toBe(url);
  });

  it('supports explicitly requested in-memory SQLite', () => {
    expect(getDatabaseUrl('file::memory:')).toBe('file::memory:');
  });

  it.each(['', 'postgresql://localhost/ifs', 'file:', 'file:   '])(
    'rejects invalid SQLite configuration: %s',
    (value) => {
      expect(() => getDatabaseUrl(value)).toThrow('SQLite file: URL');
    },
  );

  it.each(['file:./dev.db?mode=ro', 'file:./dev.db#fragment'])(
    'rejects unsupported URL options: %s',
    (value) => {
      expect(() => getDatabaseUrl(value)).toThrow('not supported');
    },
  );
});
