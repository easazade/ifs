# AGENTS.md

## About IFS (Individual Freedom System)

**System Philosophy:** The IFS is a "Servant-Architecture" for governance. It operates on the principle that sovereignty is non-transferable. Power resides permanently with the individual and is only temporarily delegated to roles or entities.

**Dynamic Role Delegation:** Unlike static elected terms, IFS enables Real-time Authority Revocation. Users do not "elect" leaders; they assign specific responsibilities to "Stewards" whose permissions can be modified or terminated instantly by the affected collective.

**Proportional Governance (The Scope Rule):** Decision-making power is strictly limited to the affected radius. If a decision impacts a town, only that town's participants possess the voting keys. If it impacts a nation, the keys scale accordingly.

**Radical Transparency & Fiscal Agency:** Every resource flow is indexed and public. "Taxation" is replaced by Direct Resource Allocation—users do not pay into a black box; they programmatically direct their contributions to specific services and can audit every transaction in real-time.

## About This Project:

This repository is a pnpm/Turborepo monorepo. These instructions apply across the repository; follow any additional package-local instructions when present. All paths below are relative to the monorepo root, unless explicitly stated otherwise.

- `ifs-standards/`: IFS schemas, protocols, documentation, and the standards website. Defines rules for Dynamic Consent, Asset Traceability, and Modular Rule-Setting used to implement IFS software.
- `prototype/`: prototype frontend.
- `prototype-api/`: NestJS backend with Prisma and SQLite.
- `prototype-client/`: shared OpenAPI-generated client (`@ifs/prototype-client`).
- `.pi/prompts/`: repository-wide Pi prompt templates.

## Source of truth

- UI rules live in `DESIGN.md`
- Standards design files remain in `ifs-standards/design/` as .pen files created by pencil.dev. Modify them through Pencil MCP following root `DESIGN.md` guidelines.
- Entity definitions live in `ifs-standards/src/entities/**/*.schema.json`; generate derived artifacts from schemas, not the reverse.

## Commands

Run commands from the monorepo root using the pinned pnpm version.

- `pnpm dev`, `pnpm build`, `pnpm lint`, `pnpm test`, `pnpm format` - Run workspace tasks through Turbo.
- `pnpm --filter <package-name> <script>` - Run a package-specific script; check its `package.json` first.
- `pnpm --filter ifs-standards dev` - Start the standards Vite dev server.
- `pnpm --filter ifs-standards build` - Type-check and build to `ifs-standards/dist/`.
- `pnpm --filter ifs-standards typecheck` - Check standards app, scripts, configs, and tests.
- `pnpm --filter ifs-standards test` - Run standards Vitest tests.
- `pnpm --filter ifs-standards preview` - Serve the standards production build.
- `pnpm --filter ifs-standards tokens:code` - Generate `ifs-standards/src/index.css` from `ifs-standards/design/design-system.lib.pen`.
- `pnpm --filter ifs-standards entities` - Regenerate derived standards entity artifacts.
- `pnpm openapi:generate` - Generate the backend OpenAPI document.
- `pnpm client:generate` - Regenerate OpenAPI and the shared API client.

## IFS Standards Key Files

- **Entry**: `ifs-standards/src/main.tsx` - React app with BrowserRouter
- **Routes**: `ifs-standards/src/routes.ts` - Route definitions
- **Data**: `ifs-standards/src/data/protocols.ts` - Protocol data source
- **Layout**: `ifs-standards/src/layouts/MainLayout.tsx` - Navbar + Sidebar wrapper
- **TypeScript**: `ifs-standards/tsconfig.app.json` and `ifs-standards/tsconfig.node.json` share `ifs-standards/tsconfig.base.json`

## IFS Standards Notes

- Tailwind v4 uses `@tailwindcss/vite` plugin (not the old postcss approach)
- GSAP animations via `@gsap/react` hook
- Standards Vitest tests live in `ifs-standards/tests/`; consult `ifs-standards/README.md` and current test results for known failures.
- Use `.tsx` for JSX components and `.ts` for other code; run generators through `tsx`

## Rules (IMPORTANT)

### Read Rules First

- At start of each conversation, read AGENTS.md.
- Identify rules with `alwaysApply: true` — these MUST be followed.
- Identify rules with `alwaysApply: false` — follow intelligently if rule applies to task.
- alwaysApply: true

### React/JS Learning (Intelligent)

- Teach React & Advanced JS.
- For standards learning notes, update `ifs-standards/NOTES.md`: Include TOC with links, sections for new concepts.
- Coding: Add short comments above new concepts/types.
- Reference: Use Flutter/Dart analogies.
- Discretion: Decide if `NOTES.md` entry, code comment, or both is required.
- alwaysApply: false

### Trace & Report

- End every response with:

```
## Trace
- Rules used:
- Skills/Tools:
- Assumptions:
- (Use "unknown" if unsure; keep concise)
- alwaysApply: true
```

### Optimization

- Use caveman skill: Shorten prompts, minimize context/cost unless forbidden.
- alwaysApply: true

### AI Agent Memory

- Agents may use root `ai-agent-memory/` for context between runs and sessions; create it when needed.
- AI agents have complete autonomy to read/write/edit/delete the files in that directory.
- The purpose of these files is to improve agent efficiency.
- Code remains the source of truth; memory files may be outdated.
- alwaysApply: true


### Design & Pencil MCP

- Use root `DESIGN.md` for design tasks, including `.pen` files in `ifs-standards/design/`.
- pencil mcp: main design tool to read/write/change .pen design files.
- For all .pen related tasks first check if pencil mcp is responsive. if pencil mcp cannot be reached MUST cancel agent run and tell user.
- .pen rules: No helper files/scripts/temp artifacts. No retries via scripts.
- .lib.pen files are shared Pencil libraries that must be imported into all .pen files in `ifs-standards/design/`.
- Colors: Use HEX only. No RGBA.
- Standards Design Tokens & Components: Source of truth is `ifs-standards/design/design-system.lib.pen`.
- Run `pnpm --filter ifs-standards tokens:code` from root to regenerate `ifs-standards/src/index.css` from design tokens.
- If content's height requires increasing the height of parent item or frame, do it.
- Design to Code: only tailwind inline css classes (existing classes), Use defined variables, no hardcoding
- alwaysApply: false
