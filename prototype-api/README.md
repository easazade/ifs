# IFS Prototype API

NestJS backend using **SurrealDB 3.x** and the **JavaScript SDK 2.x**. Use Node.js 24 and the pnpm version pinned in the root `package.json`.

## Local setup

Install the [SurrealDB CLI](https://surrealdb.com/install) (tested with 3.3.0), then run from the repository root:

```bash
pnpm install
cp prototype-api/.env.example prototype-api/.env
pnpm --filter prototype-api db:start
```

Keep that database process running. In another terminal:

```bash
pnpm --filter prototype-api db:setup
pnpm --filter prototype-api dev
```

The API listens on `http://localhost:3000`; `GET /` returns `Hello World!`. Swagger is at `/docs`, with JSON at `/docs-json`.

## Configuration

`prototype-api/.env` is loaded by the application and database scripts. Existing environment variables take precedence. The API uses WebSocket RPC for interactive validation transactions: configured HTTP(S) endpoints are converted to WS(S) using the same host and path. Proxies must allow WebSocket upgrades; CLI database scripts still support HTTP RPC.

| Variable              | Default                     | Meaning                       |
| --------------------- | --------------------------- | ----------------------------- |
| `SURREALDB_URL`       | `http://127.0.0.1:8000/rpc` | HTTP(S) or WS(S) RPC endpoint |
| `SURREALDB_NAMESPACE` | `ifs`                       | Database namespace            |
| `SURREALDB_DATABASE`  | `prototype`                 | Database name                 |
| `SURREALDB_USERNAME`  | Required                    | Authentication username       |
| `SURREALDB_PASSWORD`  | Required                    | Authentication password       |
| `PORT`                | `3000`                      | API HTTP port                 |

The example's `root`/`root` credentials are **local development only**. Use separate least-privilege application credentials and TLS for deployment. Root credentials are needed to provision namespaces with `db:setup` and initialize a new local server. A server's existing root password is not changed by restarting it with different environment variables.

### Database scripts

```bash
pnpm --filter prototype-api db:start         # Persistent local server
pnpm --filter prototype-api db:start:memory  # Disposable server; data lost on exit
pnpm --filter prototype-api db:setup         # Additive, idempotent table provisioning
pnpm --filter prototype-api db:clear         # Delete and recreate the selected local DB
pnpm --filter prototype-api db:status        # Verify selected DB and report server version
pnpm --filter prototype-api db:sql           # Interactive SurrealQL shell
```

`db:start` binds only to the configured loopback endpoint and stores data under `prototype-api/.surreal/data` using RocksDB. These files are ignored by Git. Stop it with Ctrl+C. `db:start:memory` uses the same endpoint and cannot run alongside it on the same port.

`db:setup` creates the namespace/database and schemaless entity tables from `ifs-standards/scripts/generate-order.json`. It never drops, overwrites, or resets existing definitions/data. Setup identifiers accept letters, digits, underscores, and hyphens (not a leading digit). Review definition changes before applying them. There is no automatic migration/reset at startup. `db:clear` destructively removes the selected database and recreates its entity tables on the running server; it refuses non-loopback endpoints and leaves other databases untouched. Stop the API and simulation writers first. Before any database command, verify its endpoint, namespace, and database.

## Persistence

- `src/surreal/surreal.module.ts`: global Nest module exporting one shared client.
- `src/surreal/surreal.service.ts`: connects on module initialization and closes on shutdown.
- `src/surreal/database.config.ts`: shared runtime/CLI configuration.
- `src/surreal/database.setup.ts`: explicit additive provisioning.
- `scripts/database.mjs`: local server, provisioning, status, and SQL commands.

Generated CRUD services delegate to `SurrealService`. String entity IDs are stored as the string component of SurrealDB record IDs and returned without a table prefix. `$ref` properties are stored as record links and expanded recursively on reads; read-only relations are not written. PATCH merges fields, empty arrays clear list relations, and nullable single links accept `null`. Missing root records produce 404 for read/update/delete; duplicate root IDs produce 409. Embedded objects and primitive arrays remain native document values.

### Nested entity writes

Writable entity relations accept nested write objects on both POST and PATCH:

- An omitted, `null`, or empty-string nested `id` generates a new canonical `EntityType/UUID` ID and attaches the new entity. The nested object must supply fields beyond its ID. The root still requires its own ID.
- A nonempty nested ID plus fields creates the child if missing, or merges supplied fields if it exists. Omitted fields are preserved; the entity type is inferred from the relation, and an explicitly conflicting type is rejected.
- A nonempty ID alone links an existing entity. It can also reference an entity defined elsewhere in the same request. A missing ID-only reference returns 400.
- A supplied relation array replaces that collection. Removing a child from the collection unlinks it, never deletes it. Updating a shared child changes it for every parent referencing its ID.

`src/surreal/nested-write.ts` collects recursive writes and executes children, root, and reference checks in one bound SurrealDB transaction. A failed write rolls everything back, including child updates. Conflicting definitions for the same ID are rejected; ID-only cycles are supported. Graph-edge entities cannot be nested writes. Requests are limited to 32 nested levels and 1,000 entity objects; read expansion emits ID-only references at cycles or its depth limit.

The response contains generated IDs and expanded children. Write DTOs use separate `Nested<Entity>Dto` classes with optional fields and nullable IDs; persisted and response IDs remain strings. Optional write fields permit partial updates, not incomplete new entities: every new child must satisfy all canonical required fields after its ID/type are assigned. Response relation types explicitly allow full entities or ID-only references at cycles/depth limits. There is no request idempotency-key implementation yet; retrying a successful request containing blank nested IDs can create additional children.

### Canonical validation

Generated HTTP services call `createEntity`/`updateEntity`. These execute writes in an interactive transaction, then validate the complete resulting root, all changed children, and their actual stored references with Ajv 2020-12 before commit. PATCH uses SurrealDB's merged state, not an independent partial-body validator. Any invalid entity cancels the whole transaction and returns 400 with its ID, schema keyword, instance path, and error details. Validation does not coerce types, strip unknown fields, or insert schema defaults.

Validation uses generated offline copies of the original canonical schemas, retaining inheritance, `$defs`, `allOf`, `anyOf`, conditional rules, required fields, formats, and patterns. Record links are checked as typed identities and each referenced record is validated separately, avoiding infinite recursive JSON for cyclic graphs. Missing read-only collections use the same server-derived empty-array view as reads; clients cannot write those collections. Validation traversals are bounded to 1,000 distinct entities.

`create`/`update` and edge equivalents remain low-level, unvalidated storage adapters for internal provisioning/persistence tests; do not use them for user-facing writes. Existing invalid records are not migrated automatically and may reject subsequent PATCH operations. Canonical validation does not implement prose-only rules such as timestamp ordering or IANA timezone membership; authorization and those semantic checks remain separate concerns.

### Relationship graph edges

`Relationship` is a SurrealDB graph edge; `RelationshipType` remains a normal entity. `src/surreal/entity-storage.ts` defines the edge mapping and immutable endpoints. Resource generation also emits `src/surreal/entity-tables.generated.ts` from canonical schemas to resolve endpoint entity types safely.

The `relationship` table uses `TYPE RELATION ENFORCED`. Creation uses `RELATE`, storing `sourceId` as `in` and `targetId` as `out`; reads expose only the public fields. Canonical IDs such as `Organization/1` retain their full string as the record key, matching existing CRUD. Endpoints and the selected relationship type must exist, allowed source/target types are checked, and copied relationship names must match that type. PATCH can update properties but cannot supply `sourceId`, `targetId`, `in`, or `out`; reconnect by deleting and recreating an edge. Edge DTOs, OpenAPI, and the Fetch client keep the database details internal.

Setup refuses an existing non-relation `relationship` table rather than silently converting it. Back up and migrate existing relationship records, or **explicitly approve their deletion** before removing that table and rerunning `db:setup`. Regular tables and their data need not be reset. SurrealDB enforces edge endpoint existence and handles edge cleanup when an endpoint is deleted; this does not replace application authorization or transactional domain validation.

Tables are schemaless, not database-enforced copies of JSON Schema. Swagger DTOs remain documentation/types, **not runtime validation**; canonical validation is performed by the shared transaction layer described above. Ordinary `$ref` record links do not have database-level foreign-key/delete constraints. Nested-write transactions check their existence before commit, but later deletes can still leave dangling links. Graph edges have the special enforcement described above. Review/extend validation, transactions, relation ownership, and authorization before production use.

### Query associated relationships

Every generated resource exposes `GET /<plural-route>/:id/relations` (for example `/members/Member%2F1/relations`) and a service `findRelations(id, query)` method. Results are `RelationshipResponseDto[]`, with public `sourceId`/`targetId`, not raw database edges or expanded endpoints. This queries `Relationship` graph edges, not ordinary embedded `$ref` properties. A missing object returns 404; an existing object without matching edges returns `[]`.

Optional query parameters:

- `direction`: `both` (default), `incoming` (object is `out`), or `outgoing` (object is `in`).
- `filter`: URL-encoded JSON object of equality predicates, combined with AND. Relation fields and dotted endpoint fields are supported, including custom schemaless fields: `{"type":"has member","out.name":"Alice"}`. `in` means source and `out` means target. `in`/`out`, `in.id`/`out.id`, and `sourceId`/`targetId` accept canonical endpoint IDs. `id` accepts a canonical `Relationship/id`. Arrays/objects compare as whole JSON values; `null` matches explicit null, not absent fields. There are no comparison operators or raw SQL filters.

Malformed filters/directions return 400. Field paths must contain identifier segments (at most eight), values are bound SQL parameters, and filters are limited to 100 fields and a 16 KiB JSON string. Endpoint fields are dereferenced for filtering only; the response remains the public relationship shape. Result ordering is unspecified and this prototype endpoint is not paginated.

## Generation and OpenAPI

Canonical entity schemas remain `ifs-standards/src/entities/**/*.schema.json`.

```bash
pnpm --filter prototype-api dto:generate member
pnpm --filter prototype-api dto:generate:all
pnpm --filter prototype-api resource:generate member
pnpm --filter prototype-api resource:generate:all
pnpm client:generate
```

DTO generation resolves inherited schema fields with `ifs-standards/scripts/entity-schema.ts` and emits create/update/response and nested-write classes, including typed nested relations. Create DTOs omit read-only fields; response DTOs omit write-only fields. Abstract `Entity` has no resource/table. Generate dependencies first; missing related response DTOs fail before writing. `--skip-format` skips formatting.

Resource generation writes marked CRUD services/controllers/modules, refreshes `src/generated-resources.module.ts`, `src/surreal/entity-tables.generated.ts` (including recursive relation metadata), and `src/surreal/entity-schemas.generated.ts` (original schemas and effective contracts), and refuses to overwrite hand-written resources. It uses `ifs-standards/scripts/entity-relations.json` for relation metadata. A single-resource command regenerates **all DTOs** first unless `--skip-dtos` is supplied; the all-resources command generates DTOs once before its resource loop. Neither generator connects to a database.

After schema or default relationship metadata changes, run `pnpm --filter ifs-standards entities` first to refresh annotations, order, relations, and overview. Root `pnpm generate:all` then regenerates API DTOs/resources, OpenAPI, the client, and puppeteer's `src/game/api.ts`; it does not refresh standards metadata or fake personalities.

Generated controllers retain plural routes, concrete DTOs, stable unique Swagger `operationId` values, and explicit response metadata. After contract changes, run `pnpm client:generate` and commit `prototype-api/openapi.json` plus `prototype-client/src/generated/api.ts`; never hand-edit them.

`pnpm openapi:generate` builds Nest and runs `dist/generate-openapi.js`. The exporter creates the Nest container without initializing/listening, so it needs no running database, credentials, or port. Keep constructors free of database/network side effects. The Swagger compiler plugin augments metadata; it does not generate the JSON/client itself. `src/schema-openapi.ts` then projects canonical contracts into OpenAPI 3.0: local definitions are resolved, integer types and object-level alternatives are retained, and `if`/`then`/`else` become equivalent `anyOf`/`not` compositions. Create/response schemas enforce complete-object rules; nested/PATCH schemas intentionally describe partial writes whose merged results are validated at runtime. Unsupported validation keywords fail export instead of being silently dropped.

## Build and verification

```bash
pnpm --filter prototype-api build
pnpm --filter prototype-api start:prod
pnpm --filter prototype-api lint
pnpm --filter prototype-api test
pnpm --filter prototype-api test:e2e
pnpm --filter prototype-api test:openapi
pnpm --filter prototype-client test
```

Database unit/integration and E2E tests require the SurrealDB 3.x CLI on PATH, or `SURREALDB_BINARY=/absolute/path/to/surreal`. They launch their own authenticated in-memory servers on temporary ports, never using the development database. Tests cover CRUD, record links, string IDs, nulls, read-only writes, reconnection, missing records, Swagger, and generated HTTP routes. Generator/configuration/OpenAPI tests do not need a running database.

The inherited Observe module still contains placeholder telemetry credentials; configure it separately if needed.
