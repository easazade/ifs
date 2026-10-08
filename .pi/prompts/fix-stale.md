---
description: Fix stale predefined defaults, fake IFS objects, and maintained documentation
argument-hint: "[instructions or change context]"
---
Find and fix missed updates caused by changes elsewhere in this repository.

Additional user instructions/context: ${ARGUMENTS:-No additional context; review all areas listed below against current sources of truth.}

## Scope

Review only these three areas. Do not expand into a general code audit, dependency upgrade, or unrelated refactor:

1. **Default predefined objects** in `ifs-standards/src/defaults/`, including any other maintained predefined-object locations identified by project guidance. This applies to every kind of default object, not just relationship types.
2. **Fake IFS objects** throughout `prototype-puppeteer/src/fake/ifs/`, recursively.
3. **Manually maintained documentation**, especially root `AGENTS.md`, `README.md`, and `DESIGN.md`, plus relevant maintained documentation across workspaces.

## Establish what is maintained versus generated

- Read repository guidance and any nearer `AGENTS.md`. Preserve existing user changes; inspect git status before editing.
- Use canonical `ifs-standards/src/entities/**/*.schema.json` and current maintained implementation/configuration as sources of truth. Recent changes and supplied context help locate missed updates, but do not replace checking current contracts.
- First take a targeted look at every workspace's `scripts/` folder where present, its `package.json` commands, and generation configuration outside those folders. Identify generator inputs, outputs, prerequisites, and side effects. Reconfirm these mappings rather than assuming the following examples remain exhaustive:
  - Standards scripts generate entity ordering, relation metadata, entity overview, and CSS from schemas/design tokens.
  - API scripts generate DTOs, resources, resource registration, and entity table mappings; OpenAPI export is also generated.
  - The client uses Orval to generate its API client from OpenAPI.
  - Puppeteer scripts generate `src/game/api.ts` and `src/fake/personalities.ts`; the latter is outside this prompt's fake IFS scope.
- **Do not manually audit or hand-edit generated output.** Skip generated interfaces, DTOs/resources, OpenAPI/client source, relation/order metadata, overview/example output, generated CSS, and build output. A file being documentation does not make it manually maintained.
- Use generator ownership, not just filenames or comments, to determine exclusions. Avoid loading large generated files; establish ownership from scripts/configuration and targeted metadata.
- If an in-scope fix needs generated dependencies refreshed, use the relevant existing generation command after inspecting its effects. Do not regenerate unrelated artifacts or overwrite user edits. If generation is unsafe or blocked, report the required command instead. Do not broaden the task into repairing generators or unrelated implementation.

## 1. Default predefined objects

- Discover all default object categories; do not hard-code the review to relationship types.
- Compare maintained objects against their current entity schemas: fields, required values, types, enums, formats/patterns, identity conventions, and references.
- Also review semantic coverage: an object can still validate while containing outdated assumptions about which entities or concepts it applies to.
- Example: when an entity is introduced or changed, reassess each default RelationshipType's `sourceTypes` and `targetTypes`. Some new entities may legitimately belong in those lists. Do not add every entity automatically; use the relationship's meaning and canonical standards. Fix clearly justified omissions, and flag domain choices that need the user's decision.
- Apply the same reasoning to future predefined object kinds: revisit their applicability, allowed values, and references when the underlying concepts change.
- Do not invent new defaults or domain policy merely to achieve apparent completeness.

## 2. Fake IFS objects

- Always review `prototype-puppeteer/src/fake/ifs/`, including nested directories, even when the supplied context concerns another in-scope area.
- Check objects against current canonical schemas and create-payload conventions: added/removed/renamed fields, requiredness, value types, enums, `entityType`, ID/reference formats, patterns, and cross-object references.
- Do not rely on TypeScript alone: patterns and other schema constraints may not be represented in generated types.
- Preserve each object's intended meaning and realistic data. Follow the existing `.pi/prompts/fake.md` conventions where consistent with current canonical standards; flag contradictions rather than silently choosing stale guidance.
- Update existing references together when identity conventions change. Do not invent missing referenced objects or arbitrary domain values to silence failures; report unresolved references or decisions for the user.
- Prefer existing validation commands. `pnpm --filter prototype-puppeteer fake:check` checks fixture references, not full schema validity; confirm its current behavior and do not treat passing it as proof that every field conforms to standards.

## 3. Maintained documentation

- Check root `AGENTS.md`, `README.md`, and `DESIGN.md` for stale descriptions, paths, commands, architecture, sources of truth, generation ownership, and conventions. Review relevant maintained workspace documentation for the same missed updates.
- Verify factual claims against current source/configuration and scripts, not generated files or other potentially stale prose.
- Fix clear factual drift. Do not rewrite unrelated prose or turn speculative design choices into requirements.
- Treat `draft-docs/` as noncanonical proposals. Do not create or update discussion drafts without explicit approval, and do not use drafts to override implemented contracts.

## Fixing and verification

- Make small, evidence-backed fixes within the three areas above. Leave canonical schemas and unrelated implementation untouched unless the user explicitly requests a wider scope.
- If the intended correction is ambiguous, needs a policy decision, conflicts with user changes, or requires work outside scope, leave that correction unresolved and tell the user exactly what they need to fix or decide.
- Run the smallest relevant existing checks for changed files; confirm scripts exist before invoking them. Report failed or unavailable checks honestly. Do not claim exhaustive schema validation from a build or reference check alone.
- Never reset/migrate databases, insert seed data, change secrets, or commit as part of this prompt. Database scripts may be inspected to understand ownership, not executed to fix repository staleness.

## Final report

Keep the report concise:
- **Fixed:** file paths and the stale assumptions corrected.
- **Verified:** checks run and their results, plus any verification gaps or skipped areas.
- **User action required:** every unresolved issue, with its file location, why it could not be fixed, and the specific correction or decision needed. Never silently omit an unfixable issue.

Make unresolved warnings conspicuous. Use red text or a red background only if the output surface supports it; do not assume raw ANSI or HTML will render in Pi chat. Otherwise use **🔴 USER ACTION REQUIRED** as a reliable visible fallback. Do not claim the text is actually red when styling is unavailable.
