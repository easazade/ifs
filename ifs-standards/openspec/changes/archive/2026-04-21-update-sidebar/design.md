## Context

The shared shell already has a design-system-backed `Navbar.jsx`, but `src/components/Sidebar.jsx` is still a flat protocol list with its own spacing and sizing, and `src/layouts/MainLayout.jsx` does not yet reflect the `MainLayout` composition shown in `design/design-system.lib.pen`. The relevant design references are the reusable `Sidebar`, `Sidebar-Section`, and `MainLayout` components in `design/design-system.lib.pen`, which show a bordered editorial shell with a fixed-width sidebar column, a separate content panel, and grouped sidebar navigation sections.

The implementation should stay within the current React/Vite/Tailwind stack, preserve existing route paths and `showSideBar` behavior in `src/App.jsx`, and reuse existing token-backed utility classes rather than introducing new visual conventions. No `.pen` or token updates are planned for this change, so `npm run tokens:code` is only needed if implementation discovers missing token output.

## Goals / Non-Goals

**Goals:**
- Make `Sidebar.jsx` visually and structurally match the design-system `Sidebar` component, including fixed width, surface treatment, border, padding, and section spacing.
- Rebuild the sidebar around grouped section data rendered through the existing `SidebarSection` React component.
- Update `MainLayout.jsx` so the shell composition matches the design-system `MainLayout` pattern: navbar on top, sidebar beside a distinct content panel, and predictable overflow behavior.
- Define responsive behavior so the shell remains usable on small screens even though the Pencil design is desktop-first.

**Non-Goals:**
- Redesigning `Navbar.jsx` beyond any wrapper/layout adjustments needed to fit the shell.
- Adding new routes, changing route paths, or changing protocol page content.
- Editing `design/design-system.lib.pen` or introducing new tokens/colors for this change.

## Decisions

### 1. Sidebar data will move from a flat list to explicit section groups
`Sidebar.jsx` will stop mapping `PROTOCOLS` directly into a single list and will instead build an array of sidebar sections whose shape matches `SidebarSection` props. This keeps section structure declarative, lets implementation mirror the `Sidebar-Section` design grouping, and avoids hardcoding repeated JSX blocks.

Alternative considered: keep the existing flat list and restyle it to look closer to the design. Rejected because the design clearly expresses grouped navigation and the user explicitly asked to use `SidebarSection`.

### 2. Desktop sizing will follow the design component, while mobile will stack instead of forcing a cramped fixed sidebar
On desktop, the sidebar should use the design-derived fixed width and 24px internal spacing so the proportions match the Pencil component. On smaller screens, `MainLayout.jsx` should switch the body from side-by-side to stacked so the sidebar becomes a full-width section above the main content instead of shrinking below usable size.

Alternative considered: keep the sidebar fixed-width at all breakpoints with horizontal overflow. Rejected because it harms mobile usability and does not fit the repo rule to ensure the page loads properly on desktop and mobile.

### 3. Main layout will separate shell chrome from content panel chrome
`MainLayout.jsx` will keep the top-level full-height app shell, but the body wrapper will explicitly model two visual regions from the design: the sidebar surface and the main content surface. The `main` area should become a bordered/clipped panel with its own padding so the route content reads as a separate panel beside the sidebar instead of an undifferentiated page background.

Alternative considered: only restyle `Sidebar.jsx` and leave `MainLayout.jsx` structurally unchanged. Rejected because the design-system `MainLayout` includes both sidebar and content-panel composition, and the user requested both components to match the design.

### 4. Existing `showSideBar` route gating remains the controlling behavior
Routes that currently pass `showSideBar={false}` will continue to render the layout without the sidebar. The updated `MainLayout.jsx` should apply shell styles conditionally so pages without a sidebar still render correctly without an empty reserved column.

Alternative considered: always render the sidebar container and hide only the content. Rejected because it would change current route behavior and create empty layout artifacts on pages that intentionally omit sidebar navigation.

## Risks / Trade-offs

- [Grouped sidebar data drifts from route definitions] -> Keep section data colocated with existing route helpers and derive protocol links from `ROUTES` and `PROTOCOLS` rather than duplicating path strings.
- [Desktop design fidelity conflicts with mobile constraints] -> Treat the Pencil component as the desktop source of truth and define an explicit stacked mobile layout instead of trying to preserve every desktop proportion at all widths.
- [New shell chrome affects page overflow or nested route layouts] -> Preserve the current `h-full`, `min-h-0`, and scroll-container pattern while moving borders, padding, and backgrounds to the correct shell regions.
- [SidebarSection styling may still differ from the exact Pencil component] -> Limit `Sidebar.jsx` to composition and sizing changes, then adjust `SidebarSection.jsx` only where the existing component cannot satisfy the documented design requirements.

## Migration Plan

1. Update the shared sidebar data structure and rebuild `Sidebar.jsx` around `SidebarSection`.
2. Adjust `SidebarSection.jsx` only as needed to match design-system spacing, typography, and expand/collapse treatment.
3. Update `MainLayout.jsx` shell wrappers and responsive behavior to match the `MainLayout` composition.
4. Verify protocol routes with and without sidebar, then run `npm run lint` and `npm run build`.
5. Roll back by restoring the previous sidebar/layout components if the shared shell regresses.

## Open Questions

- Whether the new grouped sidebar should include only protocol-driven content for now or also include static sections that mirror the broader design example naming.
- Whether any route content pages need minor spacing adjustments after the content panel chrome is introduced.
