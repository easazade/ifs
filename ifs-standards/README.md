# IFS Standards

## Development

Requires Node.js 22.12+ (Node.js 24 LTS recommended) and npm.

```sh
npm ci
npm run dev
```

The application uses React, TypeScript, Vite, Tailwind CSS v4, and MDX.

| Command               | Purpose                                                                                   |
| --------------------- | ----------------------------------------------------------------------------------------- |
| `npm run typecheck`   | Strict TypeScript checks for the app, generated entity types, scripts, configs, and tests |
| `npm run build`       | Type-check, then create the production bundle in `dist/`                                  |
| `npm run lint`        | ESLint with TypeScript and React rules                                                    |
| `npm test`            | Run Vitest tests                                                                          |
| `npm run test:watch`  | Watch tests                                                                               |
| `npm run preview`     | Serve the production bundle locally                                                       |
| `npm run format`      | Format source, tests, scripts, and TypeScript configs                                     |
| `npm run entities`    | Regenerate entity overview, TypeScript interfaces, and examples                           |
| `npm run tokens:code` | Regenerate CSS from the existing design token library                                     |

Use `.tsx` for JSX components and `.ts` for other code. The app and Node tooling have separate TypeScript configs sharing `tsconfig.base.json`. See [NOTES.md](NOTES.md#typescript-workflow-and-null-safety) for TypeScript concepts and Flutter/Dart comparisons.

Entity interfaces in `src/entities/` are generated; update their JSON schemas rather than editing them by hand. TypeScript does not replace runtime schema validation.

**Known test issue:** The existing entity-schema suite fails during collection because `change.schema.json` requires `effected` without defining that property. This predates the TypeScript migration; schema semantics are unchanged.
