import { useId, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import type { NavLinkRenderProps } from 'react-router-dom';

// Recursive props describe every nesting level, like a Dart model with List<SidebarItem> children.
export interface SidebarItem {
  label: string;
  href: string;
  children?: SidebarItem[];
}

export interface SidebarSectionProps {
  title: string;
  items: SidebarItem[];
  className?: string;
}

interface SidebarSectionItemsProps {
  items: SidebarItem[];
  nested?: boolean;
}

interface SidebarSectionItemProps {
  item: SidebarItem;
  nested: boolean;
}

const applyClasses = (...classes: (string | false | undefined)[]) => classes.filter(Boolean).join(' ');

function itemContainsPath(item: SidebarItem, pathname: string): boolean {
  return item.href === pathname || (item.children?.some((child) => itemContainsPath(child, pathname)) ?? false);
}

function SidebarChevron({ expanded }: { expanded: boolean }) {
  return (
    <svg
      className={applyClasses('h-3.5 w-3.5 transition-transform duration-150', expanded && 'rotate-90')}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="9 6 15 12 9 18" />
    </svg>
  );
}

function SidebarSectionItems({ items, nested = false }: SidebarSectionItemsProps) {
  return (
    <ul className={applyClasses('m-0 flex list-none flex-col p-0', nested && 'pl-4')}>
      {items.map((item) => (
        <li key={`${item.href}-${item.label}`} className="bg-transparent">
          <SidebarSectionItem item={item} nested={nested} />
        </li>
      ))}
    </ul>
  );
}

function SidebarSectionItem({ item, nested }: SidebarSectionItemProps) {
  const { pathname } = useLocation();
  const children = item.children ?? [];
  const hasChildren = children.length > 0;
  const hasActiveDescendant = children.some((child) => itemContainsPath(child, pathname));
  const [isExpanded, setIsExpanded] = useState(pathname === item.href || hasActiveDescendant);

  const linkClassName = ({ isActive }: NavLinkRenderProps) =>
    applyClasses(
      'block flex-1 rounded-md px-2 py-1 text-base leading-6 transition-colors hover:bg-surface-primary hover:text-text',
      nested ? 'text-text-secondary' : 'text-text',
      isActive && 'font-medium text-primary underline',
      hasActiveDescendant && !isActive && 'font-medium text-text underline'
    );

  return (
    <div className="flex flex-col gap-1 bg-transparent">
      <div className="flex items-center justify-between gap-3">
        <NavLink to={item.href} className={linkClassName}>
          {item.label}
        </NavLink>
        {hasChildren && (
          <button
            type="button"
            className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-text-muted transition-colors hover:bg-surface-primary hover:text-text"
            aria-expanded={isExpanded}
            aria-label={`${isExpanded ? 'Collapse' : 'Expand'} ${item.label}`}
            onClick={() => setIsExpanded((prev) => !prev)}
          >
            <SidebarChevron expanded={isExpanded} />
          </button>
        )}
      </div>
      {hasChildren && isExpanded && <SidebarSectionItems items={children} nested />}
    </div>
  );
}

export function SidebarSection({ title, items, className = '' }: SidebarSectionProps) {
  const headingId = useId();
  return (
    <section
      aria-labelledby={headingId}
      className={applyClasses('flex w-full flex-col gap-2 bg-transparent', className)}
    >
      <h2 id={headingId} className="px-2 text-sm font-medium text-text-secondary">
        {title}
      </h2>
      <SidebarSectionItems items={items} />
    </section>
  );
}
