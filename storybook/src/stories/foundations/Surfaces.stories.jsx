import React from 'react';
import { Surface } from '@davinci/ui/components/ui/surface';

export default {
  title: 'Foundations/Surfaces',
  parameters: {
    layout: 'fullscreen',
    controls: { disable: true },
  },
};

const surfaces = [
  {
    variant: 'canvas',
    davinci: 'Canvas',
    token: '--bg',
    desc: 'Root page background. The highest-level containing element (textured via --bg-pattern).',
  },
  {
    variant: 'container',
    davinci: 'Container',
    token: '--bg-surface',
    desc: 'A raised content region placed on a Canvas. Border + sm elevation.',
  },
  {
    variant: 'module',
    davinci: 'Module',
    token: '--bg-subtle',
    desc: 'A quiet, same-tone grouping placed on a Container to tie content blocks together.',
  },
  {
    variant: 'bristol',
    davinci: 'Bristol',
    token: '--bg-inverse',
    desc: 'The inverse of Module — a contrast grouping whose polarity flips with the theme.',
  },
];

export const Surfaces = {
  name: 'Surface tokens',
  render: () => (
    <div style={{ padding: 48, display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 720 }}>
      <h2 style={{ marginBottom: 8 }}>Surfaces</h2>
      {surfaces.map(({ variant, davinci, token, desc }) => (
        <Surface key={variant} variant={variant} style={{ padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 6 }}>
            <strong style={{ fontSize: 15 }}>{davinci}</strong>
            <code style={{ fontSize: 11, fontFamily: 'var(--font-mono)', opacity: 0.85 }}>
              variant="{variant}" · {token}
            </code>
          </div>
          <p style={{ fontSize: 13, margin: 0, opacity: 0.85 }}>{desc}</p>
        </Surface>
      ))}
    </div>
  ),
};

export const Hierarchy = {
  name: 'Containment hierarchy',
  render: () => (
    <Surface variant="canvas" style={{ minHeight: '100vh', padding: 40 }}>
      <Surface variant="container" style={{ padding: 24, maxWidth: 640 }}>
        <h3 style={{ marginTop: 0 }}>Container</h3>
        <p style={{ fontSize: 13, opacity: 0.85 }}>Placed on the Canvas to indicate a content region.</p>

        <Surface variant="module" style={{ padding: 16, marginTop: 16 }}>
          <strong style={{ fontSize: 14 }}>Module</strong>
          <p style={{ fontSize: 13, margin: '4px 0 0', opacity: 0.85 }}>
            Quiet grouping that ties content blocks together — e.g. a photo + headline.
          </p>
        </Surface>

        <Surface variant="bristol" style={{ padding: 16, marginTop: 12 }}>
          <strong style={{ fontSize: 14 }}>Bristol</strong>
          <p style={{ fontSize: 13, margin: '4px 0 0', color: 'var(--fg-on-inverse-muted)' }}>
            The inverse contrast region. Dark on a light page, light on a dark page.
          </p>
        </Surface>
      </Surface>
    </Surface>
  ),
};
