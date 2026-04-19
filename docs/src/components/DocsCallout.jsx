import React from 'react';

const VARIANTS = {
  info: {
    bg: 'var(--accent-subtle)',
    border: 'var(--accent-border)',
    iconColor: 'var(--accent-fg)',
    icon: 'info',
    label: 'Info',
  },
  tip: {
    bg: 'var(--green-a3)',
    border: 'rgba(48,164,108,.35)',
    iconColor: 'var(--success-fg)',
    icon: 'tips_and_updates',
    label: 'Tip',
  },
  warning: {
    bg: 'var(--alt-subtle)',
    border: 'rgba(120,100,0,.3)',
    iconColor: 'var(--alt-fg)',
    icon: 'warning',
    label: 'Warning',
  },
  danger: {
    bg: 'var(--red-a3)',
    border: 'rgba(229,72,77,.35)',
    iconColor: 'var(--danger-fg)',
    icon: 'error',
    label: 'Danger',
  },
  note: {
    bg: 'var(--bg-surface)',
    border: 'var(--border)',
    iconColor: 'var(--fg-muted)',
    icon: 'sticky_note_2',
    label: 'Note',
  },
};

/**
 * DocsCallout
 * A Davinci-styled inline callout box for documentation pages.
 *
 * Props:
 *   type     — 'info' | 'tip' | 'warning' | 'danger' | 'note'  (default 'info')
 *   title    — string  Optional header text (defaults to type label)
 *   children — React node  Callout body content
 */
export default function DocsCallout({ type = 'info', title, children }) {
  const v = VARIANTS[type] || VARIANTS.info;

  return (
    <div
      style={{
        display: 'flex',
        gap: '12px',
        background: v.bg,
        border: `1px solid ${v.border}`,
        borderRadius: '10px',
        padding: '14px 16px',
        marginBottom: '20px',
      }}
    >
      <span
        className="material-symbols-rounded"
        style={{
          color: v.iconColor,
          fontSize: '18px',
          flexShrink: 0,
          marginTop: '1px',
          lineHeight: 1,
        }}
      >
        {v.icon}
      </span>
      <div style={{ flex: 1 }}>
        {(title || type) && (
          <div
            style={{
              fontSize: '11px',
              fontWeight: 'var(--fw-semibold)',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              color: v.iconColor,
              marginBottom: children ? '6px' : 0,
            }}
          >
            {title || v.label}
          </div>
        )}
        {children && (
          <div
            style={{
              fontSize: 'var(--text-sm)',
              color: 'var(--fg-muted)',
              lineHeight: 'var(--lh-normal)',
            }}
          >
            {children}
          </div>
        )}
      </div>
    </div>
  );
}
