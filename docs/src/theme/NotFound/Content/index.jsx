import React from 'react';
import Link from '@docusaurus/Link';
import Translate from '@docusaurus/Translate';

const LINKS = [
  { label: 'Foundations', href: '/foundations/colors', icon: 'palette' },
  { label: 'Primitives', href: '/primitives/icons', icon: 'layers' },
  { label: 'Components', href: '/shadcn/button', icon: 'widgets' },
  { label: 'Patterns', href: '/patterns/feed', icon: 'dashboard' },
];

export default function NotFoundContent() {
  return (
    <div
      style={{
        maxWidth: '480px',
        margin: '0 auto',
        padding: '80px 24px 64px',
        textAlign: 'center',
      }}
    >
      <div
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '11px',
          fontWeight: 'var(--fw-semibold)',
          letterSpacing: 'var(--ls-wider)',
          textTransform: 'uppercase',
          color: 'var(--fg-subtle)',
          marginBottom: '16px',
        }}
      >
        Error 404
      </div>

      <div
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'var(--text-7xl)',
          fontWeight: 'var(--fw-heavy)',
          letterSpacing: 'var(--ls-tight)',
          lineHeight: 1,
          color: 'var(--fg)',
          marginBottom: '16px',
        }}
      >
        404
      </div>

      <p
        style={{
          fontSize: 'var(--text-base)',
          color: 'var(--fg-muted)',
          lineHeight: 'var(--lh-loose)',
          margin: '0 auto 40px',
        }}
      >
        <Translate id="theme.NotFound.p1">
          That page doesn't exist. It may have moved or the URL might be wrong.
        </Translate>
      </p>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '8px',
          marginBottom: '32px',
        }}
      >
        {LINKS.map(({ label, href, icon }) => (
          <Link key={label} to={href} style={{ textDecoration: 'none' }}>
            <div
              className="panel"
              style={{
                padding: 'var(--s-4)',
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--s-3)',
                transition: 'border-color var(--dur-fast), background var(--dur-fast)',
                cursor: 'pointer',
              }}
            >
              <span
                className="material-symbols-rounded"
                style={{ fontSize: '18px', color: 'var(--fg-muted)' }}
              >
                {icon}
              </span>
              <span
                style={{
                  fontSize: 'var(--text-sm)',
                  fontWeight: 'var(--fw-medium)',
                  color: 'var(--fg)',
                }}
              >
                {label}
              </span>
            </div>
          </Link>
        ))}
      </div>

      <Link
        to="/"
        className="btn btn--primary"
        style={{ textDecoration: 'none', fontSize: '14px' }}
      >
        <span className="material-symbols-rounded" style={{ fontSize: '16px' }}>
          home
        </span>
        Back to home
      </Link>
    </div>
  );
}
