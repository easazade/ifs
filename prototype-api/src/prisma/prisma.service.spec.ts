import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaModule } from './prisma.module.js';
import { PrismaService } from './prisma.service.js';

describe('PrismaService (real SQLite)', () => {
  let directory: string;
  let module: TestingModule;
  let prisma: PrismaService;

  beforeEach(async () => {
    directory = await mkdtemp(join(tmpdir(), 'ifs-prisma-'));
    vi.stubEnv('DATABASE_URL', `file:${join(directory, 'test.db')}`);
    module = await Test.createTestingModule({
      imports: [PrismaModule],
    }).compile();
    await module.init();
    prisma = module.get(PrismaService);

    // Test-only table: infrastructure tests must not invent IFS domain models.
    await prisma.$executeRaw`
      CREATE TABLE "PersistenceProbe" ("id" TEXT PRIMARY KEY, "value" TEXT NOT NULL)
    `;
  });

  afterEach(async () => {
    try {
      await module?.close();
    } finally {
      vi.unstubAllEnvs();
      await rm(directory, { recursive: true, force: true });
    }
  });

  it('shares one injectable client and persists writes across connections', async () => {
    expect(module.get(PrismaService)).toBe(prisma);
    const value = "stored safely: '); DROP TABLE PersistenceProbe; --";
    await prisma.$executeRaw`
      INSERT INTO "PersistenceProbe" ("id", "value") VALUES (${'probe'}, ${value})
    `;
    await prisma.$disconnect();

    const reopened = new PrismaService();
    try {
      await reopened.$connect();
      const rows = await reopened.$queryRaw<{ id: string; value: string }[]>`
        SELECT "id", "value" FROM "PersistenceProbe"
      `;
      expect(rows).toEqual([{ id: 'probe', value }]);
    } finally {
      await reopened.$disconnect();
    }
  });

  it('supports updates and deletes', async () => {
    await prisma.$executeRaw`
      INSERT INTO "PersistenceProbe" ("id", "value") VALUES (${'probe'}, ${'before'})
    `;
    await prisma.$executeRaw`
      UPDATE "PersistenceProbe" SET "value" = ${'after'} WHERE "id" = ${'probe'}
    `;
    expect(
      await prisma.$queryRaw`SELECT "value" FROM "PersistenceProbe"`,
    ).toEqual([{ value: 'after' }]);
    await prisma.$executeRaw`DELETE FROM "PersistenceProbe" WHERE "id" = ${'probe'}`;
    expect(await prisma.$queryRaw`SELECT * FROM "PersistenceProbe"`).toEqual(
      [],
    );
  });

  it('rolls back atomic multi-statement writes on failure', async () => {
    await expect(
      prisma.$transaction(async (transaction) => {
        await transaction.$executeRaw`
          INSERT INTO "PersistenceProbe" ("id", "value") VALUES (${'probe'}, ${'rollback'})
        `;
        throw new Error('cancel transaction');
      }),
    ).rejects.toThrow('cancel transaction');

    expect(await prisma.$queryRaw`SELECT * FROM "PersistenceProbe"`).toEqual(
      [],
    );
  });

  it('disconnects when Nest closes', async () => {
    const disconnect = vi.spyOn(prisma, '$disconnect');
    await module.close();
    expect(disconnect).toHaveBeenCalledOnce();
  });
});
