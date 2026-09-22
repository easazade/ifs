---
description: Create or update a NestJS resource with an OpenAPI-generated client from an IFS entity schema
argument-hint: '<entity-name> [backend requirements]'
---

Create or update the Prototype API backend resource for IFS entity `$1`.

Additional requirements:

```text
${@:2}
```

## Purpose and scope

Build a working, database-backed prototype of the IFS standards, usable by a React or other HTTP client. Implement the named entity, not every entity in one run. Repeated invocations should extend the backend without duplicating resources or shared infrastructure.

- Locate the monorepo root containing `pnpm-workspace.yaml`, `ifs-standards/package.json`, and `prototype-api/package.json`. Paths below are relative to that root, regardless of the current working directory.
- Read root `AGENTS.md` and any applicable package-local instructions before inspecting schemas. Read `.pi/prompts/entity.md` for standards conventions, but do not execute its schema-creation workflow.
- Standards input: `ifs-standards/src/entities/<name>/<name>.schema.json`.
- Backend output: `prototype-api/`, plus regenerated `prototype-api/openapi.json` and `api-client/src/generated/` artifacts. Workspace dependency/lockfile changes and handwritten `api-client/` changes require inclusion in the approved plan.
- Do not modify `ifs-standards/`, generated standards artifacts, or the frontend (`prototype/`). Regenerating the shared API client is in scope; changing React code is not. Do not run `pnpm --filter ifs-standards entities`.
- The backend stack is NestJS with Prisma ORM and SQLite. Treat this as decided; do not ask the user to choose an ORM or database, introduce TypeORM, or silently switch providers. If existing configuration conflicts, report it and obtain approval before replacing or migrating it.
- Prisma schema models define persistence and relations. Request/response DTOs are separate NestJS HTTP contracts, not Prisma models or generated Prisma input/output types. Reuse the project's validation tooling or ask which to use if undecided.
- The API contract pipeline is already decided: the `@nestjs/swagger` compiler plugin adds metadata during Nest compilation, `SwaggerModule.createDocument()` creates OpenAPI, and Orval generates the `@ifs/api-client` workspace package. Preserve this pipeline; do not introduce a second generator or hand-maintained client.

## Interaction rules

- Always use Pi's `ask` tool for every user-facing question, including entity-name requests, ambiguity resolution, implementation questionnaires, follow-ups, and approvals. This applies during the existence gate and all later steps.
- Never substitute plain-chat questions or `pi-questions-helper` questionnaires. Batch independent questions in one `ask` call using its `questions` array; resolve gate blockers before asking implementation questions.
- Give each question a stable `id`, concise `question`, and meaningful `options`. Use `description` for context, mappings, and approval plans. Use `multi: true` only when multiple selections are valid. For free-form details, explain how to use the tool's built-in custom-answer/Other input; do not add an `Other` option yourself.
- Wait for the tool's answers and parse selected options and custom answers by question ID. A cancelled or unanswered question is not approval. Obtain sufficient answers and explicit approval before writes.
- If `ask` is unavailable, report the blocker and stop; do not fall back to chat questions.
- Keep any required trace footer in accompanying assistant text, not as a question.

## 1. Mandatory read-only existence gate

Complete this gate before questionnaires about implementation, scaffolding, dependency installation, generation, database access, or any writes.

1. Require a nonempty entity name. If omitted, ask for it and stop.
2. Normalize ordinary name variants to kebab-case; reject path separators, traversal, or values that are not entity names. Resolve only within `ifs-standards/src/entities/`.
3. Look for the canonical schema. If needed, inspect existing schema filenames/titles for an unambiguous match; do not guess from similar names. Ask for clarification if ambiguous, then stop.
4. If no matching schema exists, report `No IFS Standards entity schema found for <name>. No changes made.` Stop. Do not create a schema, resource directory, DTO, dependency, or database table. You may suggest `/entity <name>` as a separate user action; never invoke it automatically.
5. Read and parse the matched schema. Resolve its transitive `$ref` dependencies by local schema `$id` and JSON Pointer, with cycle detection. Do not fetch remote schemas automatically. If a required reference is missing/unresolved or the schema cannot be interpreted reliably, report the blocker and stop without writes. Never invent a missing related schema.

All entity definitions come from `*.schema.json`. Do not reverse-engineer fields from `.mdx`, generated TypeScript, examples, existing backend code, or frontend assumptions. Existing backend code determines implementation conventions, not standards semantics. If requirements conflict with the schema, explain the conflict and ask for a separate standards update; do not silently diverge.

## 2. Inspect, interview, and obtain approval

After the gate passes, inspect read-only:

- The target schema and referenced schemas: properties, required fields, formats, constants, enums, read/write annotations, extensibility, and relations.
- `prototype-api/package.json`, TypeScript/Nest/test configuration, bootstrap, root module, Prisma schema/configuration, generated-client location, shared Prisma service/module, SQLite connection settings, migrations, validation, and existing resource files/tests. Follow the installed Prisma version's configuration and SQLite adapter requirements.
- OpenAPI/client conventions: `prototype-api/README.md`, `prototype-api/nest-cli.json`, `prototype-api/src/openapi.ts`, `prototype-api/src/generate-openapi.ts`, the current `prototype-api/openapi.json`, root generation scripts, and `api-client/{README.md,package.json,orval.config.ts}`. Check the generated exports and existing contract tests before changing operation IDs or response shapes.
- Existing controller routes, DTOs, persistence models, services, and shared utilities. Search registrations too; a partially scaffolded resource is an update, not a reason to generate duplicates.
- Git status/diff so existing user changes remain intact.

After read-only inspection, briefly state the resolved schema path, whether this is creation or update, and the proposed field/relation mapping. Submit all needed questions together in one `ask` call. The numbered list below defines question topics, not chat output format. Do not write files; wait for the tool's answers.

Tailor questions to actual gaps. Reuse established configuration and requirements instead of asking the user to repeat them:

1. Confirm the intended operation and scope: default is schema-aligned create/list/get/update/delete; for an existing resource, what behavior should change? Preserve compatible custom logic and routes by default.
2. Reuse existing Prisma/SQLite setup. If absent, propose minimal Prisma setup with a local SQLite database and a separate disposable test database as part of the approval plan. Ask only about unresolved file locations or environment configuration, not the already-decided ORM/database. Request environment variable names, not secrets in chat.
3. If request validation tooling is undecided, which approach should be used? Recommend JSON Schema draft 2020-12 validation (for example Ajv) when needed for faithful schema coverage; clarify any library the user says they will name later.
4. Which fields are server-managed versus client-supplied, and how are IDs, timestamps, `ifsId`, and read-only fields populated? Ask only where schema annotations and existing conventions do not settle it.
5. For entity relations, clarify ownership, cardinality/uniqueness not expressed by the schema, whether writes link existing records or create nested records, and deletion behavior. Show any required related persistence models; request approval before adding or changing them. Do not silently scaffold related CRUD endpoints.
6. Ask about unresolved frontend/API needs only when relevant: route compatibility, list pagination, allowed development origins, or existing authentication/authorization conventions. Do not invent governance rules from schema descriptions.
7. Approve the concrete file/change plan, including dependencies, shared infrastructure, related models, migrations, OpenAPI DTOs/decorators, and regenerated client artifacts? Explicitly flag breaking route/field changes, operation-ID/client-export changes, and potentially destructive database changes.

Parse the answers returned by `ask`. If answers are incomplete or conflicting, submit only missing follow-ups through `ask` and wait for the result. If approval was withheld, present the final plan and obtain approval through `ask` before writes. Do not treat code-generation approval as permission to drop data or migrate a shared/production database.

## 3. Schema-to-backend contract

- Preserve schema property names, types, `required`, enums, `const`, bounds, patterns, array rules, nullability, and applicable composition constraints. Optional does not mean nullable. Document how absent optional fields round-trip without becoming invalid JSON nulls.
- Keep identifiers as the schema defines them. Do not inherit Nest scaffold numeric coercion (`+id`) for string IDs, or require UUID syntax for a plain string. If no usable primary key is defined, ask about an internal persistence key; never expose invented fields in the standards object.
- Use only common fields actually present in the schema. Do not invent defaults for `ifsId`; it identifies the real IFS system. Enforce `entityType` constants only when the schema contains them. Preserve `basedOn` and documentation URLs according to their actual definitions.
- A schema `$ref` to another entity denotes a database-object relationship; a local `$defs` reference can describe a value type. Model entity references through Prisma relations, not duplicated inline entity shapes or opaque JSON blobs. Reuse existing models, and handle self/circular dependencies explicitly.
- An array of entity references says “many” on that property, but does not alone establish inverse ownership or many-to-many semantics. Do not invent uniqueness, foreign keys, inverse properties, cascade writes, or cascade deletion without schema support or approval.
- `Id` suffix fields are ordinary identifiers unless explicitly defined otherwise. `format: "ifs-ref"` remains a string (or array item string), not an automatic ORM relation. Consult the standards' current custom-format validation; do not invent a restrictive grammar.
- Map storage to the installed Prisma SQLite connector's capabilities. Do not assume native scalar-list support or support for every enum/JSON feature across Prisma versions. Use supported JSON storage, validated serialized text, or approved related value tables as appropriate for embedded objects/configuration and primitive arrays. Preserve wire shapes and constraints; distinguish value storage from entity relations.
- Respect `additionalProperties`: reject extras when false; when true or omitted, preserve allowed extension data across writes and reads rather than stripping it. Use an approved storage strategy. Never pass untrusted bodies directly to ORM persistence or permit extension data to overwrite internal fields.
- Keep wire dates in the required string format even when stored as database dates. Do not expose ORM internals, join keys, or cyclic object graphs.
- Preserve entity-shaped `$ref` values in standards-facing JSON. If a relation-link request contract uses IDs, describe it explicitly as an input contract and map responses back to the schema; do not silently replace entity-valued response properties with IDs.
- Exclude server-managed/read-only fields from writable DTOs and reject forbidden writes. Treat `readOnly`/`writeOnly` as directional annotations. Response validation must account for write-only fields without mutating source schemas; required read-only fields must be populated by the backend.
- Create DTOs require all client-supplied required fields. PATCH DTOs allow omission of unchanged fields, not arbitrary nulls or immutable-field edits. Define merge semantics for objects, arrays, and relations. Validate the merged result before persistence, not only the partial payload.
- TypeScript types and generated Prisma types alone do not enforce JSON Schema. Implement runtime validation covering the schema's actual constraints and locally resolved references. If DTO validators cannot express a constraint, use schema validation rather than weakening it. Keep derived request/response validation synchronized with source schemas.
- If schema defects or unsupported features block faithful implementation, stop and explain; do not repair standards as a side effect or claim incomplete mapping is compliant.

### OpenAPI and generated-client contract requirements

Every implemented endpoint must produce a usable, accurate typed client, not merely appear in Swagger UI:

- Use exported concrete DTO classes in files ending in `*.dto.ts` (including response, query, nested-value, and list-envelope DTOs as needed), so the Swagger compiler plugin can discover them. Use explicit controller parameter and return types, such as `Promise<MemberResponseDto>` or `Promise<MemberResponseDto[]>`. Do not expose interfaces, type aliases, Prisma types, `any`, `unknown`, or untyped generic wrappers as substitutes for documented wire models.
- Import `PartialType`, `PickType`, `OmitType`, and other mapped DTO helpers from `@nestjs/swagger`, not `@nestjs/mapped-types`. Exclude immutable/server-managed fields before deriving update DTOs. A mapped type does not implement PATCH merge semantics or full standards validation.
- Add resource `@ApiTags(...)` and a globally unique, stable `@ApiOperation({ operationId: '...' })` to every handler. Prefer entity-qualified names such as `createMember`, `listMembers`, and `getMember`; preserve existing IDs unless a breaking rename is approved. These IDs become client function names.
- Declare request bodies, route/query parameters, response DTOs/arrays/envelopes, status codes, and content types accurately. Use explicit `@ApiBody`, `@ApiParam`, `@ApiQuery`, and response decorators where inference is insufficient. Match actual serialization and pagination shape; never document a bare array when returning an envelope, JSON when returning plain text, or a body for a `204` response. Describe implemented validation/not-found/conflict/authentication error responses and reusable error DTOs, not hypothetical behavior. Swagger annotations do not change actual HTTP status codes or enforce authentication.
- Let the plugin infer straightforward DTO properties, but use `@ApiProperty` / `@ApiPropertyOptional` for constraints or types it cannot infer faithfully: formats, patterns, bounds, constants, enums, nullability, nested models, dictionaries/extension data, and compositions. Preserve optional-versus-nullable semantics. Use explicit lazy type references for circular DTOs when necessary. For generic envelopes, unions, or manually referenced models, use concrete DTOs or `@ApiExtraModels` / `getSchemaPath` with appropriate schemas; all component references must resolve.
- Document the actual input/output distinction: relation-link input IDs versus entity-shaped responses, server-managed/read-only output fields, write-only input fields, and allowed extension data. Do not expose database internals or change standards wire shapes just to make generation easier.
- Translate standards JSON Schema draft 2020-12 into the OpenAPI version emitted by the installed Swagger library (currently OpenAPI 3.0). Do not paste `$defs`, type-array nullability, or unsupported keywords into an OpenAPI 3.0 schema. Preserve constraints in runtime validation; explicitly document/report constraints OpenAPI cannot express rather than silently weakening validation or claiming exact equivalence.
- Swagger metadata and Orval types are not runtime validation. The current plugin uses `classValidatorShim: false`; do not assume validators automatically become OpenAPI constraints, and do not add or replace a validation library solely for Swagger. Keep runtime validation and documented request/response contracts aligned.

## 4. Implement after approval

Create missing files or update existing files in place, following repository conventions:

```text
prototype-api/src/<entity>/
  <entity>.module.ts
  <entity>.controller.ts
  <entity>.service.ts
  dto/create-<entity>.dto.ts
  dto/update-<entity>.dto.ts
  dto/<entity>-response.dto.ts
  <entity>.controller.spec.ts
  <entity>.service.spec.ts
```

Add or update persistence models in the existing Prisma schema (normally `prototype-api/prisma/schema.prisma`) and migrations in its configured migrations directory. Do not create TypeORM-style `entities/<entity>.entity.ts` persistence classes or manually edit generated Prisma Client files. Retain existing entity classes only if needed as non-ORM domain/response types.

Add integration/e2e tests and shared validation/database files only as needed. Preserve ESM/NodeNext `.js` import conventions where used. Do not blindly run `nest generate resource` over existing files; fill partial scaffolds without overwriting custom code.

- Preserve shared Swagger setup (`/docs` and `/docs-json`), the ESM-compatible Nest compiler plugin, and the standalone exporter. Keep provider constructors free of database/network side effects: OpenAPI export creates the Nest container without calling `app.init()` or `app.listen()`. Do not require a live API, SQLite connection, or migration just to generate the contract.
- Register the resource module and reuse a shared injectable Prisma service/client with appropriate lifecycle management. Configure Prisma with the SQLite provider only if setup is missing; keep dependency versions, generated-client imports, adapters, scripts, and package manager compatible with the workspace. Do not instantiate a new client per request.
- Implement real SQLite persistence through Prisma Client, not scaffold strings or in-memory mocks. Use Prisma transactions for multi-record writes that must be atomic; explicitly map validated DTO fields to Prisma operations.
- Default routes follow existing conventions: POST collection, GET collection, GET `:id`, PATCH `:id`, DELETE `:id`. Define status codes, response shapes, not-found behavior, validation errors, and uniqueness/relation conflict handling. Avoid leaking database details.
- Use explicit field mapping, bounded list queries with documented limits, and safe relation loading/serialization. Avoid unbounded eager relation recursion.
- Maintain existing guards/auth behavior. Do not expose privileged fields through mass assignment. Prototype status does not authorize removing access controls or enabling destructive cascades.
- If CORS is needed, configure approved development origins through environment settings; do not enable unrestricted credentialed origins. Do not change the React application.
- Add Prisma migrations/configuration according to approved project conventions. Inspect generated SQL for SQLite table rebuilds and data-loss risks. Never delete database files, run `prisma migrate reset`, accept a reset prompt, or use `db push --force-reset`/`--accept-data-loss` without explicit destructive-action authorization. Prefer migrations over ad hoc `db push`; any local-only schema push needs explicit approval. Apply migrations only to an approved local development/test database, never a shared/production database without separate authorization.
- Keep SQLite database files and sidecars out of version control; commit Prisma schema and migration source files instead.
- Regenerate OpenAPI and the shared client after contract changes using the existing scripts. Never hand-edit `prototype-api/openapi.json` or `api-client/src/generated/`, add handwritten substitutes for missing generated endpoints, or commit `api-client/dist/`. Preserve runtime base-URL configuration and existing client exports unrelated to the approved change.
- Document local setup, environment variable names, migration commands, routes, relation input semantics, stable client operation names, generation commands, and a schema-consistent request example in backend documentation. Do not embed credentials or add seed records unless requested.
- Keep changes minimal and repeatable: no duplicate columns, modules, relations, migrations, validators, or DTOs on subsequent runs. Do not remove legacy fields/data automatically when schema drift is detected; obtain explicit approval and a migration plan.

## 5. Verify and report

Use current package scripts from the monorepo root. Run Prisma schema validation and client generation using the project's configured schema and installed version (normally `pnpm --filter prototype-api exec prisma validate` and `pnpm --filter prototype-api exec prisma generate`) before build/tests. Verify migrations against an isolated disposable SQLite database. Check language-server diagnostics when available, then run applicable checks, normally:

```bash
pnpm --filter prototype-api lint
pnpm --filter prototype-api build
pnpm --filter prototype-api test
pnpm --filter prototype-api test:e2e
pnpm client:generate
pnpm --filter prototype-api test:openapi
pnpm --filter @ifs/api-client lint
pnpm --filter @ifs/api-client test
pnpm --filter prototype build
```

`pnpm client:generate` first runs `pnpm openapi:generate` (Prisma generation + Nest compilation + JSON export), then Orval and the client build. To export only JSON, use `pnpm openapi:generate`; to regenerate/build only the client from existing JSON, use `pnpm --filter @ifs/api-client generate`. Use the compiled exporter, not `tsx`/`ts-node` or plain `tsc`, which bypass the Nest Swagger plugin. Run `test:openapi` after regeneration because it checks the current exported contract. Building `prototype` verifies compatibility without authorizing frontend source changes.

Add or extend contract tests for the new resource, not just the existing greeting. Verify paths/methods, unique operation IDs, parameter/body requiredness, DTO component properties, nullable/optional behavior, documented response shapes/statuses/content types, and resolved references. Check `/docs` and `/docs-json` remain available. Vitest's ordinary source transforms do not run the Nest compiler plugin, so assertions depending on inferred metadata must exercise the compiled API/export. Ensure standalone export remains database-free.

Inspect generated client functions and models: the new operations must be exported from `@ifs/api-client`, with typed inputs and responses matching actual HTTP behavior rather than missing/empty schemas or unintended `any`/`unknown`. Add applicable client checks for the resource, including request serialization and response handling. Regeneration must be repeatable; do not suppress generator/type errors, weaken schemas, or patch generated code to make checks pass.

Tests must cover real Prisma-backed persistence in an isolated disposable SQLite test database, CRUD and missing records, invalid inputs, immutable/read-only fields, PATCH preservation, schema-valid responses, and applicable relation/extension-data behavior. Include tests preventing string-ID numeric coercion and null-versus-omitted regressions where relevant. Mock-only service tests do not prove persistence. Never use production/shared data for tests; if database access or setup is unavailable, report blocked verification instead of claiming success.

Inspect the final diff: only approved backend/workspace/client files and regenerated contract artifacts changed; standards and frontend source remain untouched. Review generated diffs for accidental breaking client changes. Report concisely:

- Source schema path and created/updated backend files.
- Endpoints, persistence mapping, DTO/validation behavior, and related-model changes.
- Generated client operation names, artifact paths, Swagger documentation URLs, and OpenAPI/client regeneration commands.
- Database/environment setup and migration commands still required.
- Checks actually run, their outcomes, and any pre-existing failures or blockers.
- Any approved deviations or limitations; never claim complete standards coverage if unverified.
