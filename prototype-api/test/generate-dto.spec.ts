import { execFileSync, spawnSync } from 'node:child_process';
import {
  cpSync,
  existsSync,
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
const directories: string[] = [];
afterEach(() => {
  for (const directory of directories.splice(0))
    rmSync(directory, { recursive: true, force: true });
});
function fixture() {
  const root = mkdtempSync(join(tmpdir(), 'ifs-dto-'));
  directories.push(root);
  const api = join(root, 'prototype-api');
  mkdirSync(join(api, 'scripts'), { recursive: true });
  cpSync(
    join(apiRoot, 'scripts/generate-dto.mjs'),
    join(api, 'scripts/generate-dto.mjs'),
  );
  for (const entity of [
    'member',
    'role',
    'permission',
    'scope',
    'geographic-area',
  ]) {
    const target = join(root, 'ifs-standards/src/entities', entity);
    mkdirSync(target, { recursive: true });
    cpSync(
      join(
        apiRoot,
        '../ifs-standards/src/entities',
        entity,
        `${entity}.schema.json`,
      ),
      join(target, `${entity}.schema.json`),
    );
  }
  return api;
}
function dependencies(api: string) {
  for (const [entity, name] of [
    ['role', 'Role'],
    ['permission', 'Permission'],
  ]) {
    const dto = join(api, 'src', entity, 'dto');
    mkdirSync(dto, { recursive: true });
    writeFileSync(
      join(dto, `${entity}-response.dto.ts`),
      `export class ${name}ResponseDto {}`,
    );
  }
}
function run(api: string, entity = 'member') {
  execFileSync(
    process.execPath,
    ['scripts/generate-dto.mjs', entity, '--skip-format'],
    { cwd: api },
  );
}
function source(api: string, entity: string, file: string) {
  return readFileSync(join(api, 'src', entity, 'dto', file), 'utf8');
}

describe('DTO generator', () => {
  it('emits nested polygon arrays', () => {
    const api = fixture();
    run(api, 'geographic-area');
    const dto = source(api, 'geographic-area', 'create-geographic-area.dto.ts');
    expect(dto).toContain('polygons: Array<Array<Array<Array<number>>>>');
    expect(dto).toContain(
      '"items":{"type":"array","minItems":4,"items":{"type":"array","minItems":2,"maxItems":3,"items":{"type":"number"}}}',
    );
  });
  it('fails before writing when related response DTOs are missing', () => {
    const api = fixture();
    const result = spawnSync(
      process.execPath,
      ['scripts/generate-dto.mjs', 'member', '--skip-format'],
      { cwd: api, encoding: 'utf8' },
    );
    expect(result.status).toBe(1);
    expect(result.stderr).toContain(
      'Required related response DTOs do not exist: RoleResponseDto, PermissionResponseDto',
    );
    expect(existsSync(join(api, 'src/member'))).toBe(false);
  });
  it('generates typed relation DTOs idempotently without a database', () => {
    const api = fixture();
    dependencies(api);
    run(api);
    const create = source(api, 'member', 'create-member.dto.ts');
    const response = source(api, 'member', 'member-response.dto.ts');
    expect(create).not.toContain('\n  roles:');
    expect(response).toContain('roles: Array<RoleResponseDto>');
    expect(response).toContain('permissions: Array<PermissionResponseDto>');
    run(api);
    expect(source(api, 'member', 'member-response.dto.ts')).toBe(response);
    expect(source(api, 'member', 'create-member.dto.ts')).toBe(create);
  });
  it('converts JSON Schema examples to an OpenAPI example', () => {
    const api = fixture();
    dependencies(api);
    const path = join(
      api,
      '../ifs-standards/src/entities/member/member.schema.json',
    );
    const schema = JSON.parse(readFileSync(path, 'utf8'));
    schema.properties.name.examples = ['Alice', 'Bob'];
    writeFileSync(path, JSON.stringify(schema));
    run(api);
    expect(source(api, 'member', 'create-member.dto.ts')).toContain(
      'example: "Alice"',
    );
    expect(source(api, 'member', 'create-member.dto.ts')).not.toContain(
      'examples:',
    );
  });
  it('emits object array item schemas', () => {
    const api = fixture();
    const path = join(
      api,
      '../ifs-standards/src/entities/geographic-area/geographic-area.schema.json',
    );
    const schema = JSON.parse(readFileSync(path, 'utf8'));
    schema.properties.polygons.items = {
      type: 'object',
      properties: { name: { type: 'string' } },
      required: ['name'],
    };
    writeFileSync(path, JSON.stringify(schema));
    run(api, 'geographic-area');
    expect(
      source(api, 'geographic-area', 'create-geographic-area.dto.ts'),
    ).toContain(
      'items: {"type":"object","required":["name"],"properties":{"name":{"type":"string"}}}',
    );
  });
});
