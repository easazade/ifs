/**
 * Dynamic route: useParams + presentational Tailwind classes (including inline `code`).
 */
import { Link, useParams } from 'react-router-dom';
import { getProtocolById } from '../data/protocols';
import { ROUTES } from '../routes';

const codeClass = 'rounded bg-surface-muted px-1.5 py-0.5 font-mono text-sm text-text';

export function ProtocolPage() {
  const { protocolId } = useParams<'protocolId'>();
  const protocol = getProtocolById(protocolId);

  if (!protocol) {
    return (
      <article className="max-w-2xl space-y-3 text-text">
        <h1 className="mt-0 text-2xl font-semibold tracking-tight text-text">Protocol not found</h1>
        <p className="leading-relaxed">No protocol matches “{protocolId}”.</p>
        <p>
          <Link to={ROUTES.WELCOME} className="font-medium text-primary underline-offset-4 hover:underline">
            Back home
          </Link>
        </p>
      </article>
    );
  }

  return (
    <article className="max-w-2xl space-y-4 text-text">
      <h1 className="mt-0 text-2xl font-semibold tracking-tight text-text">{protocol.title}</h1>
      <p className="leading-relaxed">
        This page is rendered for the dynamic route{' '}
        <code className={codeClass}>{`${ROUTES.PROTOCOL}/:protocolId`}</code>. The current{' '}
        <code className={codeClass}>protocolId</code> is <code className={codeClass}>{protocolId}</code>.
      </p>
    </article>
  );
}
