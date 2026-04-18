import React, { useEffect, useState } from 'react';

/**
 * TokenTable
 * Renders a table of design token names, live previews, and descriptions.
 *
 * Props:
 *   tokens — Array<{ name: string, description?: string }>
 *            name must be a CSS variable like '--blue-9' or '--shadow-md'
 */
function TokenPreview({ name }) {
  const [value, setValue] = useState('');

  useEffect(() => {
    const computed = getComputedStyle(document.documentElement)
      .getPropertyValue(name)
      .trim();
    setValue(computed);
  }, [name]);

  const isColor =
    value.startsWith('#') ||
    value.startsWith('rgb') ||
    value.startsWith('hsl') ||
    value.startsWith('oklch') ||
    /^color-mix/.test(value) ||
    (value.startsWith('var(--') &&
      (name.includes('color') ||
        name.includes('bg') ||
        name.includes('fg') ||
        name.includes('border') ||
        name.includes('accent') ||
        name.includes('sand') ||
        name.includes('blue') ||
        name.includes('yellow') ||
        name.includes('green') ||
        name.includes('red') ||
        name.includes('amber') ||
        name.includes('gray') ||
        name.includes('overlay') ||
        name.includes('scrim')));

  const isShadow = name.includes('shadow');
  const isRadius = name.includes('radius');
  const isSpacing = name.includes('--s-') || name.includes('spacing');

  if (isColor) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div
          style={{
            width: '24px',
            height: '24px',
            borderRadius: '4px',
            background: `var(${name})`,
            border: '1px solid var(--border-subtle)',
            flexShrink: 0,
          }}
        />
        <code style={{ fontSize: '11px' }}>{value || '—'}</code>
      </div>
    );
  }

  if (isShadow) {
    return (
      <div
        style={{
          display: 'inline-block',
          width: '40px',
          height: '24px',
          background: 'var(--bg-elevated)',
          borderRadius: '4px',
          boxShadow: `var(${name})`,
        }}
      />
    );
  }

  if (isRadius) {
    return (
      <div
        style={{
          display: 'inline-block',
          width: '32px',
          height: '32px',
          background: 'var(--accent-subtle)',
          border: '1px solid var(--accent-border)',
          borderRadius: `var(${name})`,
        }}
      />
    );
  }

  if (isSpacing) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
        }}
      >
        <div
          style={{
            height: '8px',
            width: `var(${name})`,
            maxWidth: '200px',
            background: 'var(--accent)',
            borderRadius: '2px',
            minWidth: '2px',
          }}
        />
        <code style={{ fontSize: '11px' }}>{value}</code>
      </div>
    );
  }

  return <code style={{ fontSize: '11px' }}>{value || '—'}</code>;
}

export default function TokenTable({ tokens = [] }) {
  return (
    <div
      style={{
        overflowX: 'auto',
        borderRadius: '10px',
        border: '1px solid var(--border)',
        marginBottom: '24px',
      }}
    >
      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          border: 'none',
          margin: 0,
        }}
      >
        <thead>
          <tr>
            {['Token', 'Preview', 'Description'].map((h) => (
              <th
                key={h}
                style={{
                  padding: '10px 16px',
                  textAlign: 'left',
                  fontFamily: 'var(--font-body)',
                  fontWeight: 'var(--fw-semibold)',
                  fontSize: '11px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  color: 'var(--fg-muted)',
                  background: 'var(--bg-surface)',
                  borderBottom: '1px solid var(--border)',
                }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tokens.map((token, i) => (
            <tr
              key={token.name}
              style={{
                background: i % 2 === 0 ? 'transparent' : 'var(--bg-subtle)',
              }}
            >
              <td
                style={{
                  padding: '10px 16px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '12px',
                  color: 'var(--accent-fg)',
                  borderBottom: i < tokens.length - 1 ? '1px solid var(--border-subtle)' : 'none',
                  whiteSpace: 'nowrap',
                }}
              >
                {token.name}
              </td>
              <td
                style={{
                  padding: '10px 16px',
                  borderBottom: i < tokens.length - 1 ? '1px solid var(--border-subtle)' : 'none',
                }}
              >
                <TokenPreview name={token.name} />
              </td>
              <td
                style={{
                  padding: '10px 16px',
                  fontSize: '13px',
                  color: 'var(--fg-muted)',
                  borderBottom: i < tokens.length - 1 ? '1px solid var(--border-subtle)' : 'none',
                }}
              >
                {token.description || ''}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
