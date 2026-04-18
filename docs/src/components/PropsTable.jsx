import React from 'react';

/**
 * PropsTable
 * Documents component props in a formatted table.
 *
 * Props:
 *   props — Array<{
 *     name: string,
 *     type: string,
 *     default?: string,
 *     required?: boolean,
 *     description: string
 *   }>
 */
export default function PropsTable({ props: rows = [] }) {
  const headers = ['Prop', 'Type', 'Default', 'Description'];

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
            {headers.map((h) => (
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
                  whiteSpace: 'nowrap',
                }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={row.name}
              style={{
                background: i % 2 === 0 ? 'transparent' : 'var(--bg-subtle)',
              }}
            >
              <td
                style={{
                  padding: '10px 16px',
                  borderBottom: i < rows.length - 1 ? '1px solid var(--border-subtle)' : 'none',
                  whiteSpace: 'nowrap',
                }}
              >
                <code
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '12px',
                    color: row.required ? 'var(--fg)' : 'var(--accent-fg)',
                    background: 'none',
                    border: 'none',
                    padding: 0,
                  }}
                >
                  {row.name}
                  {row.required && (
                    <span
                      style={{
                        color: 'var(--danger-fg)',
                        marginLeft: '2px',
                        fontWeight: 700,
                      }}
                    >
                      *
                    </span>
                  )}
                </code>
              </td>
              <td
                style={{
                  padding: '10px 16px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '12px',
                  color: 'var(--alt-fg)',
                  borderBottom: i < rows.length - 1 ? '1px solid var(--border-subtle)' : 'none',
                  whiteSpace: 'nowrap',
                }}
              >
                {row.type}
              </td>
              <td
                style={{
                  padding: '10px 16px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '12px',
                  color: 'var(--fg-subtle)',
                  borderBottom: i < rows.length - 1 ? '1px solid var(--border-subtle)' : 'none',
                }}
              >
                {row.default || <span style={{ color: 'var(--fg-disabled)' }}>—</span>}
              </td>
              <td
                style={{
                  padding: '10px 16px',
                  fontSize: '13px',
                  color: 'var(--fg-muted)',
                  lineHeight: 'var(--lh-normal)',
                  borderBottom: i < rows.length - 1 ? '1px solid var(--border-subtle)' : 'none',
                }}
              >
                {row.description}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
