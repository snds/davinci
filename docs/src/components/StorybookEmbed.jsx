import React from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

/**
 * StorybookEmbed
 * Embeds a Storybook story in an iframe.
 *
 * Props:
 *   story  — string  Storybook story ID, e.g. 'primitives-button--primary'
 *   height — number  iframe height in px (default 300)
 *   title  — string  accessible title for the iframe
 */
export default function StorybookEmbed({ story, height = 300, title }) {
  const { siteConfig } = useDocusaurusContext();
  const storybookUrl = siteConfig.customFields?.storybookUrl || 'http://localhost:6006';
  const src = `${storybookUrl}/iframe.html?id=${story}&viewMode=story`;

  // A production build that points at localhost means STORYBOOK_URL was never set
  // (the deploy pipeline sets it — see .github/workflows/deploy-pages.yml). Rather
  // than ship a dead cross-origin iframe, surface the misconfiguration explicitly.
  // In dev we keep the iframe: Storybook may be running locally on :6006.
  const isLocalDefault = storybookUrl.includes('localhost');
  const isProdBuild = process.env.NODE_ENV === 'production';
  if (isLocalDefault && isProdBuild) {
    return (
      <div
        style={{
          marginBottom: '24px',
          padding: '16px 18px',
          borderRadius: '12px',
          border: '1px dashed var(--border)',
          background: 'var(--bg-subtle)',
          color: 'var(--fg-muted)',
          fontSize: '13px',
        }}
      >
        Preview unavailable — this build has no <code>STORYBOOK_URL</code> configured.
        Run <code>npm run storybook</code> locally, or set <code>STORYBOOK_URL</code> at build time.
      </div>
    );
  }

  return (
    <div
      style={{
        marginBottom: '24px',
        borderRadius: '12px',
        overflow: 'hidden',
        border: '1px solid var(--border)',
        background: 'var(--bg-surface)',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '8px 14px',
          borderBottom: '1px solid var(--border)',
          background: 'var(--bg-subtle)',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            color: 'var(--fg-subtle)',
          }}
        >
          {story}
        </span>
        <a
          href={`${storybookUrl}/?path=/story/${story}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontSize: '11px',
            color: 'var(--accent-fg)',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          Open in Storybook ↗
        </a>
      </div>
      <iframe
        src={src}
        title={title || story}
        width="100%"
        height={height}
        style={{
          border: 'none',
          display: 'block',
          background: 'var(--bg)',
        }}
        loading="lazy"
      />
    </div>
  );
}
