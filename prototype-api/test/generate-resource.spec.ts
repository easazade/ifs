import { spawnSync } from 'node:child_process';
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
const workspaceRoot = resolve(apiRoot, '..');
const temporaryDirectories: string[] = [];

afterEach(() => {
  for (const directory of temporaryDirectories.splice(0)) {
    rmSync(directory, { recursive: true, force: true });
  }
});

function fixture(
  withDtos = true,
  relations = [
    { property: 'permissions', type: 'Permission' },
    { property: 'roles', type: 'Role' },
  ],
) {
  const root = mkdtempSync(join(tmpdir(), 'ifs-resource-generator-'));
  temporaryDirectories.push(root);

  const temporaryApi = join(root, 'prototype-api');
  const scriptsDirectory = join(temporaryApi, 'scripts');
  const standardsRoot = join(root, 'ifs-standards');
  const entityDirectory = join(standardsRoot, 'src', 'entities', 'member');
  mkdirSync(scriptsDirectory, { recursive: true });
  mkdirSync(entityDirectory, { recursive: true });
  mkdirSync(join(standardsRoot, 'scripts'), { recursive: true });
  mkdirSync(join(temporaryApi, 'prisma'), { recursive: true });
  cpSync(
    join(apiRoot, 'scripts', 'generate-resource.mjs'),
    join(scriptsDirectory, 'generate-resource.mjs'),
  );
  cpSync(
    join(
      workspaceRoot,
      'ifs-standards',
      'src',
      'entities',
      'member',
      'member.schema.json',
    ),
    join(entityDirectory, 'member.schema.json'),
  );
  writeFileSync(
    join(temporaryApi, 'prisma', 'schema.prisma'),
    'model Member {\n  id String @id\n  permissions Permission[]\n  roles Role[]\n}\n',
  );
  writeFileSync(
    join(standardsRoot, 'scripts', 'entity-relations.json'),
    JSON.stringify({ Member: relations }),
  );

  if (withDtos) writeDtos(temporaryApi);
  return temporaryApi;
}

function writeDtos(temporaryApi: string) {
  const dtoDirectory = join(temporaryApi, 'src', 'member', 'dto');
  mkdirSync(dtoDirectory, { recursive: true });
  for (const [fileName, className] of [
    ['create-member.dto.ts', 'CreateMemberDto'],
    ['update-member.dto.ts', 'UpdateMemberDto'],
    ['member-response.dto.ts', 'MemberResponseDto'],
  ]) {
    writeFileSync(
      join(dtoDirectory, fileName),
      `export class ${className} {}\n`,
    );
  }
}

function run(temporaryApi: string, entity = 'member') {
  return spawnSync(
    process.execPath,
    ['scripts/generate-resource.mjs', entity, '--skip-format'],
    { cwd: temporaryApi, encoding: 'utf8' },
  );
}

describe('resource generator', () => {
  it('rejects entities that are not defined by IFS standards', () => {
    const temporaryApi = fixture();
    const result = run(temporaryApi, 'unknown-entity');

    expect(result.status).toBe(1);
    expect(result.stderr).toContain('is not defined in IFS standards');
  });

  it('generates an idempotent Nest service backed by PrismaService', () => {
    const temporaryApi = fixture();
    const firstResult = run(temporaryApi, 'Member');
    const servicePath = join(
      temporaryApi,
      'src',
      'member',
      'member.service.ts',
    );
    const firstSource = readFileSync(servicePath, 'utf8');
    const secondResult = run(temporaryApi, 'member');

    expect(firstResult.status).toBe(0);
    expect(secondResult.status).toBe(0);
    expect(readFileSync(servicePath, 'utf8')).toBe(firstSource);
    expect(firstSource).toContain('@Injectable()');
    expect(firstSource).toContain('private readonly prisma: PrismaService');
    expect(firstSource).toContain('Prisma.MemberCreateInput');
    expect(firstSource).toContain('const memberRelations = {');
    expect(firstSource).toContain('permissions: true');
    expect(firstSource).toContain('roles: true');
    expect(firstSource.match(/include: memberRelations/g)).toHaveLength(5);

    const controllerSource = readFileSync(
      join(temporaryApi, 'src', 'member', 'member.controller.ts'),
      'utf8',
    );
    expect(controllerSource).toContain("@Controller('members')");
    expect(controllerSource).toContain("operationId: 'createMember'");
    expect(controllerSource).toContain(
      '@ApiCreatedResponse({ type: MemberResponseDto })',
    );
    expect(controllerSource).toContain('@ApiBody({ type: CreateMemberDto })');
    expect(controllerSource).toContain("@ApiParam({ name: 'id'");

    const moduleSource = readFileSync(
      join(temporaryApi, 'src', 'member', 'member.module.ts'),
      'utf8',
    );
    expect(moduleSource).toContain('controllers: [MemberController]');
    expect(moduleSource).toContain('providers: [MemberService]');

    const resourcesSource = readFileSync(
      join(temporaryApi, 'src', 'generated-resources.module.ts'),
      'utf8',
    );
    expect(resourcesSource).toContain('import { MemberModule }');
    expect(resourcesSource).toContain('imports: [MemberModule]');
  });

  it('omits Prisma include when the entity has no relations', () => {
    const temporaryApi = fixture(true, []);
    const result = run(temporaryApi);
    const source = readFileSync(
      join(temporaryApi, 'src', 'member', 'member.service.ts'),
      'utf8',
    );

    expect(result.status).toBe(0);
    expect(source).toContain('this.prisma.member.findMany()');
    expect(source).not.toContain('include:');
  });

  it('runs the all-DTO generator when DTOs are missing', () => {
    const temporaryApi = fixture(false);
    const generatorPath = join(temporaryApi, 'scripts', 'generate-dtos.mjs');
    writeFileSync(
      generatorPath,
      `import { mkdirSync, writeFileSync } from 'node:fs';\nimport { join } from 'node:path';\nconst root = process.cwd();\nconst dto = join(root, 'src', 'member', 'dto');\nmkdirSync(dto, { recursive: true });\nfor (const [file, name] of [['create-member.dto.ts', 'CreateMemberDto'], ['update-member.dto.ts', 'UpdateMemberDto'], ['member-response.dto.ts', 'MemberResponseDto']]) writeFileSync(join(dto, file), \`export class \${name} {}\\n\`);\nwriteFileSync(join(root, 'generator-ran'), 'yes');\n`,
    );

    const result = run(temporaryApi);

    expect(result.status).toBe(0);
    expect(existsSync(join(temporaryApi, 'generator-ran'))).toBe(true);
    expect(
      existsSync(join(temporaryApi, 'src', 'member', 'member.service.ts')),
    ).toBe(true);
  });

  it('does not overwrite a hand-written controller', () => {
    const temporaryApi = fixture();
    const controllerPath = join(
      temporaryApi,
      'src',
      'member',
      'member.controller.ts',
    );
    mkdirSync(dirname(controllerPath), { recursive: true });
    writeFileSync(controllerPath, 'export class MemberController {}\n');

    const result = run(temporaryApi);

    expect(result.status).toBe(1);
    expect(result.stderr).toContain('Refusing to overwrite controller');
    expect(readFileSync(controllerPath, 'utf8')).toBe(
      'export class MemberController {}\n',
    );
  });

  it('does not overwrite a hand-written service', () => {
    const temporaryApi = fixture();
    const servicePath = join(
      temporaryApi,
      'src',
      'member',
      'member.service.ts',
    );
    writeFileSync(servicePath, 'export class MemberService {}\n');

    const result = run(temporaryApi);

    expect(result.status).toBe(1);
    expect(result.stderr).toContain('Refusing to overwrite service');
    expect(readFileSync(servicePath, 'utf8')).toBe(
      'export class MemberService {}\n',
    );
  });
});
