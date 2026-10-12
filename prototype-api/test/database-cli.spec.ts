import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { fileURLToPath } from 'node:url';
import { Surreal } from 'surrealdb';
import { expect, it } from 'vitest';
import { startSurrealServer } from './support/surreal-server.js';

const exec = promisify(execFile);
const script = fileURLToPath(
  new URL('../scripts/database.mjs', import.meta.url),
);
const credentials = { SURREALDB_USERNAME: 'test', SURREALDB_PASSWORD: 'test' };

it('refuses remote endpoints before connecting', async () => {
  await expect(
    exec(process.execPath, [script, 'clear'], {
      env: {
        ...process.env,
        ...credentials,
        SURREALDB_URL: 'https://example.com/rpc',
      },
    }),
  ).rejects.toThrow('db:clear only supports a loopback');
});

it('clears only the selected database and reprovisions its tables', async () => {
  const server = await startSurrealServer();
  const db = new Surreal();
  try {
    await db.connect(server.endpoint, {
      namespace: 'cli_test',
      database: 'target',
      authentication: { username: 'test', password: 'test' },
    });
    await db.query(
      'DEFINE NAMESPACE cli_test; DEFINE DATABASE target; CREATE scratch:one;',
    );
    await db.use({ namespace: 'cli_test', database: 'other' });
    await db.query('DEFINE DATABASE other; CREATE scratch:one;');
    const env = {
      ...process.env,
      ...credentials,
      SURREALDB_URL: server.endpoint,
      SURREALDB_NAMESPACE: 'cli_test',
      SURREALDB_DATABASE: 'target',
    };
    await exec(process.execPath, [script, 'clear'], { env });
    await db.use({ namespace: 'cli_test', database: 'target' });
    const [info] =
      await db.query<[{ tables: Record<string, string> }]>('INFO FOR DB;');
    expect(info.tables).not.toHaveProperty('scratch');
    expect(info.tables).toHaveProperty('relationship_type');
    expect(info.tables.relationship).toMatch(/TYPE RELATION/);
    await db.use({ namespace: 'cli_test', database: 'other' });
    const [records] = await db.query<[unknown[]]>('SELECT * FROM scratch;');
    expect(records).toHaveLength(1);
    // Repeated clears remain usable.
    await exec(process.execPath, [script, 'clear'], { env });
  } finally {
    await db.close();
    await server.stop();
  }
}, 30_000);
