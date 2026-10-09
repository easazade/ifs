# IFS Standards

## Development

Use Node.js 24 and the pnpm version pinned in the root `package.json`. Run from the repository root:

```sh
pnpm install
pnpm --filter ifs-standards dev
```

The commands below also run from the repository root.

The application uses React, TypeScript, Vite, Tailwind CSS v4, and MDX.

| Command                                              | Purpose                                                                            |
| ---------------------------------------------------- | ---------------------------------------------------------------------------------- |
| `pnpm --filter ifs-standards typecheck`              | Strict TypeScript checks for the app, entity types, scripts, configs, and tests    |
| `pnpm --filter ifs-standards build`                  | Type-check, then create the production bundle in `ifs-standards/dist/`             |
| `pnpm --filter ifs-standards lint`                   | ESLint with TypeScript and React rules                                             |
| `pnpm --filter ifs-standards test`                   | Run Vitest tests                                                                   |
| `pnpm --filter ifs-standards test:watch`             | Watch tests                                                                        |
| `pnpm --filter ifs-standards preview`                | Serve the production bundle locally                                                |
| `pnpm --filter ifs-standards format`                 | Format source, tests, scripts, and TypeScript configs                              |
| `pnpm --filter ifs-standards entities`               | Regenerate relationship annotations, entity order, direct relations, and overview  |
| `pnpm --filter ifs-standards entities:relationships` | Update schema-level relationship annotations from default RelationshipType objects |
| `pnpm --filter ifs-standards entities:order`         | Regenerate `scripts/generate-order.json` for concrete entities                     |
| `pnpm --filter ifs-standards entities:relations`     | Regenerate `scripts/entity-relations.json` from direct entity schema references    |

Design tokens and font imports are maintained directly in `src/index.css`; component/base styles live in `src/custom.css`. Keep them aligned with root `DESIGN.md`.

Use `.tsx` for JSX components and `.ts` for other code. The app and Node tooling have separate TypeScript configs sharing `tsconfig.base.json`. See [NOTES.md](NOTES.md#typescript-workflow-and-null-safety) for TypeScript concepts and Flutter/Dart comparisons.

Entity JSON schemas are canonical; derived entity interfaces/docs must not be edited by hand. The current `entities` command generates metadata and `src/entities/overview.md`, not TypeScript interfaces or per-entity docs. Never create or regenerate entity examples. TypeScript does not replace runtime schema validation.

Concrete entities compose the abstract `Entity` schema. Resolve effective fields and requiredness with `scripts/entity-schema.ts`; inherited fields are not missing local definitions. `Entity` is not an instance, API resource, database table, or relationship endpoint. Create payloads omit read-only properties, even when those are required in the persisted schema.

### Relationship annotations

Run `pnpm --filter ifs-standards entities:relationships` from the repository root (also included in `entities`). The script reads `src/defaults/relationship-type/*.json` and updates the root `x-ifs-relationships` annotation in every concrete entity schema:

```json
"x-ifs-relationships": [
  { "relationshipTypeId": "RelationshipType/ifs.owns", "endpoint": "target" }
]
```

`sourceTypes` produces `endpoint: "source"` entries; `targetTypes` produces `endpoint: "target"` entries, matched to each schema's `properties.entityType.const`. An entity allowed at both endpoints gets both entries, including for symmetric types. Lists are sorted and rebuilt on every run; removed defaults disappear and entities without matching defaults receive `[]`. Invalid or duplicate IDs, invalid endpoint lists, and unknown endpoint types fail before schemas are written.

These generated annotations describe known default types, not an exhaustive runtime allowlist. They do not add fields to entity instances or validate relationships. RelationshipType objects remain the source of truth for labels and endpoint constraints; do not manually edit the annotations. Strict JSON Schema validators must register `x-ifs-relationships` as an annotation keyword.

The schema test helper registers IFS annotation keywords and uses `strictRequired: false` for open/composed schemas. A required property need not be defined in the same subschema; the suite no longer fails collection on `Change.effected`. Schema validation still enforces required values.
