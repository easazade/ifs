import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { config } from 'dotenv';

const projectRoot = fileURLToPath(new URL('../../', import.meta.url));
config({ path: resolve(projectRoot, '.env'), quiet: true });

export function getDatabaseConfig(env = process.env) {
  const endpoint = env.SURREALDB_URL ?? 'http://127.0.0.1:8000/rpc';
  const url = new URL(endpoint);
  if (!['http:', 'https:', 'ws:', 'wss:'].includes(url.protocol)) {
    throw new Error('SURREALDB_URL must use HTTP(S) or WS(S).');
  }
  const namespace = env.SURREALDB_NAMESPACE ?? 'ifs';
  const database = env.SURREALDB_DATABASE ?? 'prototype';
  if (!namespace.trim() || !database.trim()) {
    throw new Error('SurrealDB namespace and database must not be empty.');
  }
  const username = env.SURREALDB_USERNAME;
  const password = env.SURREALDB_PASSWORD;
  if (!username || !password) {
    throw new Error('Set SURREALDB_USERNAME and SURREALDB_PASSWORD.');
  }
  return {
    endpoint,
    namespace,
    database,
    authentication: { username, password },
  };
}
