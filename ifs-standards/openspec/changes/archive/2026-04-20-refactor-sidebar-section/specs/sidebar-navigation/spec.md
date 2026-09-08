## ADDED Requirements

### Requirement: Sidebar sections SHALL present a clear navigation hierarchy
Shared sidebar sections MUST visually distinguish section headings, top-level items, and nested child items so users can scan the structure quickly. Child items MUST use a lower-emphasis text treatment than their parent items while remaining readable and interactive.

#### Scenario: Nested items render with secondary emphasis
- **WHEN** a sidebar section renders an item with child links
- **THEN** the parent row MUST keep the primary navigation emphasis and each child row MUST render with a visibly secondary text style

### Requirement: Expandable sidebar rows SHALL expose explicit collapsed and expanded affordances
Any sidebar item with children MUST expose a toggle control that reflects its current state. The control MUST show a right arrow when the child list is collapsed and a down arrow when the child list is expanded.

#### Scenario: Collapsed group shows right arrow
- **WHEN** a sidebar item with children is collapsed
- **THEN** its toggle control MUST display a right-pointing arrow and the child list MUST not be shown

#### Scenario: Expanded group shows down arrow
- **WHEN** a sidebar item with children is expanded
- **THEN** its toggle control MUST display a downward-pointing arrow and the child list MUST be shown

### Requirement: Sidebar sections SHALL follow the shared design-system pattern
The React sidebar section implementation MUST align with the reusable `Sidebar-Section` pattern defined in `design/design-system.lib.pen` for section title treatment, item spacing, hierarchy, and expand/collapse cues unless the codebase lacks a matching existing token-backed style.

#### Scenario: Code implementation follows design-system structure
- **WHEN** the sidebar section is rendered in the application
- **THEN** its heading, item hierarchy, and expandable row affordances MUST match the established design-system pattern without introducing unrelated visual conventions
