---
description: Create or update an IFS entity schema source file
argument-hint: '<entity-name> [entity specification]'
---

Create a new IFS entity named `$1`, or update it if it already exists.

Initial entity specification:

```text
${@:2}
```

## Goal

Create or update this source file:

- `src/entities/<kebab-case-entity-name>/<kebab-case-entity-name>.schema.json`

Do not create or manually edit an `.mdx` file for the entity. Do not read `.mdx` files as input or use them to decide schema changes.

Use only existing `*.schema.json` files in `src/entities/` as style references before creating or updating schema files. If the target schema already exists, read it first and preserve compatible existing fields unless the user asks to change/remove them.

## Source of truth

- `*.schema.json` files are the only source of truth for entities.
- `.mdx` docs, generated examples, classes, indexes, and every other derived artifact must be generated from `*.schema.json` files.
- Never reverse-engineer or update a schema from an `.mdx` file.

## Interaction flow

Do not create or update files immediately. First interview the user in one batch so `pi-questions-helper` can extract every question and help the user answer them at once.

Important interaction rules:

- In the first assistant response, ask all needed questions together as a numbered list.
- After the numbered questions, stop and wait for the user's next message.
- Do not create or update files in the first response.
- The next user message may be a `pi-questions-helper` draft such as "Here are my answers to your questions:". Parse those answers.
- If answers are sufficient and the user granted final approval, proceed directly to schema creation or update.
- If required answers are missing or ambiguous, ask only the missing follow-up questions and wait.
- If the user did not grant final approval, present the final property plan and ask for approval before writing files.
- If project rules require a trace footer, include it after the numbered questions.

### Step 1: First response questionnaire

First check whether `src/entities/<kebab-case-entity-name>/<kebab-case-entity-name>.schema.json` exists.

If it does not exist, briefly restate what you understand about the entity from the name and specification, then ask this numbered creation questionnaire and wait:

1. Is this meaning correct? If not, what should change?
2. What user-defined properties should this entity include? Reply with one property per line using `name: type - description`, or say `none`.
3. Should this entity include all common properties, only some, or none? Common properties: `id`, `ifsId`, `entityType`, `basedOn`, `entityDocumentationUrl`, `createdAt`, `updatedAt`. Reply `all`, `none`, or `some: <property names>`.
4. Which of the user-defined properties are required? List names, or say `infer` / `none`.
5. Should I intelligently infer recommended IFS fields, required properties, and possible relations from the entity purpose? Reply `yes` or `no`.
6. Should the schema be strict with `additionalProperties: false`, or flexible with `additionalProperties: true`? Reply `strict` or `flexible`.
7. Do you approve me to create the schema file(s) immediately after applying your answers and any requested inference? Reply `yes` or `no`.

If it exists, read the existing schema first, briefly summarize current fields, then ask only this update questionnaire and wait:

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
2. Parse the common properties answer. Add all common properties for `all`, no common properties for `none`, or only the listed common properties for `some: ...`. The `basedOn` common property is an optional string identifying the id of the object this object is derived from. The `entityDocumentationUrl` common property is a string URI for documentation about this entity.
3. For any `object`, `array<object>`, PascalCase type, or description suggesting another entity object, check `src/entities/` for a matching `*.schema.json` file before writing files. Match both singular and plural names, e.g. `permissions` -> `permission`, `roles` -> `role`. Ignore `.mdx` files completely.
4. Treat `Id` suffix fields (`scopeId`, `memberId`, `parentScopeId`, etc.) as identifier fields by default, not reference fields. Do not mark them with `format: "ifs-ref"` unless the user explicitly says that specific field is a reference string.
5. Treat a field as a reference string only when the user explicitly marks it as a reference/ref, or when its purpose is clearly a heterogeneous pointer to external objects/resources that should stay a plain string. Reference string fields must remain `type: "string"` or `array<string>` and use `format: "ifs-ref"`.
6. Treat each entity schema as one database object type. If a property represents a relation to another database object/entity type, reference that entity type with `$ref`; do not embed the related object's shape inside the current entity schema.
7. If the referenced entity exists, use a JSON Schema `$ref` to that entity schema `$id`. If the referenced entity does not exist, create a basic schema for it under `src/entities/<kebab-case-related-entity>/<kebab-case-related-entity>.schema.json` and then `$ref` it. The basic related-entity schema must include only the selected common properties unless the user supplied more details.
8. If a property is arbitrary embedded value/config data and not a database object/entity relationship, keep it as `type: object` with appropriate `additionalProperties` and document why it is not a `$ref`.
9. If entity-object relation vs identifier vs reference-string intent is ambiguous, ask a concise follow-up before writing files.
10. If the user answered `yes` to inference:

- Think through the entity in the IFS context.
- Add likely required fields unless contradicted by the user.
- Add useful optional fields unless contradicted by the user.
- Add possible relations to other entities under `src/entities/` when useful.
- If a useful relation targets a missing entity, create a basic related-entity schema for it and reference it.
- Do not infer `Id` suffix fields as `ifs-ref`; keep them as normal identifiers unless explicitly specified.
- Explain inferred fields and relations in the final report.

11. If the user answered `no` to inference:

- Use only user-provided properties plus the selected common properties.

12. If the user approved immediate creation/update, create or update the schema file(s).
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
- For reference-string fields, keep the value simple as `type: "string"` or `array<string>` and add `format: "ifs-ref"`. This marks it as a reference without changing the data shape.
- Do not treat an `Id` suffix as a reference-string signal. Fields like `scopeId`, `memberId`, `actorId`, and `parentScopeId` are most probably plain identifiers unless the user explicitly says otherwise.
- For new schemas, apply common properties according to the user's answer: `all`, `none`, or `some: <property names>`.
- For existing schemas, preserve existing common properties unless the user explicitly asks to change/remove them.
- Common properties selected by the user should be included in both `properties` and `required`, except `basedOn`, which is optional and should be included only in `properties`.
- `ifsId` is an actual IFS system identifier. Do not set a default value for it.
- `entityType` is like resource type: it identifies the entity category/type used by IFS implementations. Keep it as a string type/category field by default; do not force it to a PascalCase entity-name `const` unless the user explicitly asks for that.
- `basedOn` is an optional common string property describing the id of the object this object is derived from.
- `entityDocumentationUrl` is a common string property with `format: "uri"` describing the documentation URL for this entity.
- If an entity reference points to a missing entity type, create a basic schema file for that related entity before running derived generation. The basic schema must use draft 2020-12, the canonical `$id`, title, `type: "object"`, `additionalProperties: true`, and selected common properties/required fields.
- If keeping an embedded object instead of an entity reference, include `type: "object"` and document why it is not a `$ref`.
- Include a `required` array based on user instructions and approved inferred required fields.
- Prefer clear descriptions for every property.

## Derived artifact rules

Do not write `.mdx` documentation directly. If docs, examples, classes, indexes, or other derived files are needed, generate them from `*.schema.json` files via the project generation command. Schemas flow outward; derived artifacts never flow back into schemas.

### Step 4: Regenerate derived entity artifacts

After approved schema file creation/update is complete, run:

```bash
npm run entities
```

Important: run this only at the end of the approved creation/update run. Do not run it during the first questionnaire response. In the normal create flow, this means run it on the second assistant turn after the user answers approval with `yes` and schema files have been written.

## Output after creation/update

After writing schema files and running `npm run entities`, report:

- Created or updated files, including any basic related-entity schemas
- Final properties
- Required fields
- Any inferred fields or relations
- Any missing related entities created as basic schemas
- `npm run entities` result
