# AGENTS.md

Repository-wide guidance for coding agents. Paths and commands are relative to the repository root. Check for a nearer `AGENTS.md` before changing a package.

## Project

IFS (Individual Freedom System) explores governance built around revocable delegation, proportional authority, and traceable decisions/resources. Keep these domain principles intact when changing schemas, APIs, or user-facing language.

This is a pnpm/Turborepo monorepo:

| Workspace | Purpose | Main stack |
| --- | --- | --- |
| `ifs-standards` | Standards site and canonical IFS entity schemas | React, Vite, Tailwind CSS v4, MDX, Vitest |
| `prototype` | Browser prototype | React, Vite |
| `prototype-api` | HTTP API and persistence | NestJS, SurrealDB, Vitest |
| `prototype-client` | Generated API client | Orval, TypeScript, native Fetch |
| `prototype-puppeteer` | Simulation runner using the generated client | TypeScript, Node.js |

Use Node.js 24 and the `pnpm` version pinned in root `package.json`. Do not use workspace-local npm lockfiles as the monorepo package-manager source of truth.

## Sources of truth and generated files

- Entity definitions: `ifs-standards/src/entities/**/*.schema.json`.
- UI guidance: `DESIGN.md`; standards design tokens and font imports are maintained directly in `ifs-standards/src/index.css`.
- Database tables: canonical entity schemas; `prototype-api/scripts/database.mjs` provisions SurrealDB tables.
- API contract: canonical schemas feed generated backend DTOs/resources; maintained generator behavior and `prototype-api/src/openapi.ts` define the HTTP/OpenAPI mapping.
- Maintained predefined objects: `ifs-standards/src/defaults/**/*.json` (currently RelationshipType objects).
- Maintained fake create payloads: `prototype-puppeteer/src/fake/ifs/**/*.ts`.
- Committed OpenAPI output: `prototype-api/openapi.json`.
- Generated client: `prototype-client/src/generated/api.ts`.

Do not hand-edit derived entity interfaces/docs, `ifs-standards/src/entities/overview.md`, schema `x-ifs-relationships` annotations, `ifs-standards/scripts/{generate-order,entity-relations}.json`, generated API DTOs/resources/registration/table mappings, `prototype-api/openapi.json`, or `prototype-client/src/generated/api.ts`. Puppeteer's `src/game/api.ts` and `src/fake/personalities.ts` are also generated. Never create or regenerate entity examples. Change the owning input and run the matching generator; do not commit `dist/`, databases, secrets, or local caches. Commit generated OpenAPI/client source with contract changes.

Generation ownership and effects:

- Standards `entities`: defaults -> relationship annotations in concrete schemas, then schemas -> entity order, direct relation metadata, and overview. It does not generate entity TypeScript interfaces. Run it before downstream generation when schema/default metadata changes.
- API `dto:generate:all` / `resource:generate:all`: schemas plus standards order/relation metadata -> DTOs and CRUD resources. Resource generation also refreshes `src/generated-resources.module.ts` and `src/surreal/entity-tables.generated.ts`; generating a single resource regenerates all DTOs unless `--skip-dtos` is supplied.
- OpenAPI export builds the API; client generation reads that export through `prototype-client/orval.config.ts` and builds the client.
- Puppeteer `generate-api`: canonical concrete schema titles -> `src/game/api.ts`, importing generated client DTOs. `personalities:generate <count>` separately overwrites `src/fake/personalities.ts` using maintained generation pools.

`Entity` is abstract, not an instance type, resource/table, or relationship endpoint. Use `ifs-standards/scripts/entity-schema.ts` to resolve inherited fields and requiredness; keep instance payloads flat. Create DTOs omit read-only fields even when the persisted schema requires them.

## Common commands

Run commands from the repository root:

```bash
pnpm install
pnpm dev
pnpm build
pnpm lint
pnpm test
pnpm format
pnpm --filter <workspace> <script>
```

Important generation/setup commands:

```bash
pnpm --filter ifs-standards entities       # schema-derived standards artifacts
pnpm --filter prototype-api db:start       # start a local persistent SurrealDB server
pnpm --filter prototype-api db:setup       # provision namespace, database, and entity tables
pnpm openapi:generate                       # backend -> prototype-api/openapi.json
pnpm client:generate                        # OpenAPI export -> Orval client + build
pnpm generate:all                           # API DTOs/resources, OpenAPI, client, and puppeteer API mapping
pnpm --filter prototype-puppeteer generate-api # simulation API mapping only
```

Check each workspace's `package.json` before assuming a script exists. Prefer the smallest relevant check while iterating, then run affected build/lint/tests before finishing.

## Development rules

- Preserve existing ESM conventions and explicit `.js` suffixes where Node-targeted TypeScript already uses them.
- Use `.tsx` for JSX and `.ts` otherwise.
- Keep changes scoped; do not refactor unrelated code or overwrite user changes.
- Never edit build output under `dist/`.
- Treat entity schemas as contracts. Regenerate downstream artifacts after schema or API changes.
- Use concrete DTO classes and stable, unique Swagger `operationId` values for API endpoints.
- OpenAPI generation must remain offline: no listening server or required database connection.
- Native Fetch does not reject non-2xx responses; client consumers must inspect `status`.
- Review generated relation writes and database definition changes before applying them.
- Never reset or destructively migrate a database without explicit approval. Verify `SURREALDB_URL`, namespace, and database first.
- Keep secrets out of source; use `.env.example` for documented configuration.

## Draft documentation workflow

- Keep discussion-derived documentation drafts in the root `draft-docs/` directory, with one topic per Markdown file and descriptive filenames.
- When a discussion produces a useful insight, design rationale, convention, or solution worth documenting, ask the user whether to save it. Wait for explicit approval before creating or updating a topic draft; approval to establish this workflow is not blanket approval to record every discussion.
- After approval, capture the context, conclusion, reasoning, examples where useful, and any unresolved questions so the knowledge does not become an undocumented assumption. Distinguish agreed conclusions from proposals.
- Drafts may eventually belong in IFS Standards, the repository README, or other documentation. Note the intended destination when known; otherwise leave it undecided.
- Check for an existing draft on the same topic and update it rather than creating duplicates. Drafts are not canonical standards or implemented behavior; do not promote them or change schemas/code merely because they exist.

## UI and design work

Follow `DESIGN.md`; reuse existing components and tokens instead of inventing styles.

## Verification by area

```bash
# Standards
pnpm --filter ifs-standards typecheck
pnpm --filter ifs-standards lint
pnpm --filter ifs-standards test
pnpm --filter ifs-standards build

# Prototype
pnpm --filter prototype lint
pnpm --filter prototype build

# API and generated client
pnpm --filter prototype-api db:status
pnpm --filter prototype-api lint
pnpm --filter prototype-api test
pnpm --filter prototype-api test:e2e
pnpm --filter prototype-api test:openapi
pnpm --filter prototype-client test

# Simulation runner
pnpm --filter prototype-puppeteer build
pnpm --filter prototype-puppeteer fake:check # references only, not full schema validation
pnpm --filter prototype-puppeteer fake:check:test # reference-checker regression tests
```

`fake:check` discovers exported fixture values recursively and resolves references against each entity's canonical `id` directly, not its display discriminator. It checks references, not full schema validity, duplicate declarations, or unexported values. Validate schemas/create conventions separately.

Some checks need generated dependencies or local setup; report anything not run and why.

## Git

Use Conventional Commits. Allowed scopes are workspace names from `commitlint.config.mjs`; omit scope for repository-wide changes. Do not commit unless asked.
