#!/usr/bin/env node
import { spawn } from 'node:child_process';
import { mkdirSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { Surreal } from 'surrealdb';
// Node 24 supports stripping the types in this dependency-free config module.
import { getDatabaseConfig } from '../src/surreal/database.config.ts';
import { initializeDatabase } from '../src/surreal/database.setup.ts';

const root = fileURLToPath(new URL('../', import.meta.url));
const command = process.argv[2];
try {
  const { endpoint, ...options } = getDatabaseConfig();
  if (['start', 'memory', 'sql'].includes(command)) {
    const url = new URL(endpoint);
    if (
      command !== 'sql' &&
      !['localhost', '127.0.0.1', '[::1]'].includes(url.hostname)
    ) {
      throw new Error('db:start only supports a loopback SURREALDB_URL.');
    }
    mkdirSync(new URL('../.surreal/', import.meta.url), { recursive: true });
    const args =
      command === 'sql'
        ? [
            'sql',
            '--endpoint',
            endpoint,
            '--namespace',
            options.namespace,
            '--database',
            options.database,
          ]
        : [
            'start',
            '--bind',
            `${url.hostname}:${url.port || '8000'}`,
            command === 'memory' ? 'memory' : 'rocksdb:.surreal/data',
          ];
    // Avoid exposing credentials in process arguments.
    const child = spawn('surreal', args, {
      cwd: root,
      stdio: 'inherit',
      env: {
        ...process.env,
        SURREAL_USER: options.authentication.username,
        SURREAL_PASS: options.authentication.password,
      },
    });
    child.on('error', (error) => {
      console.error(
        `Could not run the SurrealDB CLI. Install SurrealDB 3.x: ${error.message}`,
      );
      process.exitCode = 1;
    });
    child.on('exit', (code) => {
      process.exitCode = code ?? 1;
    });
    for (const signal of ['SIGINT', 'SIGTERM'])
      process.on(signal, () => child.kill(signal));
  } else if (['setup', 'status'].includes(command)) {
    const db = new Surreal();
    try {
      await db.connect(endpoint, options);
      if (command === 'setup') {
        const entities = JSON.parse(
          readFileSync(
            new URL(
              '../../ifs-standards/scripts/generate-order.json',
              import.meta.url,
            ),
            'utf8',
          ),
        );
        const tables = entities.map((entity) => entity.replaceAll('-', '_'));
        if (tables.some((table) => !/^[a-z][a-z0-9_]*$/.test(table)))
          throw new Error('Invalid entity table name.');
        // Idempotent and additive: never reset, drop, or replace existing data.
        await initializeDatabase(db, tables);
        console.log(
          `Configured ${tables.length} tables in ${options.namespace}/${options.database}.`,
        );
      } else {
        await db.query('INFO FOR DB;');
        console.log(
          `Connected to ${endpoint} (${options.namespace}/${options.database}).`,
        );
        console.log(await db.version());
      }
    } finally {
      await db.close();
    }
  } else throw new Error('Usage: database.mjs <start|memory|setup|status|sql>');
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
}
