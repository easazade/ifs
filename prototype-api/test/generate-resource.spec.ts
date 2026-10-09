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
  for (const name of ['entity-schema.ts', 'entity-metadata.ts']) {
    cpSync(
      join(workspaceRoot, 'ifs-standards/scripts', name),
      join(standardsRoot, 'scripts', name),
    );
  }
  const baseDirectory = join(standardsRoot, 'src/entities/entity');
  mkdirSync(baseDirectory, { recursive: true });
  cpSync(
    join(workspaceRoot, 'ifs-standards/src/entities/entity/entity.schema.json'),
    join(baseDirectory, 'entity.schema.json'),
  );
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
    join(standardsRoot, 'scripts', 'entity-relations.json'),
    JSON.stringify({ Member: relations }),
  );

  mkdirSync(join(temporaryApi, 'src/surreal'), { recursive: true });
  cpSync(
    join(apiRoot, 'src/surreal/entity-storage.ts'),
    join(temporaryApi, 'src/surreal/entity-storage.ts'),
  );
  if (withDtos) writeDtos(temporaryApi);
  writeFileSync(
    join(scriptsDirectory, 'generate-dtos.mjs'),
    `import { appendFileSync } from 'node:fs';\nappendFileSync(new URL('../generator-ran', import.meta.url), 'x');\n`,
  );
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
  it('generates edge persistence and the canonical endpoint table registry', () => {
    const api = fixture();
    const standards = join(api, '../ifs-standards');
    for (const [entity, name] of [
      ['relationship', 'Relationship'],
      ['relationship-type', 'RelationshipType'],
    ]) {
      const dir = join(standards, 'src/entities', entity);
      mkdirSync(dir, { recursive: true });
      cpSync(
        join(
          workspaceRoot,
          'ifs-standards/src/entities',
          entity,
          `${entity}.schema.json`,
        ),
        join(dir, `${entity}.schema.json`),
      );
      const dtoDir = join(api, 'src', entity, 'dto');
      mkdirSync(dtoDir, { recursive: true });
      for (const [file, className] of [
        [`create-${entity}.dto.ts`, `Create${name}Dto`],
        [`update-${entity}.dto.ts`, `Update${name}Dto`],
        [`${entity}-response.dto.ts`, `${name}ResponseDto`],
      ]) {
        writeFileSync(join(dtoDir, file), `export class ${className} {}`);
      }
    }
    writeFileSync(
      join(standards, 'scripts/entity-relations.json'),
      JSON.stringify({ Relationship: [], RelationshipType: [] }),
    );
    expect(run(api, 'relationship').status).toBe(0);
    const edge = readFileSync(
      join(api, 'src/relationship/relationship.service.ts'),
      'utf8',
    );
    expect(edge).toContain(
      "this.database.createEdge('relationship', data, relations)",
    );
    expect(edge).toContain(
      "this.database.updateEdge('relationship', id, data, relations)",
    );
    expect(run(api, 'relationship-type').status).toBe(0);
    expect(
      readFileSync(
        join(api, 'src/relationship-type/relationship-type.service.ts'),
        'utf8',
      ),
    ).toContain("this.database.create('relationship_type', data, relations)");
    expect(
      readFileSync(join(api, 'src/surreal/entity-tables.generated.ts'), 'utf8'),
    ).toContain('"RelationshipType": "relationship_type"');
  });
  it('excludes the abstract base from resources and the database table registry', () => {
    const api = fixture();
    const rejected = run(api, 'entity');
    expect(rejected.status).toBe(1);
    expect(rejected.stderr).toContain('abstract entity schema');
    expect(existsSync(join(api, 'src/entity'))).toBe(false);
    expect(existsSync(join(api, 'generator-ran'))).toBe(false);
    const generated = run(api);
    expect(generated.status, generated.stderr).toBe(0);
    const registry = readFileSync(
      join(api, 'src/surreal/entity-tables.generated.ts'),
      'utf8',
    );
    expect(registry).toContain('"Member": "member"');
    expect(registry).not.toContain('"Entity"');
    expect(
      readFileSync(join(api, 'src/generated-resources.module.ts'), 'utf8'),
    ).not.toContain('EntityModule');
  });
  it('normalizes display titles to match DTO names and database tables', () => {
    const temporaryApi = fixture();
    const standardsRoot = join(temporaryApi, '..', 'ifs-standards');
    const entityDirectory = join(
      standardsRoot,
      'src',
      'entities',
      'geographic-area',
    );
    mkdirSync(entityDirectory, { recursive: true });
    cpSync(
      join(
        workspaceRoot,
        'ifs-standards',
        'src',
        'entities',
        'geographic-area',
        'geographic-area.schema.json',
      ),
      join(entityDirectory, 'geographic-area.schema.json'),
    );
    writeFileSync(
      join(standardsRoot, 'scripts', 'entity-relations.json'),
      JSON.stringify({ 'Geographic Area': [] }),
    );
    const dtoDirectory = join(temporaryApi, 'src', 'geographic-area', 'dto');
    mkdirSync(dtoDirectory, { recursive: true });
    for (const [fileName, className] of [
      ['create-geographic-area.dto.ts', 'CreateGeographicAreaDto'],
      ['update-geographic-area.dto.ts', 'UpdateGeographicAreaDto'],
      ['geographic-area-response.dto.ts', 'GeographicAreaResponseDto'],
    ]) {
      writeFileSync(
        join(dtoDirectory, fileName),
        `export class ${className} {}\n`,
      );
    }

    const result = run(temporaryApi, 'geographic-area');

    expect(result.status, result.stderr).toBe(0);
    const serviceSource = readFileSync(
      join(
        temporaryApi,
        'src',
        'geographic-area',
        'geographic-area.service.ts',
      ),
      'utf8',
    );
    expect(serviceSource).toContain('SurrealService');
    expect(serviceSource).toContain(
      'assertEntityType(data, "Geographic Area");',
    );
    expect(serviceSource).toContain(
      'assertEntityType(data, "Geographic Area", true);',
    );
    expect(serviceSource).toContain(
      "this.database.findAll('geographic_area', relations)",
    );
    const controllerSource = readFileSync(
      join(
        temporaryApi,
        'src',
        'geographic-area',
        'geographic-area.controller.ts',
      ),
      'utf8',
    );
    expect(controllerSource).toContain("operationId: 'createGeographicArea'");
    expect(controllerSource).toContain('CreateGeographicAreaDto');
    expect(controllerSource).toContain("@Get(':id/relations')");
    expect(controllerSource).toContain(
      "operationId: 'listGeographicAreaRelations'",
    );
    expect(controllerSource).toContain('@Query() query: RelationsQueryDto');
    expect(serviceSource).toContain(
      "this.database.findRelations('geographic_area', id, query)",
    );
    expect(serviceSource).toContain('Promise<RelationshipResponseDto[]>');
  });

  it('rejects entities that are not defined by IFS standards', () => {
    const temporaryApi = fixture();
    const result = run(temporaryApi, 'unknown-entity');

    expect(result.status).toBe(1);
    expect(result.stderr).toContain('is not defined in IFS standards');
  });

  it('generates an idempotent Nest service backed by SurrealService', () => {
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
    expect(firstSource).toContain('private readonly database: SurrealService');
    expect(firstSource).toContain('const relations = [');
    expect(firstSource).toContain('"property": "permissions"');
    expect(firstSource).toContain('"table": "permission"');
    expect(firstSource).toContain('"property": "roles"');
    expect(firstSource).toContain('"readOnly": true');
    expect(firstSource).toContain(
      "this.database.create('member', data, relations)",
    );
    expect(firstSource).toContain(
      "this.database.update('member', id, data, relations)",
    );

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

  it('describes singular DTO relations without changing scalar ID properties', () => {
    const temporaryApi = fixture(true, [
      { property: 'primaryPermission', type: 'Permission' },
    ]);
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
    schema.properties.primaryPermission = {
      $ref: 'https://ifs-standards.org/schemas/v1/entities/permission.schema.json',
    };
    writeFileSync(schemaPath, JSON.stringify(schema));

    const result = run(temporaryApi);
    const source = readFileSync(
      join(temporaryApi, 'src', 'member', 'member.service.ts'),
      'utf8',
    );

    expect(result.status).toBe(0);
    expect(source).toContain('"property": "primaryPermission"');
    expect(source).toContain('"table": "permission"');
    expect(source).toContain('"isArray": false');
  });

  it('emits empty relation metadata when the entity has no relations', () => {
    const temporaryApi = fixture(true, []);
    const result = run(temporaryApi);
    const source = readFileSync(
      join(temporaryApi, 'src', 'member', 'member.service.ts'),
      'utf8',
    );

    expect(result.status).toBe(0);
    expect(source).toContain('const relations = [] as const;');
    expect(source).toContain("this.database.findAll('member', relations)");
  });

  it('runs the all-DTO generator once before generating a resource', () => {
    const temporaryApi = fixture();

    const result = run(temporaryApi);

    expect(result.status).toBe(0);
    expect(readFileSync(join(temporaryApi, 'generator-ran'), 'utf8')).toBe('x');
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
