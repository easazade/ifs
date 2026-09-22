import { execFileSync } from 'node:child_process';
import { mkdtemp, realpath, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import type { App } from 'supertest/types.js';
import { AppModule } from './../src/app.module.js';
import { PrismaService } from './../src/prisma/prisma.service.js';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;
  let directory: string;

  beforeAll(async () => {
    directory = await mkdtemp(join(tmpdir(), 'ifs-api-e2e-'));
    vi.stubEnv('DATABASE_URL', `file:${join(directory, 'test.db')}`);
    const projectRoot = fileURLToPath(new URL('../', import.meta.url));
    // Use the actual migration command, always against this disposable database.
    execFileSync(
      process.execPath,
      [
        join(projectRoot, 'node_modules/prisma/build/index.js'),
        'migrate',
        'deploy',
      ],
      { cwd: projectRoot, env: process.env, stdio: 'pipe' },
    );

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  }, 30_000);

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  it('connects the application to the configured SQLite database', async () => {
    const prisma = app.get(PrismaService);
    const databases = await prisma.$queryRaw<{ name: string; file: string }[]>`
      PRAGMA database_list
    `;
    expect(databases.find((database) => database.name === 'main')?.file).toBe(
      await realpath(join(directory, 'test.db')),
    );
  });

  afterAll(async () => {
    try {
      await app?.close();
    } finally {
      vi.unstubAllEnvs();
      await rm(directory, { recursive: true, force: true });
    }
  });
});
