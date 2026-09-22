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

## Swagger and OpenAPI

After starting the API, visit:

- `http://localhost:3000/docs`: Swagger UI.
- `http://localhost:3000/docs-json`: live OpenAPI JSON.

`src/openapi.ts` is shared by bootstrap and the standalone exporter so both use the same contract configuration. Run from the repository root:

```bash
pnpm openapi:generate
# Writes prototype-api/openapi.json after a Prisma generation + Nest build.

pnpm client:generate
# Exports a fresh contract, runs Orval, and builds @ifs/api-client.

pnpm --filter @ifs/api-client generate
# Client only, using the existing prototype-api/openapi.json.
```

Export runs `dist/generate-openapi.js`, not the untransformed TypeScript source. It creates the Nest container but does not call `app.init()` or `app.listen()`, then closes it: no HTTP server, database connection, or migration is required. Constructors still run, so future providers must avoid network/database side effects in constructors. A configured `DATABASE_URL` must still be a syntactically valid SQLite URL.

Commit `openapi.json` and `api-client/src/generated/api.ts` alongside API changes; never edit generated files manually. `api-client/dist/` is ignored build output. The client is a private workspace ESM package with JavaScript and TypeScript declarations, already listed as a dependency of `prototype`. See [client usage and runtime URL configuration](../api-client/README.md).

### What the compiler plugin does

The `@nestjs/swagger` plugin in `nest-cli.json` augments the compiled code with Swagger metadata: DTO property types, required/optional flags, inferred responses, and descriptions from comments. It **does not write OpenAPI JSON or generate a client**. `SwaggerModule.createDocument()` produces OpenAPI; the exporter writes JSON; Orval reads that JSON and generates a Fetch-based TypeScript client. `esmCompatible` is enabled for this ESM project.

For future endpoints:

- Use concrete DTO classes in `*.dto.ts` / `*.entity.ts`, not erased interfaces or Prisma types, for request/response schemas.
- Add explicit return types and unique `@ApiOperation({ operationId: '...' })` values for stable client names.
- Import mapped DTO helpers such as `PartialType` from `@nestjs/swagger`, not `@nestjs/mapped-types`.
- Use explicit Swagger decorators for unions, generic wrappers, errors, authentication, or anything the plugin cannot infer. Match actual content types; `GET /` is explicitly documented as `text/plain`, not JSON.
- This is documentation/type generation, **not runtime validation**. No validation library is currently configured; `classValidatorShim` is disabled. Add validation separately if needed.

Swagger is currently exposed without authentication, matching this prototype's API. Protect or disable documentation separately if deploying a non-public API.

### Current scope

Database infrastructure is configured; **no IFS domain models or tables are defined yet**. The only current endpoint is the `GET /` greeting. Use `/backend-entity <name>` in Pi to implement a resource from its existing `ifs-standards/src/entities/` schema. Do not treat the infrastructure tests' temporary SQL table as a domain model.

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
pnpm --filter prototype-api test:openapi
pnpm --filter @ifs/api-client test
```

Database tests use unique temporary SQLite files, never the development database. They verify real reads/writes, updates/deletes, persistence across connections, transaction rollback, Nest shutdown cleanup, and URL resolution. E2E tests run `prisma migrate deploy` against a disposable database and verify the application connects to that same file. With no domain models yet, this checks migration-command wiring, not domain migration behavior.

Swagger E2E tests cover `/docs` and `/docs-json`. `test:openapi` exercises the real Nest compiler plugin and checks that standalone export is deterministic and does not open SQLite; ordinary Vitest source transforms do not run that plugin. Client tests cover package imports, plain-text responses, runtime base URLs, headers, and cancellation.

The inherited Observe module still contains placeholder telemetry credentials; configure it separately if telemetry is needed.
