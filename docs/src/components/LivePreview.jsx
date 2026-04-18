import React, { useRef, useEffect } from 'react';

/**
 * LivePreview
 * Renders live HTML using Davinci CSS inside a sandboxed iframe.
 *
 * Props:
 *   children — string  Raw HTML snippet to render
 *   height   — number  iframe height in px (default 200)
 *   theme    — 'dark' | 'light'  (default 'dark')
 *   padding  — string  inner padding CSS value (default '24px')
 */
export default function LivePreview({
  children,
  height = 200,
  theme = 'dark',
  padding = '24px',
}) {
  const iframeRef = useRef(null);

  const srcdoc = `<!DOCTYPE html>
<html data-theme="${theme}" lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <link rel="stylesheet" href="/davinci/colors_and_type.css" />
  <link rel="stylesheet" href="/davinci/davinci.css" />
  <style>
    * { box-sizing: border-box; }
    body {
      margin: 0;
      padding: ${padding};
      background: var(--bg);
      color: var(--fg);
      font-family: var(--font-body);
      font-size: var(--text-base);
      min-height: 100vh;
      display: flex;
      align-items: flex-start;
    }
    .preview-root {
      width: 100%;
    }
  </style>
</head>
<body>
  <div class="preview-root">
    ${children}
  </div>
</body>
</html>`;

  return (
    <div
      style={{
        marginBottom: '24px',
        borderRadius: '12px',
        overflow: 'hidden',
        border: '1px solid var(--border)',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '6px 14px',
          borderBottom: '1px solid var(--border)',
          background: 'var(--bg-subtle)',
          gap: '6px',
        }}
      >
        <span
          style={{
            display: 'inline-block',
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: 'var(--success)',
          }}
        />
        <span
          style={{
            fontSize: '11px',
            color: 'var(--fg-subtle)',
            fontFamily: 'var(--font-mono)',
          }}
        >
          Live Preview — {theme} theme
        </span>
      </div>
      <iframe
        ref={iframeRef}
        srcDoc={srcdoc}
        width="100%"
        height={height}
        style={{
          border: 'none',
          display: 'block',
        }}
        sandbox="allow-scripts allow-same-origin"
        title="Live component preview"
        loading="lazy"
      />
    </div>
  );
}
