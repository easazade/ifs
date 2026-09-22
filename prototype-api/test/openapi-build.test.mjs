import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtemp, readFile, readdir, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';

// Unlike Vitest's source transforms, this exercises the real Nest CLI plugin.
test('compiled OpenAPI export is deterministic and does not open SQLite or a port', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'ifs-openapi-'));
  const specUrl = new URL('../openapi.json', import.meta.url);
  const expected = await readFile(specUrl, 'utf8');
  try {
    execFileSync(
      process.execPath,
      [fileURLToPath(new URL('../dist/generate-openapi.js', import.meta.url))],
      {
        cwd: directory,
        env: {
          ...process.env,
          // Connecting would fail because the parent directory does not exist.
          DATABASE_URL: `file:${join(directory, 'missing', 'test.db')}`,
          PORT: 'not-a-port',
        },
        timeout: 30_000,
        stdio: 'pipe',
      },
    );
    const exported = await readFile(specUrl, 'utf8');
    assert.equal(
      exported,
      expected,
      'Regenerate and commit the OpenAPI contract',
    );
    const operation = JSON.parse(exported).paths['/'].get;
    // This summary exists only if the Swagger compiler plugin ran.
    assert.equal(operation.summary, 'Return the prototype API greeting.');
    assert.equal(operation.operationId, 'getHello');
    assert.equal(
      operation.responses['200'].content['text/plain'].schema.type,
      'string',
    );
    assert.deepEqual(await readdir(directory), []);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});
