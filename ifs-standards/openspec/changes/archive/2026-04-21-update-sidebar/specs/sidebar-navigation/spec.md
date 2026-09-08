## MODIFIED Requirements

### Requirement: Sidebar sections SHALL follow the shared design-system pattern
The shared React sidebar implementation MUST align with the reusable `Sidebar` and `Sidebar-Section` patterns defined in `design/design-system.lib.pen` for the root sidebar container, section title treatment, item spacing, hierarchy, and expand/collapse cues. The sidebar root MUST preserve the design-system fixed-width desktop presentation with token-backed surface and border treatment, and MUST remain readable in the responsive stacked layout used by the shared app shell on smaller screens.

#### Scenario: Desktop sidebar follows design-system structure
- **WHEN** the sidebar is rendered in the application on desktop-sized viewports
- **THEN** its container sizing, surface, border, section headings, item hierarchy, and expandable row affordances MUST match the established design-system pattern without introducing unrelated visual conventions

#### Scenario: Responsive layout preserves sidebar hierarchy
- **WHEN** the shared layout stacks the sidebar above content on smaller screens
- **THEN** the same section headings, item order, and expandable navigation behavior MUST remain available without compressing the sidebar below usable width

## ADDED Requirements

### Requirement: Sidebar navigation SHALL be organized into shared sections
The sidebar MUST render named navigation sections through the shared `SidebarSection` presentation so navigational links are grouped under section headings rather than appearing as a single unsectioned list.

#### Scenario: Sidebar renders grouped navigation sections
- **WHEN** the sidebar is shown in the application
- **THEN** users MUST see one or more labeled navigation sections that group related links under shared section headings
