import { spawnSync } from 'node:child_process';
import {
  cpSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { afterEach, describe, expect, it } from 'vitest';

const apiRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const temporaryDirectories: string[] = [];

afterEach(() => {
  for (const directory of temporaryDirectories.splice(0)) {
    rmSync(directory, { recursive: true, force: true });
  }
});

describe('all-resources generator', () => {
  it('generates all DTOs once before generating individual resources', () => {
    const root = mkdtempSync(join(tmpdir(), 'ifs-resources-generator-'));
    temporaryDirectories.push(root);

    const temporaryApi = join(root, 'prototype-api');
    const scriptsDirectory = join(temporaryApi, 'scripts');
    const standardsScripts = join(root, 'ifs-standards', 'scripts');
    mkdirSync(scriptsDirectory, { recursive: true });
    mkdirSync(standardsScripts, { recursive: true });

    cpSync(
      join(apiRoot, 'scripts', 'generate-resources.mjs'),
      join(scriptsDirectory, 'generate-resources.mjs'),
    );
    writeFileSync(
      join(standardsScripts, 'generate-order.json'),
      JSON.stringify(['member', 'role']),
    );
    writeFileSync(
      join(scriptsDirectory, 'generate-dtos.mjs'),
      `import { appendFileSync } from 'node:fs';\nappendFileSync(new URL('../calls', import.meta.url), 'dtos\\n');\n`,
    );
    writeFileSync(
      join(scriptsDirectory, 'generate-resource.mjs'),
      `import { appendFileSync } from 'node:fs';\nappendFileSync(new URL('../calls', import.meta.url), \`resource:\${process.argv.slice(2).join(':')}\\n\`);\n`,
    );

    const result = spawnSync(
      process.execPath,
      ['scripts/generate-resources.mjs'],
      { cwd: temporaryApi, encoding: 'utf8' },
    );

    expect(result.status).toBe(0);
    expect(
      readFileSync(join(temporaryApi, 'calls'), 'utf8').split('\n'),
    ).toEqual([
      'dtos',
      'resource:member:--skip-dtos',
      'resource:role:--skip-dtos',
      '',
    ]);
  });
});
