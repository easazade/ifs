import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { createServer } from 'node:net';

// Every test suite gets its own authenticated, disposable in-memory server.
// Install SurrealDB 3.x or set SURREALDB_BINARY to its executable path.
export async function startSurrealServer() {
  const listener = createServer();
  listener.listen(0, '127.0.0.1');
  await once(listener, 'listening');
  const address = listener.address();
  if (!address || typeof address === 'string') throw new Error('No test port.');
  const port = address.port;
  await new Promise<void>((resolve) => listener.close(() => resolve()));
  const endpoint = `http://127.0.0.1:${port}`;
  const child = spawn(
    process.env.SURREALDB_BINARY ?? 'surreal',
    [
      'start',
      '--bind',
      `127.0.0.1:${port}`,
      '--user',
      'test',
      '--pass',
      'test',
      'memory',
    ],
    { stdio: ['ignore', 'pipe', 'pipe'] },
  );
  let failure: Error | undefined;
  let output = '';
  child.on('error', (error) => {
    failure = error;
  });
  child.stderr.on('data', (chunk) => {
    output += chunk.toString();
  });
  child.stdout.on('data', (chunk) => {
    output += chunk.toString();
  });
  const stop = async () => {
    if (child.exitCode !== null || child.signalCode !== null || !child.pid)
      return;
    const exited = once(child, 'exit');
    child.kill('SIGTERM');
    const timer = setTimeout(() => child.kill('SIGKILL'), 5_000);
    try {
      await exited;
    } finally {
      clearTimeout(timer);
    }
  };
  try {
    const deadline = Date.now() + 15_000;
    while (Date.now() < deadline) {
      if (failure) throw failure;
      if (child.exitCode !== null) throw new Error(output);
      try {
        if ((await fetch(`${endpoint}/health`)).ok) {
          return { endpoint: `${endpoint}/rpc`, stop };
        }
      } catch {
        /* Server is still starting. */
      }
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    throw new Error(`Timed out starting test SurrealDB: ${output}`);
  } catch (error) {
    await stop();
    throw new Error(
      `Install SurrealDB 3.x for database tests: ${String(error)}`,
    );
  }
}
