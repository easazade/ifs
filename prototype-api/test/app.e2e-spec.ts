import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import type { App } from 'supertest/types.js';
import { AppModule } from './../src/app.module.js';
import { SurrealService } from './../src/surreal/surreal.service.js';
import { startSurrealServer } from './support/surreal-server.js';
import { initializeDatabase } from '../src/surreal/database.setup.js';
import { setupSwagger } from './../src/openapi.js';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;
  let server: Awaited<ReturnType<typeof startSurrealServer>>;

  beforeAll(async () => {
    server = await startSurrealServer();
    vi.stubEnv('SURREALDB_URL', server.endpoint);
    vi.stubEnv('SURREALDB_USERNAME', 'test');
    vi.stubEnv('SURREALDB_PASSWORD', 'test');
    vi.stubEnv('SURREALDB_NAMESPACE', 'e2e');
    vi.stubEnv('SURREALDB_DATABASE', 'test');

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    const database = moduleFixture.get(SurrealService);
    await database.onModuleInit();
    await initializeDatabase(database.client, ['member']);
    await database.onModuleDestroy();
    app = moduleFixture.createNestApplication();
    setupSwagger(app);
    await app.init();
  }, 30_000);

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  it('/docs (GET) serves Swagger UI', async () => {
    const response = await request(app.getHttpServer())
      .get('/docs')
      .expect(200);
    expect(response.text).toContain('Swagger UI');
  });

  it('/docs-json (GET) describes the actual plain-text response', async () => {
    const response = await request(app.getHttpServer())
      .get('/docs-json')
      .expect(200);
    const operation = response.body.paths['/'].get;
    expect(operation.operationId).toBe('getHello');
    expect(operation.responses['200'].content['text/plain'].schema).toEqual({
      type: 'string',
      example: 'Hello World!',
    });
  });

  it('connects to the configured SurrealDB database', async () => {
    const database = app.get(SurrealService);
    expect(database.client.namespace).toBe('e2e');
    expect(database.client.database).toBe('test');
    expect(await database.client.query('RETURN true;')).toEqual([true]);
  });

  it('supports generated CRUD routes and missing-record responses', async () => {
    const data = { id: 'member-e2e', name: 'Alice', permissions: [] };
    const created = await request(app.getHttpServer())
      .post('/members')
      .send(data)
      .expect(201);
    expect(created.body).toMatchObject(data);
    expect(created.body.roles).toEqual([]);
    await request(app.getHttpServer()).get('/members/member-e2e').expect(200);
    const updated = await request(app.getHttpServer())
      .patch('/members/member-e2e')
      .send({ name: 'Bob' })
      .expect(200);
    expect(updated.body.name).toBe('Bob');
    await request(app.getHttpServer())
      .delete('/members/member-e2e')
      .expect(204);
    await request(app.getHttpServer()).get('/members/member-e2e').expect(404);
    await request(app.getHttpServer())
      .patch('/members/member-e2e')
      .send({ name: 'Nobody' })
      .expect(404);
    await request(app.getHttpServer())
      .delete('/members/member-e2e')
      .expect(404);
  });

  afterAll(async () => {
    try {
      await app?.close();
    } finally {
      vi.unstubAllEnvs();
      await server?.stop();
    }
  });
});
