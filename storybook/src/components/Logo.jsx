import React from 'react';

function Logo({ size = 32 }) {
  const h = size;
  const w = Math.round(size * (220 / 56));
  return (
    <div className="topnav__brand" aria-label="Davinci">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 220 56"
        width={w}
        height={h}
        role="img"
        aria-label="Davinci"
        className="dv-logo"
      >
        <g transform="translate(4,8)">
          <rect x="0" y="0" width="40" height="40" rx="8" style={{ fill: 'var(--dv-logo-mark)' }} />
          <path d="M11 10 h10 a10 10 0 0 1 10 10 v0 a10 10 0 0 1 -10 10 h-10 z" style={{ fill: 'var(--dv-logo-counter)' }} />
          <circle cx="24" cy="20" r="3" style={{ fill: 'var(--dv-logo-accent)' }} />
        </g>
        <text
          x="54" y="29.5"
          dominantBaseline="central"
          style={{
            fill: 'var(--dv-logo-text)',
            fontFamily: 'var(--font-display, Inter, ui-sans-serif, system-ui, sans-serif)',
            fontWeight: 800,
            fontSize: 30,
            letterSpacing: '-0.02em',
          }}
        >davinci</text>
      </svg>
    </div>
  );
}

export default Logo;
