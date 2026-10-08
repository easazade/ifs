# IFS Standards

## Development

Requires Node.js 22.12+ (Node.js 24 LTS recommended) and npm.

```sh
npm ci
npm run dev
```

The application uses React, TypeScript, Vite, Tailwind CSS v4, and MDX.

| Command                          | Purpose                                                                                   |
| -------------------------------- | ----------------------------------------------------------------------------------------- |
| `npm run typecheck`              | Strict TypeScript checks for the app, generated entity types, scripts, configs, and tests |
| `npm run build`                  | Type-check, then create the production bundle in `dist/`                                  |
| `npm run lint`                   | ESLint with TypeScript and React rules                                                    |
| `npm test`                       | Run Vitest tests                                                                          |
| `npm run test:watch`             | Watch tests                                                                               |
| `npm run preview`                | Serve the production bundle locally                                                       |
| `npm run format`                 | Format source, tests, scripts, and TypeScript configs                                     |
| `npm run entities`               | Regenerate relationship annotations, entity order, direct relations, and overview         |
| `npm run entities:relationships` | Update schema-level relationship annotations from default RelationshipType objects        |
| `npm run entities:relations`     | Regenerate `scripts/entity-relations.json` from direct entity schema references           |
| `npm run tokens:code`            | Regenerate CSS from the existing design token library                                     |

Use `.tsx` for JSX components and `.ts` for other code. The app and Node tooling have separate TypeScript configs sharing `tsconfig.base.json`. See [NOTES.md](NOTES.md#typescript-workflow-and-null-safety) for TypeScript concepts and Flutter/Dart comparisons.

Entity interfaces in `src/entities/` are generated; update their JSON schemas rather than editing them by hand. TypeScript does not replace runtime schema validation.

### Relationship annotations

Run `pnpm --filter ifs-standards entities:relationships` from the repository root (also included in `entities`). The script reads `src/defaults/relationship-type/*.json` and updates the root `x-ifs-relationships` annotation in every entity schema:

```json
"x-ifs-relationships": [
  { "relationshipTypeId": "RelationshipType/ifs.owns", "endpoint": "target" }
]
```

`sourceTypes` produces `endpoint: "source"` entries; `targetTypes` produces `endpoint: "target"` entries, matched to each schema's `properties.entityType.const`. An entity allowed at both endpoints gets both entries, including for symmetric types. Lists are sorted and rebuilt on every run; removed defaults disappear and entities without matching defaults receive `[]`. Invalid or duplicate IDs, invalid endpoint lists, and unknown endpoint types fail before schemas are written.

These generated annotations describe known default types, not an exhaustive runtime allowlist. They do not add fields to entity instances or validate relationships. RelationshipType objects remain the source of truth for labels and endpoint constraints; do not manually edit the annotations. Strict JSON Schema validators must register `x-ifs-relationships` as an annotation keyword.

**Known test issue:** The existing entity-schema suite fails during collection because `change.schema.json` requires `effected` without defining that property. This predates the TypeScript migration; schema semantics are unchanged.
