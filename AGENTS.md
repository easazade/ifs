# AGENTS.md

## About IFS (Individual Freedom System)

**System Philosophy:** The IFS is a "Servant-Architecture" for governance. It operates on the principle that sovereignty is non-transferable. Power resides permanently with the individual and is only temporarily delegated to roles or entities.

**Dynamic Role Delegation:** Unlike static elected terms, IFS enables Real-time Authority Revocation. Users do not "elect" leaders; they assign specific responsibilities to "Stewards" whose permissions can be modified or terminated instantly by the affected collective.

**Proportional Governance (The Scope Rule):** Decision-making power is strictly limited to the affected radius. If a decision impacts a town, only that town's participants possess the voting keys. If it impacts a nation, the keys scale accordingly.

**Radical Transparency & Fiscal Agency:** Every resource flow is indexed and public. "Taxation" is replaced by Direct Resource Allocation—users do not pay into a black box; they programmatically direct their contributions to specific services and can audit every transaction in real-time.

## About This Project:

**IFS Standards:** This repository defines schemas, protocols, rules for Dynamic Consent, Asset Traceability, and Modular Rule-Setting, providing the protocols to instantiate a friction-less, transparent society. These Standards can be used and followed to implement a software system.

## Source of truth

- UI rules live in `DESIGN.md`
- Design files live in `design/` as .pen files created by pencil.dev which is a design as code tool. design files can be modified via pencil mcp by agents they must follow `DESIGN.md` guidelines

## Commands

- `npm run dev` - Start Vite dev server
- `npm run build` - Type-check, then production build to `dist/`
- `npm run typecheck` - Strict TypeScript checks for app, scripts, configs, and tests
- `npm test` - Run Vitest tests
- `npm run preview` - Serve production build locally
- `npm run lint` - Run ESLint
- `npm run format` - Format with Prettier
- `npm run tokens:code` - Generates `src/index.css` from converts design tokens defined in design-system.lib.pen

## Key Files

- **Entry**: `src/main.tsx` - React app with BrowserRouter
- **Routes**: `src/routes.ts` - Route definitions
- **Data**: `src/data/protocols.ts` - Protocol data source
- **Layout**: `src/layouts/MainLayout.tsx` - Navbar + Sidebar wrapper
- **TypeScript**: `tsconfig.app.json` and `tsconfig.node.json` share `tsconfig.base.json`

## Notes

- Tailwind v4 uses `@tailwindcss/vite` plugin (not the old postcss approach)
- GSAP animations via `@gsap/react` hook
- Vitest tests live in `tests/`; see README.md for the pre-existing entity-schema collection failure
- Use `.tsx` for JSX components and `.ts` for other code; run generators through `tsx`

## Rules (IMPORTANT)

### Read Rules First

- At start of each conversation, read AGENTS.md.
- Identify rules with `alwaysApply: true` — these MUST be followed.
- Identify rules with `alwaysApply: false` — follow intelligently if rule applies to task.
- alwaysApply: true

### React/JS Learning (Intelligent)

- Teach React & Advanced JS.
- Update `NOTES.md`: Include TOC with links, sections for new concepts.
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

- There is a directory called `ai-agent-memory/`. this directory can be used by ai agents to put any memory or context 
they need to remember between runs and can be accessed during runs and sessions.
- AI agents have complete autonomy to read/write/edit/delete the files in that directory.
- The purpose of the files in these directory is to give AI a solution to help itself to be more efficient
alwaysApply: true


### Design & Pencil MCP

- Use `DESIGN.md` for all tasks in `design/` (e.g., .pen files).
- pencil mcp: main design tool to read/write/change .pen design files.
- For all .pen related tasks first check if pencil mcp is responsive. if pencil mcp cannot be reached MUST cancel agent run and tell user.
- .pen rules: No helper files/scripts/temp artifacts. No retries via scripts.
- .lib.pen files are shared pencil libraries that must be imported into all .pen files in the design/ dir
- Colors: Use HEX only. No RGBA.
- Design Tokens & Components: Source of truth is `design-system.lib.pen`
- run `npm run tokens:code` to regenerate index.css base on design tokens
- If content's height requires increasing the height of parent item or frame, do it.
- Design to Code: only tailwind inline css classes (existing classes), Use defined variables, no hardcoding
- alwaysApply: false
