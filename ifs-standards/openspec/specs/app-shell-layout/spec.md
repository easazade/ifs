## ADDED Requirements

### Requirement: Shared app shell SHALL separate navigation chrome from content chrome
The shared application layout MUST render a top navigation bar and a body region that visually separates the optional sidebar surface from the main content panel, following the `MainLayout` design component in `design/design-system.lib.pen`. The main content panel MUST remain the primary flexible region within the full-height shell.

#### Scenario: Sidebar route renders distinct shell regions
- **WHEN** a route renders with the shared layout and sidebar enabled
- **THEN** the navbar, sidebar surface, and main content panel MUST appear as distinct shell regions rather than a single undifferentiated page area

### Requirement: Shared app shell SHALL avoid empty sidebar columns on routes that disable sidebar navigation
Routes that disable sidebar navigation MUST render the shared layout without reserving an empty sidebar column, while preserving the top navbar and main content panel treatment.

#### Scenario: Non-sidebar route uses full content width
- **WHEN** a route renders with sidebar navigation disabled
- **THEN** the shared layout MUST not leave an empty sidebar-width gap before the main content area

### Requirement: Shared app shell SHALL adapt sidebar placement for narrow screens
On narrow screens, the shared layout MUST stack the sidebar above the content panel instead of forcing the desktop two-column shell into a cramped layout.

#### Scenario: Narrow screen stacks sidebar and content
- **WHEN** the shared layout renders on a narrow screen with sidebar navigation enabled
- **THEN** the sidebar MUST appear above the content panel and remain readable without shrinking below usable width
