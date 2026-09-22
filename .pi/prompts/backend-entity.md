---
description: Create or update a NestJS backend resource from an existing IFS entity schema
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
- Read applicable repository instructions, including `ifs-standards/AGENTS.md`, before inspecting schemas. Read `.pi/prompts/entity.md` for standards conventions, but do not execute its schema-creation workflow.
- Standards input: `ifs-standards/src/entities/<name>/<name>.schema.json`.
- Backend output: `prototype-api/`, with workspace dependency/lockfile changes only when needed and approved.
- Do not modify `ifs-standards/`, generated standards artifacts, or the frontend. Do not run `pnpm --filter ifs-standards entities`.
- The backend stack is NestJS with Prisma ORM and SQLite. Treat this as decided; do not ask the user to choose an ORM or database, introduce TypeORM, or silently switch providers. If existing configuration conflicts, report it and obtain approval before replacing or migrating it.
- Prisma schema models define persistence and relations. Create/update DTOs are separate NestJS request contracts, not Prisma models or generated Prisma input types. Reuse the project's validation tooling or ask which to use if undecided.

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
- Existing controller routes, DTOs, persistence models, services, and shared utilities. Search registrations too; a partially scaffolded resource is an update, not a reason to generate duplicates.
- Git status/diff so existing user changes remain intact.

First response: briefly state the resolved schema path, whether this is creation or update, and the proposed field/relation mapping. Ask all needed questions together as a numbered list so `pi-questions-helper` can collect one answer batch. Do not write files; stop and wait. Include any required trace footer after the questions.

Tailor questions to actual gaps. Reuse established configuration and requirements instead of asking the user to repeat them:

1. Confirm the intended operation and scope: default is schema-aligned create/list/get/update/delete; for an existing resource, what behavior should change? Preserve compatible custom logic and routes by default.
2. Reuse existing Prisma/SQLite setup. If absent, propose minimal Prisma setup with a local SQLite database and a separate disposable test database as part of the approval plan. Ask only about unresolved file locations or environment configuration, not the already-decided ORM/database. Request environment variable names, not secrets in chat.
3. If request validation tooling is undecided, which approach should be used? Recommend JSON Schema draft 2020-12 validation (for example Ajv) when needed for faithful schema coverage; clarify any library the user says they will name later.
4. Which fields are server-managed versus client-supplied, and how are IDs, timestamps, `ifsId`, and read-only fields populated? Ask only where schema annotations and existing conventions do not settle it.
5. For entity relations, clarify ownership, cardinality/uniqueness not expressed by the schema, whether writes link existing records or create nested records, and deletion behavior. Show any required related persistence models; request approval before adding or changing them. Do not silently scaffold related CRUD endpoints.
6. Ask about unresolved frontend/API needs only when relevant: route compatibility, list pagination, allowed development origins, or existing authentication/authorization conventions. Do not invent governance rules from schema descriptions.
7. Approve the concrete file/change plan, including dependencies, shared infrastructure, related models, and migrations? Explicitly flag any breaking route/field changes or potentially destructive database changes.

Parse the user's answer batch, including `Here are my answers to your questions:` drafts. If answers are incomplete or conflicting, ask only missing follow-ups and wait. If approval was withheld, present the final plan and obtain approval before writes. Do not treat code-generation approval as permission to drop data or migrate a shared/production database.

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

## 4. Implement after approval

Create missing files or update existing files in place, following repository conventions:

```text
prototype-api/src/<entity>/
  <entity>.module.ts
  <entity>.controller.ts
  <entity>.service.ts
  dto/create-<entity>.dto.ts
  dto/update-<entity>.dto.ts
  <entity>.controller.spec.ts
  <entity>.service.spec.ts
```

Add or update persistence models in the existing Prisma schema (normally `prototype-api/prisma/schema.prisma`) and migrations in its configured migrations directory. Do not create TypeORM-style `entities/<entity>.entity.ts` persistence classes or manually edit generated Prisma Client files. Retain existing entity classes only if needed as non-ORM domain/response types.

Add integration/e2e tests and shared validation/database files only as needed. Preserve ESM/NodeNext `.js` import conventions where used. Do not blindly run `nest generate resource` over existing files; fill partial scaffolds without overwriting custom code.

- Register the resource module and reuse a shared injectable Prisma service/client with appropriate lifecycle management. Configure Prisma with the SQLite provider only if setup is missing; keep dependency versions, generated-client imports, adapters, scripts, and package manager compatible with the workspace. Do not instantiate a new client per request.
- Implement real SQLite persistence through Prisma Client, not scaffold strings or in-memory mocks. Use Prisma transactions for multi-record writes that must be atomic; explicitly map validated DTO fields to Prisma operations.
- Default routes follow existing conventions: POST collection, GET collection, GET `:id`, PATCH `:id`, DELETE `:id`. Define status codes, response shapes, not-found behavior, validation errors, and uniqueness/relation conflict handling. Avoid leaking database details.
- Use explicit field mapping, bounded list queries with documented limits, and safe relation loading/serialization. Avoid unbounded eager relation recursion.
- Maintain existing guards/auth behavior. Do not expose privileged fields through mass assignment. Prototype status does not authorize removing access controls or enabling destructive cascades.
- If CORS is needed, configure approved development origins through environment settings; do not enable unrestricted credentialed origins. Do not change the React application.
- Add Prisma migrations/configuration according to approved project conventions. Inspect generated SQL for SQLite table rebuilds and data-loss risks. Never delete database files, run `prisma migrate reset`, accept a reset prompt, or use `db push --force-reset`/`--accept-data-loss` without explicit destructive-action authorization. Prefer migrations over ad hoc `db push`; any local-only schema push needs explicit approval. Apply migrations only to an approved local development/test database, never a shared/production database without separate authorization.
- Keep SQLite database files and sidecars out of version control; commit Prisma schema and migration source files instead.
- Document local setup, environment variable names, migration commands, routes, relation input semantics, and a schema-consistent request example in backend documentation. Do not embed credentials or add seed records unless requested.
- Keep changes minimal and repeatable: no duplicate columns, modules, relations, migrations, validators, or DTOs on subsequent runs. Do not remove legacy fields/data automatically when schema drift is detected; obtain explicit approval and a migration plan.

## 5. Verify and report

Use current package scripts from the monorepo root. Run Prisma schema validation and client generation using the project's configured schema and installed version (normally `pnpm --filter prototype-api exec prisma validate` and `pnpm --filter prototype-api exec prisma generate`) before build/tests. Verify migrations against an isolated disposable SQLite database. Check language-server diagnostics when available, then run applicable checks, normally:

```bash
pnpm --filter prototype-api lint
pnpm --filter prototype-api build
pnpm --filter prototype-api test
pnpm --filter prototype-api test:e2e
```

Tests must cover real Prisma-backed persistence in an isolated disposable SQLite test database, CRUD and missing records, invalid inputs, immutable/read-only fields, PATCH preservation, schema-valid responses, and applicable relation/extension-data behavior. Include tests preventing string-ID numeric coercion and null-versus-omitted regressions where relevant. Mock-only service tests do not prove persistence. Never use production/shared data for tests; if database access or setup is unavailable, report blocked verification instead of claiming success.

Inspect the final diff: only approved backend/workspace files changed; standards untouched. Report concisely:

- Source schema path and created/updated backend files.
- Endpoints, persistence mapping, DTO/validation behavior, and related-model changes.
- Database/environment setup and migration commands still required.
- Checks actually run, their outcomes, and any pre-existing failures or blockers.
- Any approved deviations or limitations; never claim complete standards coverage if unverified.
