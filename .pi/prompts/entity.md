---
description: Create or update an IFS entity schema source file
argument-hint: '<entity-name> [entity specification]'
---

Create a new IFS entity named `$1`, or update it if it already exists.

Initial entity specification:

```text
${@:2}
```

## Monorepo scope and paths

This prompt manages IFS Standards entities only, not entities in other workspace packages.

- Locate the monorepo root containing `pnpm-workspace.yaml` and `ifs-standards/package.json`. All repository paths below are relative to that root, not the prompt directory or the current working directory.
- Read and follow root `AGENTS.md` and any applicable package-local instructions before inspecting schemas or asking the questionnaire.
- Keep all schema creation, updates, and style-reference lookups inside `ifs-standards/src/entities/`.
- Run the generation command from the monorepo root. If the current working directory differs, explicitly set the command's working directory or change to the monorepo root first.

## Goal

Create or update this source file:

- `ifs-standards/src/entities/<kebab-case-entity-name>/<kebab-case-entity-name>.schema.json`

Do not create or manually edit an `.mdx` file for the entity. Do not read `.mdx` files as input or use them to decide schema changes.

Use only existing `*.schema.json` files in `ifs-standards/src/entities/` as style references before creating or updating schema files. If the target schema already exists, read it first and preserve compatible existing fields unless the user asks to change/remove them.

## Source of truth

- `*.schema.json` files are the only source of truth for entities.
- `.mdx` docs, classes, indexes, and every other derived artifact must be generated from `*.schema.json` files.
- Never create or generate entity examples, example instance files, `examples/` directories, or JSON Schema `examples` annotations. This prohibition also applies to basic related-entity schemas and derived generation.
- Never reverse-engineer or update a schema from an `.mdx` file.

## Connection modeling and Relationship approval

Classify each connection by its meaning, not by the number of possible relationships between the two entity types:

- **Fixed-purpose connection:** the meaning is defined by a named schema field. Use composition, an entity `$ref`, or an `Id`/`Ids` field as appropriate; do not introduce a generic `Relationship` object. Examples: `Change.changes` connects change items, `Comment.subjectId` identifies what a comment is about, and `Comment.authorId` identifies its author. These are modeling examples, not instructions to add fields automatically.
- **Variable-purpose connection:** the meaning is selected for each association through a `RelationshipType`. Consider a `Relationship` object when, for example, a member may reside in, work in, or represent a place. Having many possible connections between the same entity types does not make every connection generic: `Organization.createdById` is still a fixed-purpose reference.
- **Specialized connection:** when the connection carries specific domain data or rules, prefer a dedicated entity such as `Delegation` or `Vote`, with named references, rather than reducing it to a generic `Relationship`.

Whenever you recommend representing a connection with a `Relationship` object:

1. Explain the proposed source and target types, relationship meaning/type, and why this is preferable to a named field or a dedicated entity.
2. Ask explicitly whether the user approves that specific connection being modeled with `Relationship`. Include the recommendation and approval question in the initial numbered questionnaire when known; if discovered later, ask a numbered follow-up and wait before applying it.
3. General permission to infer fields or create/update schemas is not approval to use `Relationship`. Proceed only when the user explicitly approves the specific recommendation; a new or materially changed recommendation needs its own approval.
4. Do not silently replace existing named fields with generic relationships, add a generic relationship alongside the same authoritative field, or introduce associated `RelationshipType` definitions without approval. If the user declines, agree on a named-field or specialized-entity alternative before applying it.

This prompt edits entity schemas, not instance data. Approval of a modeling recommendation does not authorize creating persisted `Relationship` records or changing other workspaces.

## Interaction flow

Do not create or update files immediately. First interview the user in one batch so `pi-questions-helper` can extract every question and help the user answer them at once.

Important interaction rules:

- In the first assistant response, ask all needed questions together as a numbered list.
- After the numbered questions, stop and wait for the user's next message.
- Do not create or update files in the first response.
- The next user message may be a `pi-questions-helper` draft such as "Here are my answers to your questions:". Parse those answers.
- If answers are sufficient and the user granted final approval, proceed to schema creation or update only after any proposed `Relationship` modeling has also received specific approval.
- If required answers are missing or ambiguous, ask only the missing follow-up questions and wait.
- If the user did not grant final approval, present the final property plan and ask for approval before writing files.
- If project rules require a trace footer, include it after the numbered questions.

### Step 1: First response questionnaire

First check whether `ifs-standards/src/entities/<kebab-case-entity-name>/<kebab-case-entity-name>.schema.json` exists.

If it does not exist, briefly restate what you understand about the entity from the name and specification, then ask this numbered creation questionnaire, append any specific `Relationship` recommendations and approval questions, and wait:

1. Is this meaning correct? If not, what should change?
2. What user-defined properties should this entity include? Reply with one property per line using `name: type - description`, or say `none`.
3. Should this entity include all common properties, only some, or none? Common properties: `id`, `basedOn`, `entityDocumentationUrl`, `createdAt`, `updatedAt`. Reply `all`, `none`, or `some: <property names>`. The required, fixed `entityType` discriminator is always included independently.
4. Which of the user-defined properties are required? List names, or say `infer` / `none`.
5. Should I intelligently infer recommended IFS fields, required properties, and possible relations from the entity purpose? Reply `yes` or `no`.
6. Should the schema be strict with `additionalProperties: false`, or flexible with `additionalProperties: true`? Reply `strict` or `flexible`.
7. Do you approve me to create the schema file(s) immediately after applying your answers and any requested inference? Reply `yes` or `no`.

If it exists, read the existing schema first, briefly summarize current fields, then ask this update questionnaire, append any specific `Relationship` recommendations and approval questions, and wait:

1. What should change? List fields to add/change/remove using `name: type - description`, or describe the desired behavior.
2. Should existing compatible fields stay unchanged? Reply `yes` unless you want removals/renames.
3. Which new or changed fields should be required? List names, or say `infer` / `none` / `unchanged`.
4. Should I infer small related updates from the requested change? Reply `yes` or `no`.
5. Do you approve me to update the schema immediately after applying your answers? Reply `yes` or `no`.

Accepted property examples:

- `id: string - globally unique entity identifier`
- `id - globally unique entity identifier` (no type specified)
- `id` (no type or description specified)
- `createdAt: string(date-time) - creation timestamp`
- `stewardIds: array<string> - stewards responsible for this entity`
- `permissions: array<Permission> - permission entities related to this entity`
- `owner: Member - member entity that owns this entity`
- `status: enum(draft, active, revoked) - lifecycle state`

### Step 2: Parse the answer batch

After the user answers:

1. Parse each user-defined property name, type, format/enum/items if present, and description.
2. Parse the common properties answer. Add all common properties for `all`, no optional common properties for `none`, or only the listed common properties for `some: ...`. Always include required `entityType` with `const` equal to the exact schema title. The `basedOn` common property is an optional string identifying the id of the object this object is derived from. The `entityDocumentationUrl` common property is a string URI for documentation about this entity.
3. For any `object`, `array<object>`, PascalCase type, or description suggesting another entity object, check `ifs-standards/src/entities/` for a matching `*.schema.json` file before writing files. Match both singular and plural names, e.g. `permissions` -> `permission`, `roles` -> `role`. Ignore `.mdx` files completely.
4. IDs and references are the same string value: `EntityType/ID`. The local `ID` may be a number, a meaningful name, or another stable unique identifier; it is not limited to numbers. Prefer a meaningful name when appropriate, e.g. `Organization/Everly` for the organization Everly; otherwise use a numeric identifier such as `Organization/2` or `Member/1`. The full ID is always a string, and the entity-type prefix must match the schema's casing (currently PascalCase). Apply this to `id`, related IDs, `basedOn`, and heterogeneous pointers; arrays contain these strings.
5. Name identifier fields with `Id` (singular) or `Ids` (plural), not `Ref`, `Reference`, or `Refs`. Do not add `ifsId`.
6. Treat each entity schema as one database object type. If a property represents a relation to another database object/entity type, reference that entity type with `$ref`; do not embed the related object's shape inside the current entity schema.
7. If the referenced entity exists, use a JSON Schema `$ref` to that entity schema `$id`. If the referenced entity does not exist, create a basic schema for it under `ifs-standards/src/entities/<kebab-case-related-entity>/<kebab-case-related-entity>.schema.json` and then `$ref` it. The basic related-entity schema must include only the selected common properties unless the user supplied more details.
8. If a property is arbitrary embedded value/config data and not a database object/entity relationship, keep it as `type: object` with appropriate `additionalProperties` and document why it is not a `$ref`.
9. If entity-object relation vs ID-string intent is ambiguous, ask a concise follow-up before writing files.
10. If the user answered `yes` to inference:

- Think through the entity in the IFS context.
- Add likely required fields unless contradicted by the user.
- Add useful optional fields unless contradicted by the user.
- Add useful fixed-purpose references to other entities under `ifs-standards/src/entities/`. For any inferred connection better modeled with `Relationship`, recommend it and obtain specific approval under the connection-modeling rules before applying it.
- If a useful relation targets a missing entity, create a basic related-entity schema for it and reference it.
- Keep ID fields as strings in `EntityType/ID` form, not expanded entity objects.
- Explain inferred fields and relations in the final report.

11. If the user answered `no` to inference:

- Use only user-provided properties plus the selected common properties and the mandatory fixed `entityType` discriminator.

12. If the user approved immediate creation/update and explicitly approved every proposed `Relationship` modeling choice, create or update the schema file(s). If a proposed `Relationship` choice is still pending, ask for that approval and wait before writing files.
13. If the user did not approve immediate creation/update, show the final property plan and ask for approval.

### Step 3: Create or update schema files

Only after approval:

1. Create the entity directory using kebab-case if missing.
2. Create the JSON Schema file, or update the existing schema file in place if it already exists.
3. Create any basic related-entity schema files needed for referenced entity types that do not already exist.
4. Do not create or manually update `.mdx` documentation; derived docs are generated from schemas.

## JSON Schema rules

- Use JSON Schema draft 2020-12.
- Set `$schema` to `https://json-schema.org/draft/2020-12/schema`.
- Set `$id` to `https://ifs-standards.org/schemas/v1/entities/<kebab-case-entity-name>.schema.json`.
- Use a human-readable `title` in PascalCase / title case.
- Set `type` to `object`.
- Include `additionalProperties` according to the entity need; default to `true` unless the user asks for a strict schema.
- Convert collected properties into valid JSON Schema `properties`.
- For entity-object references, prefer absolute `$ref` values matching schema `$id`, not relative file paths. Example: `"$ref": "https://ifs-standards.org/schemas/v1/entities/permission.schema.json"`.
- For `array<EntityName>` or plural entity-object properties, put the `$ref` inside `items`. Example: `"permissions": { "type": "array", "items": { "$ref": "https://ifs-standards.org/schemas/v1/entities/permission.schema.json" } }`.
- For single entity-object properties, use direct `$ref`. Example: `"owner": { "$ref": "https://ifs-standards.org/schemas/v1/entities/member.schema.json" }`.
- Mark every ID string schema with `"x-ifs-id": true`, including `id`, related ID fields, `basedOn`, and heterogeneous pointers. For ID arrays, put the marker on the string schema in `items`, not on the array.
- Define every ID's standard JSON Schema `pattern` using the JSON-escaped examples below:
  - Known entity type: `"pattern": "^Member/[^/\\s]+$"`. Replace `Member` with the owning type for `id`, or the target type for related IDs.
  - Several allowed types: `"pattern": "^(Member|Role)/[^/\\s]+$"`.
  - Any entity type: `"pattern": "^[A-Z][A-Za-z0-9]*/[^/\\s]+$"` for heterogeneous IDs such as `basedOn`.
  - Anchor with `^` and `$`; require a nonempty local ID without slashes or whitespace. JSON requires `\\` to represent a regex backslash.
  - For ID arrays, put both `pattern` and `"x-ifs-id": true` on `items`. Preserve allowed nulls with `"type": ["string", "null"]`; the pattern constrains only strings.
- Do not use `format: "ifs-ref"` or bare `format: "uuid"` for IDs.
- For new schemas, apply common properties according to the user's answer: `all`, `none`, or `some: <property names>`. This selection never excludes the mandatory fixed `entityType` discriminator.
- For existing schemas, preserve existing common properties unless the user explicitly asks to change/remove them.
- Common properties selected by the user should be included in both `properties` and `required`, except `basedOn`, which is optional and should be included only in `properties`.
- `id` uses the entity's PascalCase type prefix. Do not add a separate `ifsId` or default ID values.
- `entityType` is an immutable discriminator. Every entity schema must define it as `type: "string"` with `const` equal to the schema's exact `title` (case-sensitive, including spaces), and include it in `required`, regardless of the selected common properties. Example: a schema titled `Member` must use `"entityType": { "type": "string", "const": "Member" }`. Never allow an arbitrary string, another entity type, or a mutable discriminator. Apply this to new, existing, and basic related-entity schemas.
- `basedOn` is an optional common string property describing the id of the object this object is derived from.
- `entityDocumentationUrl` is a common string property with `format: "uri"` describing the documentation URL for this entity.
- If an entity reference points to a missing entity type, create a basic schema file for that related entity before running derived generation. The basic schema must use draft 2020-12, the canonical `$id`, title, `type: "object"`, `additionalProperties: true`, and selected common properties/required fields.
- If keeping an embedded object instead of an entity reference, include `type: "object"` and document why it is not a `$ref`.
- Include a `required` array based on user instructions and approved inferred required fields.
- Keep property descriptions short and consistent with the unified ID format.

## Derived artifact rules

Do not write `.mdx` documentation directly. If docs, classes, indexes, or other derived files are needed, generate them from `*.schema.json` files via the project generation command. Never generate entity examples or run an example generator. Schemas flow outward; derived artifacts never flow back into schemas.

### Step 4: Regenerate derived entity artifacts

After approved schema file creation/update is complete, run from the monorepo root:

```bash
pnpm --filter ifs-standards entities
```

## Output after creation/update

After writing schema files, regenerating derived artifacts, and finally regenerating `generate-order.json`, report:

- Created or updated files, including any basic related-entity schemas
- Final properties
- Required fields
- Any inferred fields or relations
- Any missing related entities created as basic schemas
- `pnpm --filter ifs-standards entities` result
