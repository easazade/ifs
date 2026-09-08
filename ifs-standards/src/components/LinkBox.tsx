/**
 * Reusable card component for linking to pages. Accepts title, description, and optional icon.
 */
import { Link } from 'react-router-dom';

interface LinkBoxProps {
  title: string;
  description: string;
  href: string;
  iconGlyph?: string;
}

export function LinkBox({ title, description, href, iconGlyph = '↗' }: LinkBoxProps) {
  return (
    <Link
      to={href}
      className="group flex cursor-pointer flex-col gap-3 rounded-lg border-border border-1 bg-surface-secondary p-3 transition-colors hover:bg-surface-primary"
    >
      <div className="flex items-center gap-2">
        <span className="flex h-4.5 w-4.5 items-center justify-center rounded border border-divider-medium bg-background text-xs font-semibold text-text-muted">
          {iconGlyph}
        </span>
        <span className="text-sm font-semibold text-text">{title}</span>
      </div>
      <p className="text-sm leading-[1.4] text-text-secondary">{description}</p>
    </Link>
  );
}
