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

## What Is IFS?

IFS, the Individual Freedom System, is a governance model built on a simple but radical idea: power should never permanently leave the individual. Instead of surrendering authority to rulers, parties, institutions, or fixed election cycles, people delegate specific responsibilities to others only when they choose to—and they can limit, monitor, change, or revoke that delegation at any time.

## What Are IFS Standards?

IFS Standards are the technical and procedural blueprint for building systems based on IFS. They define the schemas, protocols, and rules for dynamic consent, authority delegation, shared decision-making, asset traceability, transparent resource flow, and modular governance. In short, if IFS is the philosophy, IFS Standards is the blueprint to implement a software system base on IFS.

## IFS: Governance Without Surrender

Most governance systems ask people to trade freedom for coordination. Monarchies concentrate power by inheritance, authoritarian systems centralize it by force, oligarchies capture it through elites, and even democracies often require people to hand authority away for years at a time. IFS begins from the opposite direction: sovereignty remains with the individual, and coordination happens through temporary, visible, and reversible delegation.

In an IFS system, decision power follows impact. If a choice affects only you, it belongs to you. If it affects a neighborhood, that neighborhood gains the voice. If it affects a wider region, participation scales to the people touched by the outcome. This keeps freedom from becoming isolation, and collective action from becoming domination. Authority is contextual, proportional, and continuously accountable.

IFS also turns transparency into a foundation rather than a promise. Delegated power, responsibilities, decisions, and resource flows must be visible and traceable, so people can understand how outcomes are produced and act when something fails. The result is a living governance system: one that can adapt in real time, assign stewardship without surrender, manage shared resources responsibly, and evolve as people learn, participate, and refine the rules that shape their lives.
