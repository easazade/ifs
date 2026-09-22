# IFS Prototype API

NestJS backend using **Prisma ORM 7 + SQLite**. Use the workspace's pinned pnpm version and Node.js 24 LTS (Prisma requires Node 20.19+, 22.12+, or 24+; the workspace uses Node 24).

## Local setup

Run from the monorepo root:

```bash
pnpm install
# Optional: copy prototype-api/.env.example to prototype-api/.env to customize settings.
pnpm --filter prototype-api db:setup
pnpm --filter prototype-api dev
```

The API listens on `http://localhost:3000` by default. `GET /` returns `Hello World!`.

`db:setup` generates Prisma Client and applies committed migrations without resetting data. On first setup it creates `prototype-api/prisma/dev.db`. No external database server is needed. pnpm's workspace build allowlist permits the Prisma engine scripts and the `better-sqlite3` native build; if no prebuilt binary is available, a working native compiler/Python toolchain is required.

### Current scope

Database infrastructure is configured; **no IFS domain models or tables are defined yet**. The existing `/member` routes remain Nest scaffold placeholders, not persisted CRUD. Use `/backend-entity <name>` in Pi to implement a resource from its existing `ifs-standards/src/entities/` schema. Do not treat the infrastructure tests' temporary SQL table as a domain model.

## Database configuration

| Variable       | Default                | Meaning                    |
| -------------- | ---------------------- | -------------------------- |
| `DATABASE_URL` | `file:./prisma/dev.db` | Local SQLite database file |
| `PORT`         | `3000`                 | HTTP port                  |

`prototype-api/.env` is loaded by both the CLI and application. Already-set environment variables take precedence. SQLite relative paths resolve against **`prototype-api/`**, not `prisma/` or the shell's current directory. Absolute `file:/absolute/path/database.db` paths are also supported. Parent directories for custom database paths must already exist. URL query strings/fragments are unsupported; `file::memory:` is available for explicitly nonpersistent use, not migration-based setup.

The CLI and compiled application share the same URL resolver in `src/prisma/database.config.ts`. `.env`, generated Prisma Client files, SQLite database files, and their journal/WAL sidecars are ignored by Git. Keep backups outside the source tree as appropriate; do not commit database contents.

## Prisma layout

- `prisma/schema.prisma`: SQLite datasource and Prisma model definitions.
- `prisma.config.ts`: CLI schema/migration paths and resolved database URL.
- `prisma/migrations/`: committed migration history; currently only the SQLite provider lock, since there are no domain models yet.
- `src/generated/prisma/`: generated ESM TypeScript client; never edit manually.
- `src/prisma/prisma.module.ts`: global module exporting one shared client per Nest application.
- `src/prisma/prisma.service.ts`: injectable client; connects during initialization and disconnects during shutdown. Bootstrap enables shutdown hooks.

Inject `PrismaService` into resource services, then use the generated model delegates after adding models. DTOs and runtime JSON Schema validation remain separate from Prisma types. Do not instantiate a client per request or pass unvalidated HTTP bodies straight into Prisma operations.

## Schema changes and migrations

After implementing an approved IFS model in `prisma/schema.prisma`, run from the root against your **local development database only**:

```bash
pnpm --filter prototype-api db:validate
pnpm --filter prototype-api db:migrate --name add_entity --create-only
# Inspect the generated SQL for destructive changes / SQLite table rebuilds.
pnpm --filter prototype-api db:deploy
pnpm --filter prototype-api db:generate
```

Commit schema changes and generated migration source files together. Prisma 7 migration commands do not automatically regenerate the client. Never accept reset prompts or use `migrate reset` / destructive `db push` flags unless intentionally discarding a confirmed disposable database. `migrate dev` uses a shadow database and may detect drift; stop and investigate instead of resetting valuable data.

Additional commands:

```bash
pnpm --filter prototype-api db:status
pnpm --filter prototype-api db:studio
```

All database commands target the configured `DATABASE_URL`. Verify it before migrating or editing data in Studio. No migrations run automatically at application startup.

## Build and run

```bash
pnpm --filter prototype-api build
pnpm --filter prototype-api start:prod
```

Build, development, and test scripts generate Prisma Client explicitly, so they work on a fresh checkout without checking in generated code. The Nest build compiles the generated client into `dist/generated/prisma/`. Keep the package layout (`dist/`, `prisma/`, `package.json`, runtime dependencies) intact when running compiled output. Provide a persistent writable SQLite location for deployed instances; do not place the database on ephemeral storage or share a local file across replicas. Apply reviewed migrations separately with `db:deploy` using an installation that includes the Prisma CLI.

## Verification

```bash
pnpm --filter prototype-api db:validate
pnpm --filter prototype-api lint
pnpm --filter prototype-api build
pnpm --filter prototype-api test
pnpm --filter prototype-api test:e2e
```

Database tests use unique temporary SQLite files, never the development database. They verify real reads/writes, updates/deletes, persistence across connections, transaction rollback, Nest shutdown cleanup, and URL resolution. E2E tests run `prisma migrate deploy` against a disposable database and verify the application connects to that same file. With no domain models yet, this checks migration-command wiring, not domain migration behavior.

The inherited Member scaffold currently produces unused-parameter lint warnings. The inherited Observe module still contains placeholder telemetry credentials; configure it separately if telemetry is needed.
