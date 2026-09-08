/**
 * Grouped sidebar data mirrors the design-system hierarchy while reusing route helpers.
 */
import { PROTOCOLS } from '../data/protocols';
import { ROUTES } from '../routes';
import { SidebarSection } from './SidebarSection';
import type { SidebarSectionProps } from './SidebarSection';

const protocolItems = PROTOCOLS.map((protocol) => ({
  label: protocol.title,
  href: ROUTES.PROTOCOL_DETAIL(protocol.id),
}));

const firstProtocol = protocolItems[0];
const sidebarSections: SidebarSectionProps[] = [
  {
    title: 'Overview',
    items: [
      { label: 'Welcome', href: ROUTES.WELCOME },
      { label: 'How it works', href: ROUTES.HOW_IT_WORKS },
    ],
  },
  {
    title: 'System',
    items: firstProtocol
      ? [
          {
            label: 'Protocols',
            href: firstProtocol.href,
            children: protocolItems,
          },
        ]
      : [],
  },
].filter((section) => section.items.length > 0);

export function Sidebar() {
  return (
    <aside
      className="min-h-0 w-full shrink-0 overflow-y-auto border-e border-border bg-surface-secondary p-6 lg:w-64"
      aria-label="Sidebar navigation"
    >
      <div className="flex min-h-full flex-col gap-6">
        {sidebarSections.map((section) => (
          <SidebarSection key={section.title} title={section.title} items={section.items} />
        ))}
      </div>
    </aside>
  );
}
