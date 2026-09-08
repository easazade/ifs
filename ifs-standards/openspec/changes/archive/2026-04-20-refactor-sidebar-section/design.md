## Context

`src/components/SidebarSection.jsx` currently mixes recursive rendering, per-item state, and custom prop validation in a way that makes the component longer and harder to scan than the behavior requires. The design-system library already contains a reusable `Sidebar-Section` pattern in `design/design-system.lib.pen` that establishes the intended hierarchy: muted section titles, stronger top-level items, lower-emphasis children, and a chevron affordance for expandable rows.

This change is confined to shared navigation UI in the React app. It needs to preserve the existing item data shape (`label`, `href`, optional `children`) and existing route behavior while improving structure and visual alignment. Because the sidebar can appear in constrained layouts, the implementation should work on both desktop and smaller widths without introducing fixed assumptions beyond the current flex-column layout.

## Goals / Non-Goals

**Goals:**

- Simplify `SidebarSection.jsx` so the recursive navigation flow is easier to understand and maintain.
- Make expandable rows render a right arrow when collapsed and a down arrow when expanded.
- Give child links a clearly secondary text treatment that matches the design-system hierarchy.
- Match the spacing, typography emphasis, and interaction cues from the reusable sidebar components in `design/design-system.lib.pen` using existing Tailwind token classes.
- Preserve current navigation link behavior and nested rendering semantics.

**Non-Goals:**

- Redesign the overall app shell in `src/layouts/MainLayout.jsx` or the protocol list in `src/components/Sidebar.jsx`.
- Change the sidebar item data contract or introduce persistent expand/collapse state.
- Modify design tokens or Pencil library assets unless implementation reveals that the current code cannot express the existing design-system values.

## Decisions

### 1. Keep the refactor inside `src/components/SidebarSection.jsx`

The component can be improved without introducing new modules or abstractions. A single focused file-level refactor keeps the public API stable and matches the repo preference for small changes.

Alternative considered: split validation, list rendering, and row rendering into separate files. Rejected because it would reduce locality more than it would reduce complexity for this component size.

### 2. Model the chevron as explicit state, not rotation of a down-only glyph

Expanded and collapsed states should map directly to the requested affordance: right arrow for collapsed, down arrow for expanded. Using explicit icons or paths for each state is clearer than relying on a rotated down chevron that reads ambiguously in code and in the UI.

Alternative considered: keep a single down-chevron SVG and rotate it. Rejected because the current behavior is already confusing and the user explicitly requested state-specific directions.
Also on hover color or background should not change.
Also child items should have their background color slightly darken when hovered over. chevron should not have a change on hover by itself

### 3. Use existing token-backed utility classes for hierarchy, not hardcoded styling

Top-level items should retain primary readability, while child rows should use the secondary text color already present in the design language. Styling should be expressed with existing Tailwind classes such as token-backed text and surface utilities so the React implementation stays aligned with `DESIGN.md` and the Pencil library.

Alternative considered: add one-off inline styles or new local classes. Rejected because the repo treats the Pencil design system and token classes as the source of truth.

### 4. Treat the Pencil sidebar component as a visual reference, not a new artifact to edit

The reusable `Sidebar` and `Sidebar-Section` nodes in `design/design-system.lib.pen` already describe the desired section title treatment, item spacing, and chevron usage. The implementation should match those patterns in code first. No `.pen` changes or `npm run tokens:code` sync are expected unless a token gap is discovered during implementation.

Alternative considered: update the Pencil file as part of this change. Rejected for now because the request is to bring code in line with the existing design component, not to redefine the design system.

## Risks / Trade-offs

- Shared navigation regressions in nested rendering or active states -> Verify with manual checks on representative sidebar content in addition to `npm run lint` and `npm run build`.
- Design matching may be approximate if the current codebase lacks a one-to-one token utility for every Pencil value -> Prefer the closest existing token-backed utility and only revisit tokens if a true mismatch remains.
- A more concise implementation may reduce some explicit prop-shape code -> Keep validation only where it still adds practical safety and remove repetition rather than removing guardrails blindly.

## Migration Plan

Implement the refactor in place in `src/components/SidebarSection.jsx`, validate with lint/build, and verify the sidebar manually in the existing app routes or preview page that renders nested sidebar items. Rollback is straightforward because the change is isolated to shared UI code and does not alter persisted data or external interfaces.

## Open Questions

- Whether the existing `text-text-secondary` utility is the correct match for nested child items, or whether another existing muted token class more closely matches the Pencil component.
  Answered: yes `text-text-secondary` is the correct match for nested child items.
- Whether callers want all sections expanded by default, or whether some groups should start collapsed in a future change. This change keeps the current default-expanded behavior unless implementation context indicates otherwise.
  Answered: Collapsed by default. unless clicked on toggle or current route is the route that parent item href points to
