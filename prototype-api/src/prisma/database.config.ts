import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { config } from 'dotenv';

// src/prisma and dist/prisma have the same depth, so CLI and runtime share a DB.
const projectRoot = fileURLToPath(new URL('../../', import.meta.url));
config({ path: resolve(projectRoot, '.env'), quiet: true });

export function getDatabaseUrl(
  value = process.env.DATABASE_URL ?? 'file:./prisma/dev.db',
): string {
  if (!value.startsWith('file:') || value.slice(5).trim() === '') {
    throw new Error('DATABASE_URL must be a nonempty SQLite file: URL.');
  }

  const filePath = value.slice(5);
  if (filePath.includes('?') || filePath.includes('#')) {
    throw new Error(
      'SQLite DATABASE_URL query strings and fragments are not supported.',
    );
  }

  // Resolve relative paths against prototype-api, not the caller's directory.
  return filePath === ':memory:'
    ? value
    : `file:${resolve(projectRoot, filePath)}`;
}
