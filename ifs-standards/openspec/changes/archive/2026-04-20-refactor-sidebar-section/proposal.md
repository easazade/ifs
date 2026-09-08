## Why

The current sidebar section component is harder to maintain than it needs to be: recursive rendering and prop validation are spread across several small helpers, the child toggle affordance does not match the requested collapsed/expanded direction, and nested items do not carry a clearly secondary visual treatment. This is a good time to tighten the component because the sidebar is shared navigation UI and the design system already defines a clearer `Sidebar-Section` pattern to align against.

## What Changes

- Refactor the sidebar section implementation to remove avoidable boilerplate and make the recursive navigation structure easier to read and maintain.
- Update the child-list toggle affordance so collapsed groups show a right arrow and expanded groups show a down arrow.
- Apply a lower-emphasis text treatment to child items so nested navigation is visually subordinate to parent items.
- Align the rendered sidebar section structure and styling with the reusable sidebar patterns defined in `design/design-system.lib.pen`.
- Preserve existing navigation behavior for links and nested groups while improving readability and design consistency.

## Capabilities

### New Capabilities
- `sidebar-navigation`: Defines the expected structure, hierarchy, and expand/collapse behavior of shared sidebar navigation components.

### Modified Capabilities
- None.

## Impact

- Affected code: `src/components/SidebarSection.jsx` and any callers that render nested sidebar items.
- Affected design sources: `design/design-system.lib.pen` as the reference for sidebar section styling and hierarchy.
- No API or routing contract changes are expected.
- Non-goals: redesigning unrelated layout chrome, changing protocol data shape, or introducing a broader navigation state system.
- Risk is limited to shared navigation presentation and interaction, so implementation should be verified with lint/build and manual sidebar checks.
