import { execFileSync, spawnSync } from 'node:child_process';
import {
  appendFileSync,
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
const workspaceRoot = resolve(apiRoot, '..');
const temporaryDirectories: string[] = [];

afterEach(() => {
  for (const directory of temporaryDirectories.splice(0)) {
    rmSync(directory, { recursive: true, force: true });
  }
});

function fixture() {
  const root = mkdtempSync(join(tmpdir(), 'ifs-dto-generator-'));
  temporaryDirectories.push(root);

  const temporaryApi = join(root, 'prototype-api');
  const standardsEntities = join(root, 'ifs-standards', 'src', 'entities');
  mkdirSync(join(temporaryApi, 'scripts'), { recursive: true });
  mkdirSync(join(temporaryApi, 'prisma'), { recursive: true });
  cpSync(
    join(apiRoot, 'scripts', 'generate-dto.mjs'),
    join(temporaryApi, 'scripts', 'generate-dto.mjs'),
  );
  // Keep fixture independent from generated models committed in the real schema.
  writeFileSync(join(temporaryApi, 'prisma', 'schema.prisma'), '');

  for (const entity of ['member', 'role', 'permission', 'scope']) {
    const entityDirectory = join(standardsEntities, entity);
    mkdirSync(entityDirectory, { recursive: true });
    cpSync(
      join(
        workspaceRoot,
        'ifs-standards',
        'src',
        'entities',
        entity,
        `${entity}.schema.json`,
      ),
      join(entityDirectory, `${entity}.schema.json`),
    );
  }

  return temporaryApi;
}

function addRelatedArtifacts(temporaryApi: string) {
  appendFileSync(
    join(temporaryApi, 'prisma', 'schema.prisma'),
    '\nmodel Role {\n  id String @id\n}\n\nmodel Permission {\n  id String @id\n}\n',
  );

  for (const [entity, model] of [
    ['role', 'Role'],
    ['permission', 'Permission'],
  ]) {
    const dtoDirectory = join(temporaryApi, 'src', entity, 'dto');
    mkdirSync(dtoDirectory, { recursive: true });
    writeFileSync(
      join(dtoDirectory, `${entity}-response.dto.ts`),
      `export class ${model}ResponseDto {}\n`,
    );
  }
}

function run(temporaryApi: string, entity = 'member') {
  return execFileSync(
    process.execPath,
    ['scripts/generate-dto.mjs', entity, '--skip-prisma-generate'],
    { cwd: temporaryApi },
  );
}

describe('DTO generator', () => {
  it('fails before writing when related Prisma models are missing', () => {
    const temporaryApi = fixture();
    const result = spawnSync(
      process.execPath,
      ['scripts/generate-dto.mjs', 'member', '--skip-prisma-generate'],
      { cwd: temporaryApi, encoding: 'utf8' },
    );

    expect(result.status).toBe(1);
    expect(result.stderr).toContain(
      'Required related Prisma models do not exist: Role, Permission',
    );
    expect(existsSync(join(temporaryApi, 'src', 'member'))).toBe(false);
    expect(
      readFileSync(join(temporaryApi, 'prisma', 'schema.prisma'), 'utf8'),
    ).not.toContain('model Member');
  });

  it('generates typed DTO and Prisma list relations idempotently', () => {
    const temporaryApi = fixture();
    addRelatedArtifacts(temporaryApi);

    run(temporaryApi);
    const createDto = readFileSync(
      join(temporaryApi, 'src', 'member', 'dto', 'create-member.dto.ts'),
      'utf8',
    );
    const responseDto = readFileSync(
      join(temporaryApi, 'src', 'member', 'dto', 'member-response.dto.ts'),
      'utf8',
    );
    const firstPrismaSchema = readFileSync(
      join(temporaryApi, 'prisma', 'schema.prisma'),
      'utf8',
    );

    expect(createDto).toContain('PermissionResponseDto');
    expect(createDto).not.toContain('\n  roles:');
    expect(responseDto).toContain('roles: Array<RoleResponseDto>');
    expect(responseDto).toContain('permissions: Array<PermissionResponseDto>');
    expect(firstPrismaSchema).toContain(
      'roles Role[] @relation("Member_roles")',
    );
    expect(firstPrismaSchema).toContain(
      'permissions Permission[] @relation("Member_permissions")',
    );
    expect(firstPrismaSchema).toContain(
      'relationFromMemberRoles Member[] @relation("Member_roles")',
    );
    expect(firstPrismaSchema).toContain(
      'relationFromMemberPermissions Member[] @relation("Member_permissions")',
    );

    run(temporaryApi);
    expect(
      readFileSync(join(temporaryApi, 'prisma', 'schema.prisma'), 'utf8'),
    ).toBe(firstPrismaSchema);
  });

  it('converts JSON Schema examples to an OpenAPI 3.0 example', () => {
    const temporaryApi = fixture();
    addRelatedArtifacts(temporaryApi);
    const schemaPath = join(
      temporaryApi,
      '..',
      'ifs-standards',
      'src',
      'entities',
      'member',
      'member.schema.json',
    );
    const schema = JSON.parse(readFileSync(schemaPath, 'utf8'));
    schema.properties.name.examples = ['Alice', 'Bob'];
    writeFileSync(schemaPath, `${JSON.stringify(schema, null, 2)}\n`);

    run(temporaryApi);
    const createDto = readFileSync(
      join(temporaryApi, 'src', 'member', 'dto', 'create-member.dto.ts'),
      'utf8',
    );

    expect(createDto).toContain('example: "Alice"');
    expect(createDto).not.toContain('examples:');
  });

  it('keeps an existing generated model in its original position', () => {
    const temporaryApi = fixture();
    addRelatedArtifacts(temporaryApi);
    run(temporaryApi);

    appendFileSync(
      join(temporaryApi, 'prisma', 'schema.prisma'),
      '\nmodel AuditLog {\n  id String @id\n}\n',
    );
    run(temporaryApi);

    const prismaSchema = readFileSync(
      join(temporaryApi, 'prisma', 'schema.prisma'),
      'utf8',
    );
    expect(prismaSchema.indexOf('model Member')).toBeLessThan(
      prismaSchema.indexOf('model AuditLog'),
    );
  });

  it('uses a matching ID property for a required single relation', () => {
    const temporaryApi = fixture();
    appendFileSync(
      join(temporaryApi, 'prisma', 'schema.prisma'),
      '\nmodel Scope {\n  id String @id\n}\n\nmodel Permission {\n  id String @id\n}\n',
    );
    for (const [entity, model] of [
      ['scope', 'Scope'],
      ['permission', 'Permission'],
    ]) {
      const dtoDirectory = join(temporaryApi, 'src', entity, 'dto');
      mkdirSync(dtoDirectory, { recursive: true });
      writeFileSync(
        join(dtoDirectory, `${entity}-response.dto.ts`),
        `export class ${model}ResponseDto {}\n`,
      );
    }

    run(temporaryApi, 'role');
    const prismaSchema = readFileSync(
      join(temporaryApi, 'prisma', 'schema.prisma'),
      'utf8',
    );

    expect(prismaSchema).toContain(
      'scope Scope @relation("Role_scope", fields: [scopeId], references: [id])',
    );
    expect(prismaSchema).toContain(
      'relationFromRoleScope Role[] @relation("Role_scope")',
    );
  });
});
