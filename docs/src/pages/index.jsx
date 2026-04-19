import React from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';

const LAYERS = [
  {
    eyebrow: 'Layer 01',
    label: 'Foundations',
    description:
      'Colors, typography, spacing, shadows, and radii — the core design tokens every component is built from. Never hardcode values.',
    href: '/foundations/colors',
    items: ['Colors', 'Typography', 'Spacing', 'Shadows', 'Radii'],
    accentClass: 'pill--accent',
  },
  {
    eyebrow: 'Layer 02',
    label: 'Primitives',
    description:
      'Buttons, avatars, icons, and pills — atomic interactive elements composed directly from tokens with no additional dependencies.',
    href: '/primitives/buttons',
    items: ['Buttons', 'Avatars', 'Icons', 'Pills'],
    accentClass: 'pill--accent',
  },
  {
    eyebrow: 'Layer 03',
    label: 'Components',
    description:
      'Panels, posts, composers, and navigation — structured UI units that assemble primitives into coherent product interactions.',
    href: '/components/panel',
    items: ['Panel', 'Post', 'Composer', 'Navigation'],
    accentClass: 'pill--alt',
  },
  {
    eyebrow: 'Layer 04',
    label: 'Patterns',
    description:
      'Feed, profile, and rails — full page layout patterns that compose components into complete product surfaces.',
    href: '/patterns/feed',
    items: ['Feed', 'Profile', 'Rails'],
    accentClass: 'pill--alt',
  },
];

const STATS = [
  { value: '4', label: 'Layers' },
  { value: '17', label: 'Pages' },
  { value: '60+', label: 'Tokens' },
  { value: '14', label: 'Components' },
];

function StatItem({ value, label }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'var(--text-3xl)',
          fontWeight: 'var(--fw-heavy)',
          letterSpacing: 'var(--ls-tight)',
          color: 'var(--fg)',
          lineHeight: 1,
        }}
      >
        {value}
      </div>
      <div
        style={{
          fontSize: 'var(--text-xs)',
          fontWeight: 'var(--fw-semibold)',
          letterSpacing: 'var(--ls-wider)',
          textTransform: 'uppercase',
          color: 'var(--fg-subtle)',
          marginTop: '6px',
        }}
      >
        {label}
      </div>
    </div>
  );
}

function LayerCard({ eyebrow, label, description, href, items, accentClass }) {
  return (
    <Link to={href} style={{ textDecoration: 'none', display: 'block' }}>
      <div
        className="panel"
        style={{
          transition: 'border-color var(--dur-base), background var(--dur-base)',
          cursor: 'pointer',
          height: '100%',
        }}
      >
        <div className="panel__header">
          <span
            style={{
              fontSize: '10px',
              fontWeight: 'var(--fw-semibold)',
              letterSpacing: 'var(--ls-wider)',
              textTransform: 'uppercase',
              color: 'var(--fg-subtle)',
              fontFamily: 'var(--font-mono)',
            }}
          >
            {eyebrow}
          </span>
          <span
            style={{
              fontSize: 'var(--text-md)',
              fontWeight: 'var(--fw-bold)',
              color: 'var(--fg)',
              marginLeft: 'auto',
              fontFamily: 'var(--font-display)',
            }}
          >
            {label} →
          </span>
        </div>
        <div className="panel__body">
          <p
            style={{
              fontSize: 'var(--text-sm)',
              color: 'var(--fg-muted)',
              lineHeight: 'var(--lh-normal)',
              margin: '0 0 14px',
            }}
          >
            {description}
          </p>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {items.map((item) => (
              <span key={item} className={`pill ${accentClass}`}>
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function Home() {
  const { siteConfig } = useDocusaurusContext();

  return (
    <Layout title="Davinci Design System" description={siteConfig.tagline} noFooter={false}>
      {/* Hero */}
      <div
        style={{
          maxWidth: '860px',
          margin: '0 auto',
          padding: '80px 24px 64px',
          textAlign: 'center',
        }}
      >
        {/* Logo mark */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '32px' }}>
          <div
            style={{
              width: '72px',
              height: '72px',
              background: 'var(--accent)',
              borderRadius: '18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'var(--shadow-lg), 0 0 0 1px var(--accent-border)',
              position: 'relative',
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '38px',
                fontWeight: 'var(--fw-heavy)',
                color: '#fff',
                letterSpacing: '-0.04em',
                lineHeight: 1,
                position: 'relative',
                top: '-1px',
              }}
            >
              D
            </span>
            {/* Yellow accent dot */}
            <span
              style={{
                position: 'absolute',
                bottom: '10px',
                right: '10px',
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                background: 'var(--alt)',
              }}
            />
          </div>
        </div>

        {/* Eyebrow */}
        <div
          style={{
            fontSize: '11px',
            fontWeight: 'var(--fw-semibold)',
            letterSpacing: 'var(--ls-wider)',
            textTransform: 'uppercase',
            color: 'var(--fg-muted)',
            marginBottom: '16px',
          }}
        >
          Design System
        </div>

        {/* Title */}
        <h1
          style={{
            fontSize: 'var(--text-7xl)',
            fontWeight: 'var(--fw-heavy)',
            letterSpacing: 'var(--ls-tight)',
            lineHeight: 'var(--lh-tight)',
            margin: '0 0 20px',
            color: 'var(--fg)',
            fontFamily: 'var(--font-display)',
          }}
        >
          Davinci
        </h1>

        {/* Tagline */}
        <p
          style={{
            fontSize: 'var(--text-lg)',
            color: 'var(--fg-muted)',
            lineHeight: 'var(--lh-loose)',
            margin: '0 auto 40px',
            maxWidth: '520px',
          }}
        >
          Token-first. CSS-native. Built on Radix Colors. Foundations to patterns for the Davinci
          platform.
        </p>

        {/* CTA buttons */}
        <div
          style={{
            display: 'flex',
            gap: '10px',
            justifyContent: 'center',
            flexWrap: 'wrap',
          }}
        >
          <Link
            to="/foundations/colors"
            className="btn btn--primary"
            style={{ textDecoration: 'none', fontSize: '14px', padding: '9px 20px' }}
          >
            <span className="material-symbols-rounded" style={{ fontSize: '16px' }}>
              menu_book
            </span>
            Browse the docs
          </Link>
          <a
            href="http://localhost:6006"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn--secondary"
            style={{ fontSize: '14px', padding: '9px 20px' }}
          >
            <span className="material-symbols-rounded" style={{ fontSize: '16px' }}>
              auto_stories
            </span>
            Open Storybook
          </a>
          <a
            href="https://github.com/snds/davinci"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn--ghost"
            style={{ fontSize: '14px', padding: '9px 20px' }}
          >
            <span className="material-symbols-rounded" style={{ fontSize: '16px' }}>
              code
            </span>
            GitHub
          </a>
        </div>
      </div>

      {/* Stats row */}
      <div
        style={{
          maxWidth: '860px',
          margin: '0 auto 64px',
          padding: '0 24px',
        }}
      >
        <div
          className="panel"
          style={{ padding: '24px 0' }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '0',
            }}
          >
            {STATS.map((s, i) => (
              <div
                key={s.label}
                style={{
                  padding: '8px 0',
                  borderRight: i < STATS.length - 1 ? '1px solid var(--border-subtle)' : 'none',
                }}
              >
                <StatItem value={s.value} label={s.label} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Layer cards */}
      <div
        style={{
          maxWidth: '860px',
          margin: '0 auto 80px',
          padding: '0 24px',
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '12px',
        }}
      >
        {LAYERS.map((layer) => (
          <LayerCard key={layer.label} {...layer} />
        ))}
      </div>

      {/* Dog-food footnote */}
      <div
        style={{
          maxWidth: '860px',
          margin: '0 auto 64px',
          padding: '0 24px',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 14px',
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-full)',
          }}
        >
          <span
            className="material-symbols-rounded"
            style={{ fontSize: '14px', color: 'var(--success)', lineHeight: 1 }}
          >
            check_circle
          </span>
          <span style={{ fontSize: '12px', color: 'var(--fg-muted)' }}>
            Dog-fooded — this page is built with the same CSS it documents
          </span>
        </div>
      </div>
    </Layout>
  );
}
