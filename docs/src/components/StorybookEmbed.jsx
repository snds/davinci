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
