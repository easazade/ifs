import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtemp, readFile, readdir, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';

// Unlike Vitest's source transforms, this exercises the real Nest CLI plugin.
test('compiled OpenAPI export is deterministic and does not connect to SurrealDB or open a port', async () => {
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
          // Even invalid database configuration must not affect offline export.
          SURREALDB_URL: 'invalid-offline-url',
          SURREALDB_USERNAME: '',
          SURREALDB_PASSWORD: '',
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
    const createMember = JSON.parse(exported).paths['/members'].post;
    assert.equal(createMember.operationId, 'createMember');
    assert.equal(
      createMember.requestBody.content['application/json'].schema.$ref,
      '#/components/schemas/CreateMemberDto',
    );
    assert.equal(
      createMember.responses['201'].content['application/json'].schema.$ref,
      '#/components/schemas/MemberResponseDto',
    );

    const spec = JSON.parse(exported);
    const operationIds = new Set();
    for (const [path, routes] of Object.entries(spec.paths)) {
      for (const route of Object.values(routes)) {
        assert.ok(
          !operationIds.has(route.operationId),
          `Duplicate ${route.operationId}`,
        );
        operationIds.add(route.operationId);
      }
      if (!path.endsWith('/{id}')) continue;
      const relations = spec.paths[`${path}/relations`].get;
      assert.equal(
        relations.operationId,
        `list${routes.get.operationId.slice(3)}Relations`,
      );
      assert.equal(
        relations.responses['200'].content['application/json'].schema.items
          .$ref,
        '#/components/schemas/RelationshipResponseDto',
      );
      assert.deepEqual(relations.parameters.map(({ name }) => name).sort(), [
        'direction',
        'filter',
        'id',
      ]);
      assert.ok(relations.responses['400']);
      assert.ok(relations.responses['404']);
    }
    const schemas = spec.components.schemas;
    const entitiesRoot = new URL(
      '../../ifs-standards/src/entities/',
      import.meta.url,
    );
    for (const entry of await readdir(entitiesRoot, { withFileTypes: true })) {
      if (!entry.isDirectory()) continue;
      const entity = JSON.parse(
        await readFile(
          new URL(`${entry.name}/${entry.name}.schema.json`, entitiesRoot),
          'utf8',
        ),
      );
      if (entity['x-ifs-abstract'] === true) continue;
      const modelName = entity.title.replace(/[^A-Za-z0-9]+/g, '');
      for (const dto of [
        `Create${modelName}Dto`,
        `Update${modelName}Dto`,
        `${modelName}ResponseDto`,
      ]) {
        assert.deepEqual(
          schemas[dto].properties.entityType.enum,
          [entity.title],
          `${dto} must have a fixed entityType`,
        );
      }
      for (const dto of [`Create${modelName}Dto`, `${modelName}ResponseDto`]) {
        for (const field of [
          'id',
          'entityType',
          'entityDocumentationUrl',
          'createdAt',
        ]) {
          assert.ok(schemas[dto].properties[field], `${dto} missing ${field}`);
          assert.ok(
            schemas[dto].required.includes(field),
            `${dto} must require ${field}`,
          );
        }
        assert.ok(schemas[dto].properties.basedOn);
        assert.ok(!schemas[dto].required.includes('basedOn'));
      }
      assert.ok(
        !schemas[`Update${modelName}Dto`].required?.includes('entityType'),
      );
    }
    assert.ok(!spec.paths['/entities']);
    assert.ok(!schemas.CreateEntityDto);
    assert.ok(!schemas.EntityResponseDto);
    assert.ok(schemas.CreateRelationshipDto.required.includes('sourceId'));
    assert.ok(schemas.CreateRelationshipDto.required.includes('targetId'));
    assert.ok(schemas.RelationshipResponseDto.properties.sourceId);
    assert.ok(
      !Object.hasOwn(schemas.UpdateRelationshipDto.properties, 'sourceId'),
    );
    assert.ok(
      !Object.hasOwn(schemas.UpdateRelationshipDto.properties, 'targetId'),
    );
    assert.ok(!Object.hasOwn(schemas.RelationshipResponseDto.properties, 'in'));
    assert.ok(
      !Object.hasOwn(schemas.RelationshipResponseDto.properties, 'out'),
    );

    const getMember = JSON.parse(exported).paths['/members/{id}'].get;
    assert.equal(getMember.operationId, 'getMember');
    assert.equal(getMember.parameters[0].name, 'id');
    assert.equal(getMember.parameters[0].required, true);
    assert.ok(getMember.responses['404']);
    assert.deepEqual(await readdir(directory), []);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});
