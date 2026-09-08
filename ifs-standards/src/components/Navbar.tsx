/**
 * Design-system based navbar with logo, nav links, and search.
 */
import { NavLink } from 'react-router-dom';
import { ROUTES } from '../routes';
import AnimatedLogo from './AnimatedLogo';

const navLinkClass = (isActive: boolean) =>
  [
    'text-sm font-medium transition-colors',
    isActive ? 'text-primary font-semibold' : 'text-text-secondary hover:text-text',
  ].join(' ');

const navLinks = [
  { label: 'Welcome', href: ROUTES.WELCOME },
  { label: 'About', href: ROUTES.ABOUT },
  { label: 'FAQ', href: ROUTES.FAQ },
];

export function Navbar() {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between border border-border bg-surface px-4 py-3">
      <div className="flex items-center gap-12">
        <NavLink to={ROUTES.WELCOME} end className="flex items-center gap-2">
          <AnimatedLogo dotColor={'bg-text'} />
          <span className="font-heading text-base font-family-heading font-semibold text-text">IFS Standards</span>
        </NavLink>
        <nav className="flex items-center gap-6" aria-label="Primary">
          {navLinks.map((link) => (
            <NavLink key={link.label} to={link.href} className={({ isActive }) => navLinkClass(isActive)}>
              {link.label}
            </NavLink>
          ))}
        </nav>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex w-[248px] items-center justify-between rounded-lg border border-border bg-surface-primary px-3 py-2">
          <div className="flex items-center gap-2">
            <svg
              className="h-3.5 w-3.5 text-text-secondary"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            <span className="text-sm text-text-secondary">Search docs...</span>
          </div>
          <span className="rounded-full bg-surface-secondary px-1.5 py-0.5 text-xs font-medium text-text-secondary">
            ⌘K
          </span>
        </div>
      </div>
    </header>
  );
}
