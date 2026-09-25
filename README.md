# IFS

## What Is IFS?

IFS, the Individual Freedom System, is a governance model built on a simple but radical idea: power should never permanently leave the individual. Instead of surrendering authority to rulers, parties, institutions, or fixed election cycles, people delegate specific responsibilities to others only when they choose to—and they can limit, monitor, change, or revoke that delegation at any time.

## What Are IFS Standards?

IFS Standards are the technical and procedural blueprint for building systems based on IFS. They define the schemas, protocols, and rules for dynamic consent, authority delegation, shared decision-making, asset traceability, transparent resource flow, and modular governance. In short, if IFS is the philosophy, IFS Standards is the blueprint to implement a software system base on IFS.

## IFS: Governance Without Surrender

Most governance systems ask people to trade freedom for coordination. Monarchies concentrate power by inheritance, authoritarian systems centralize it by force, oligarchies capture it through elites, and even democracies often require people to hand authority away for years at a time. IFS begins from the opposite direction: sovereignty remains with the individual, and coordination happens through temporary, visible, and reversible delegation.

In an IFS system, decision power follows impact. If a choice affects only you, it belongs to you. If it affects a neighborhood, that neighborhood gains the voice. If it affects a wider region, participation scales to the people touched by the outcome. This keeps freedom from becoming isolation, and collective action from becoming domination. Authority is contextual, proportional, and continuously accountable.

IFS also turns transparency into a foundation rather than a promise. Delegated power, responsibilities, decisions, and resource flows must be visible and traceable, so people can understand how outcomes are produced and act when something fails. The result is a living governance system: one that can adapt in real time, assign stewardship without surrender, manage shared resources responsibly, and evolve as people learn, participate, and refine the rules that shape their lives.

## Prototype API and generated client

The Nest backend serves Swagger UI at `http://localhost:3000/docs` and its OpenAPI document at `/docs-json`.

Run from the repository root (Node.js 24 and the pinned pnpm version):

```bash
pnpm install
pnpm openapi:generate # Nest build -> prototype-api/openapi.json
pnpm client:generate  # Fresh OpenAPI export -> Orval -> prototype-client (JS + types)
```

`client:generate` includes `openapi:generate`. Neither generation command needs a running API or database connection. Import the client from `prototype-client` in `prototype`; see [client usage](prototype-client/README.md) and [backend documentation](prototype-api/README.md#swagger-and-openapi).

## Contribution Guide

### Commit Messages

Run `pnpm install` at the repository root after cloning to install dependencies and enable the Husky Git hooks.

Commits must follow [Conventional Commits](https://www.conventionalcommits.org/):

```text
type: description
type(scope): description
```

The type and description are required. Scope is optional, but when provided must be a workspace package name: `ifs-standards`, `prototype`, `prototype-api`, or `prototype-client`. Omit the scope for repository-wide changes. When adding or renaming a workspace package, update `scope-enum` in `commitlint.config.mjs` and this list.

Allowed types: `feat` (feature), `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`, and `agent`.

Examples:

```text
feat: add delegation support
fix(prototype-api): handle missing permissions
docs(ifs-standards): clarify consent rules
feat(prototype-api)!: change the delegation response format
```

The `commit-msg` hook rejects messages that do not match, including default merge/revert messages; give those commits a conventional message too. No extra subject-case or length restrictions are imposed.

Hooks run locally and can be bypassed with Git's `--no-verify`; they are not server-side enforcement.
