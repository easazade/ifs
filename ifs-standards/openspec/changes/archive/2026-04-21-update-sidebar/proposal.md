## Why

The current `Sidebar.jsx` is a simple protocol list that does not match the shared `Sidebar` and `MainLayout` components defined in `design/design-system.lib.pen`, so the app shell diverges from the project's design source of truth. This change aligns the React shell with the design system now that `SidebarSection` already exists and can be used to implement the intended grouped navigation pattern.

## What Changes

- Replace the current React sidebar implementation with a design-matched sidebar structure based on the reusable `Sidebar` component in `design/design-system.lib.pen`.
- Update the shared `MainLayout.jsx` shell so the navbar, sidebar column, and content panel sizing match the `MainLayout` design component more closely.
- Use the existing `SidebarSection` React component to render sidebar groups instead of the current single flat protocol list.
- Define the navigation data and layout expectations needed to keep the sidebar design-consistent while preserving current route behavior.
- Exclude unrelated route additions, protocol-content changes, or design-token changes unless implementation reveals a missing dependency.

## Capabilities

### New Capabilities
- `app-shell-layout`: Define the required structure, sizing, and content-panel behavior for the shared app shell so React layout matches the design-system `MainLayout` component.

### Modified Capabilities
- `sidebar-navigation`: Update sidebar requirements so the shared React sidebar matches the design-system `Sidebar` component, including grouped sections, spacing, and shell sizing expectations.

## Impact

- Affected code: `src/components/Sidebar.jsx`, `src/components/SidebarSection.jsx`, `src/layouts/MainLayout.jsx`, and any colocated navigation data helpers introduced for the new grouped sidebar structure.
- Affected design references: `design/design-system.lib.pen` `Sidebar`, `Sidebar-Section`, and `MainLayout` reusable components.
- No API, routing contract, or persisted data migrations are expected; route paths should remain unchanged.
- Main risk is regressions in the shared application shell, especially sidebar width, content overflow, and visual mismatch across routes where `showSideBar` is toggled.
- Rollback is straightforward because the change is limited to shared layout and navigation presentation.
