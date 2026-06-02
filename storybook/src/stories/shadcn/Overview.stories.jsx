import React from 'react';

export default {
  title: 'Components/Overview',
  parameters: {
    layout: 'fullscreen',
    controls: { disable: true },
  },
};

// ---------------------------------------------------------------------------
// Shared primitives
// ---------------------------------------------------------------------------

const mono = { fontFamily: 'var(--font-mono)', fontSize: 12 };
const eyebrow = {
  fontSize: 10,
  fontWeight: 700,
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  color: 'var(--fg-subtle)',
  marginBottom: 14,
};
const card = {
  background: 'var(--bg-surface)',
  border: '1px solid var(--border)',
  borderRadius: 10,
  padding: '16px 20px',
};
const badge = (color) => ({
  display: 'inline-block',
  fontSize: 10,
  fontWeight: 600,
  padding: '2px 8px',
  borderRadius: 999,
  background: color === 'accent' ? 'var(--accent-subtle)' : color === 'alt' ? 'var(--alt-subtle)' : 'var(--bg-active)',
  color: color === 'accent' ? 'var(--accent-fg)' : color === 'alt' ? 'var(--alt-fg)' : 'var(--fg-muted)',
  border: `1px solid ${color === 'accent' ? 'var(--accent-border)' : color === 'alt' ? 'var(--yellow-7)' : 'var(--border)'}`,
});

function Code({ children }) {
  return (
    <code style={{ ...mono, background: 'var(--bg-subtle)', border: '1px solid var(--border-subtle)', borderRadius: 4, padding: '1px 6px', color: 'var(--fg)', fontSize: 11 }}>
      {children}
    </code>
  );
}

function Shell({ children }) {
  return (
    <pre style={{ ...mono, background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 8, padding: '14px 16px', color: 'var(--fg-muted)', overflowX: 'auto', margin: 0, fontSize: 12, lineHeight: 1.6 }}>
      {children}
    </pre>
  );
}

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: 48 }}>
      <div style={eyebrow}>{title}</div>
      {children}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Component catalog data
// ---------------------------------------------------------------------------

const COMPONENTS = [
  // Inputs & Forms (13)
  { name: 'button',       category: 'Inputs & Forms',    status: 'recommended', description: 'Primary, secondary, destructive, ghost, link variants + sizes' },
  { name: 'input',        category: 'Inputs & Forms',    status: 'recommended', description: 'Text, email, password, number — standard form field' },
  { name: 'textarea',     category: 'Inputs & Forms',    status: 'recommended', description: 'Multi-line text input; styled native <textarea>' },
  { name: 'label',        category: 'Inputs & Forms',    status: 'recommended', description: 'Radix Label — accessible, pairs with all form inputs' },
  { name: 'select',       category: 'Inputs & Forms',    status: 'recommended', description: 'Radix Select — keyboard-accessible dropdown' },
  { name: 'checkbox',     category: 'Inputs & Forms',    status: 'recommended', description: 'Radix Checkbox — indeterminate state support' },
  { name: 'radio-group',  category: 'Inputs & Forms',    status: 'available',   description: 'Radix RadioGroup — single-selection group' },
  { name: 'switch',       category: 'Inputs & Forms',    status: 'recommended', description: 'Radix Switch — on/off toggle' },
  { name: 'slider',       category: 'Inputs & Forms',    status: 'available',   description: 'Radix Slider — range input, supports dual thumbs' },
  { name: 'toggle',       category: 'Inputs & Forms',    status: 'available',   description: 'Radix Toggle — pressed/unpressed stateful button' },
  { name: 'toggle-group', category: 'Inputs & Forms',    status: 'available',   description: 'Radix ToggleGroup — single or multiple selection' },
  { name: 'form',         category: 'Inputs & Forms',    status: 'available',   description: 'react-hook-form + zod integration helpers' },
  { name: 'input-otp',    category: 'Inputs & Forms',    status: 'available',   description: 'One-time password slots (input-otp library)' },

  // Layout & Surfaces (6)
  { name: 'card',         category: 'Layout & Surfaces', status: 'recommended', description: 'CardHeader, CardTitle, CardDescription, CardContent, CardFooter' },
  { name: 'separator',    category: 'Layout & Surfaces', status: 'recommended', description: 'Radix Separator — horizontal or vertical rule' },
  { name: 'aspect-ratio', category: 'Layout & Surfaces', status: 'available',   description: 'Radix AspectRatio — maintains content proportions' },
  { name: 'scroll-area',  category: 'Layout & Surfaces', status: 'available',   description: 'Radix ScrollArea — custom-styled cross-platform scrollbar' },
  { name: 'resizable',    category: 'Layout & Surfaces', status: 'available',   description: 'react-resizable-panels — draggable panel splits' },
  { name: 'skeleton',     category: 'Layout & Surfaces', status: 'available',   description: 'Loading placeholder with shimmer pulse animation' },

  // Overlays (8)
  { name: 'dialog',        category: 'Overlays', status: 'recommended', description: 'Radix Dialog — modal with backdrop and focus trap' },
  { name: 'alert-dialog',  category: 'Overlays', status: 'recommended', description: 'Radix AlertDialog — blocking confirmation dialog' },
  { name: 'sheet',         category: 'Overlays', status: 'recommended', description: 'Dialog variant that slides in from a screen edge' },
  { name: 'drawer',        category: 'Overlays', status: 'available',   description: 'Vaul drawer — bottom sheet pattern for mobile' },
  { name: 'popover',       category: 'Overlays', status: 'recommended', description: 'Radix Popover — non-modal anchored overlay' },
  { name: 'hover-card',    category: 'Overlays', status: 'available',   description: 'Radix HoverCard — rich preview on hover' },
  { name: 'tooltip',       category: 'Overlays', status: 'recommended', description: 'Radix Tooltip — short hint on hover/focus' },
  { name: 'context-menu',  category: 'Overlays', status: 'available',   description: 'Radix ContextMenu — right-click contextual menu' },

  // Navigation (8)
  { name: 'tabs',              category: 'Navigation', status: 'recommended', description: 'Radix Tabs — keyboard navigable tab panels' },
  { name: 'dropdown-menu',     category: 'Navigation', status: 'recommended', description: 'Radix DropdownMenu — checkboxes, radios, submenus' },
  { name: 'menubar',           category: 'Navigation', status: 'available',   description: 'Radix Menubar — native app-style top menu' },
  { name: 'navigation-menu',   category: 'Navigation', status: 'available',   description: 'Radix NavigationMenu — horizontal nav with flyouts' },
  { name: 'breadcrumb',        category: 'Navigation', status: 'available',   description: 'Accessible path breadcrumb with separators' },
  { name: 'pagination',        category: 'Navigation', status: 'available',   description: 'Numbered page navigation with prev/next' },
  { name: 'command',           category: 'Navigation', status: 'available',   description: 'cmdk — command palette / filtered search' },
  { name: 'sidebar',           category: 'Navigation', status: 'available',   description: 'Full sidebar with collapsible groups and mobile support' },

  // Data Display (9)
  { name: 'badge',        category: 'Data Display', status: 'recommended', description: 'Status labels — default, secondary, destructive, outline' },
  { name: 'avatar',       category: 'Data Display', status: 'recommended', description: 'Radix Avatar — image with fallback initials' },
  { name: 'table',        category: 'Data Display', status: 'recommended', description: 'Semantic HTML table styled with Tailwind utilities' },
  { name: 'accordion',    category: 'Data Display', status: 'available',   description: 'Radix Accordion — collapsible sections (single or multiple)' },
  { name: 'collapsible',  category: 'Data Display', status: 'available',   description: 'Radix Collapsible — single expandable section' },
  { name: 'carousel',     category: 'Data Display', status: 'available',   description: 'Embla Carousel — touch-enabled slide carousel' },
  { name: 'chart',        category: 'Data Display', status: 'available',   description: 'Recharts wrapper with Davinci chart color tokens' },
  { name: 'calendar',     category: 'Data Display', status: 'available',   description: 'react-day-picker — single, range, and multiple selection' },
  { name: 'progress',     category: 'Data Display', status: 'available',   description: 'Radix Progress — determinate progress bar (0–100)' },

  // Feedback (2)
  { name: 'alert',  category: 'Feedback', status: 'recommended', description: 'Callout box — default and destructive variants' },
  { name: 'sonner', category: 'Feedback', status: 'recommended', description: 'Sonner toast notifications — success, error, warning, promise' },
];

const categories = [...new Set(COMPONENTS.map((c) => c.category))];

// ---------------------------------------------------------------------------
// Stories
// ---------------------------------------------------------------------------

export const Integration = {
  name: '1 · Integration',
  render: () => (
    <div style={{ padding: '32px 40px', maxWidth: 960, margin: '0 auto' }}>
      <h2 style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 6 }}>shadcn/ui Integration</h2>
      <p style={{ fontSize: 13, color: 'var(--fg-muted)', marginBottom: 40, lineHeight: 1.6 }}>
        shadcn/ui components are installed into <Code>packages/ui/src/components/ui/</Code> via the CLI.
        They are themed entirely through the Davinci token system — no per-component overrides needed.
      </p>

      {/* Token bridge */}
      <Section title="Token bridge">
        <div style={card}>
          <p style={{ fontSize: 12, color: 'var(--fg-muted)', marginBottom: 16, lineHeight: 1.6 }}>
            shadcn uses its own CSS variable names (<Code>--primary</Code>, <Code>--background</Code>…).
            The bridge layer in <Code>packages/tokens/shadcn-bridge.css</Code> maps each one to the canonical Davinci token:
          </p>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                {['shadcn var', 'Davinci token', 'Radix step'].map((h) => (
                  <th key={h} style={{ textAlign: 'left', padding: '6px 12px 10px', color: 'var(--fg-muted)', fontWeight: 600 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ['--primary',            '--accent',        'blue-9'],
                ['--primary-foreground', '--fg-on-accent',  'white'],
                ['--background',         '--bg',            'sand-1'],
                ['--foreground',         '--fg',            'sand-12'],
                ['--card',               '--bg-surface',    'sand-3 / white'],
                ['--secondary',          '--bg-subtle',     'sand-2'],
                ['--muted',              '--bg-surface',    'sand-3'],
                ['--accent',             '--accent-subtle', 'blue-3'],
                ['--destructive',        '--danger',        'red-9'],
                ['--border',             '--border',        'sand-6'],
                ['--ring',               '--border-focus',  'blue-8'],
              ].map(([s, d, r]) => (
                <tr key={s} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  <td style={{ padding: '8px 12px', ...mono, color: 'var(--accent-fg)' }}>{s}</td>
                  <td style={{ padding: '8px 12px', ...mono, color: 'var(--fg-muted)' }}>{d}</td>
                  <td style={{ padding: '8px 12px', ...mono, color: 'var(--fg-subtle)' }}>{r}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* Tailwind @theme */}
      <Section title="Tailwind v4 @theme wiring">
        <div style={card}>
          <p style={{ fontSize: 12, color: 'var(--fg-muted)', marginBottom: 14, lineHeight: 1.6 }}>
            <Code>packages/ui/src/styles/globals.css</Code> imports the token bundle and uses Tailwind v4's <Code>@theme inline</Code>
            to map the bridge vars to Tailwind color utilities:
          </p>
          <Shell>{`@import "tailwindcss";
@import "@davinci/tokens/all.css";   /* palette + semantic + bridge */

@theme inline {
  --color-primary:     var(--primary);     /* → var(--accent) → blue-9 */
  --color-background:  var(--background);  /* → var(--bg) → sand-1      */
  --color-destructive: var(--destructive); /* → var(--danger) → red-9   */
  /* …all shadcn color names mapped */
}`}</Shell>
          <p style={{ fontSize: 12, color: 'var(--fg-muted)', marginTop: 14, lineHeight: 1.6 }}>
            Result: shadcn's <Code>bg-primary</Code> utility resolves to <Code>var(--accent)</Code> which is <Code>var(--blue-9)</Code>.
            Changing a Davinci token updates every shadcn component that uses it.
          </p>
        </div>
      </Section>

      {/* Adding a component */}
      <Section title="Adding a component">
        <Shell>{`# From project root:
cd packages/ui
npx shadcn@latest add button

# Generate story stub + doc stub:
cd ../..
node scripts/generate-stories.js --components button
node scripts/generate-docs.js --components button

# Stories land at:
#   storybook/src/stories/shadcn/Button.stories.jsx   (edit freely — never overwritten)
# Docs land at:
#   docs/docs/shadcn/button.mdx                        (edit freely — never overwritten)`}</Shell>
      </Section>

      {/* Updating */}
      <Section title="Keeping components up to date">
        <Shell>{`# Full sync (check Radix + shadcn + regenerate stories/docs):
node scripts/sync.js

# shadcn only:
node scripts/sync-shadcn.js

# Dry run (see what would change, no writes):
node scripts/sync.js --check

# CI: runs every Monday via .github/workflows/sync-design-system.yml
# Opens a PR automatically when updates are found.`}</Shell>
      </Section>
    </div>
  ),
};

export const Dependencies = {
  name: '2 · Dependencies',
  render: () => (
    <div style={{ padding: '32px 40px', maxWidth: 960, margin: '0 auto' }}>
      <h2 style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 6 }}>Package Dependencies</h2>
      <p style={{ fontSize: 13, color: 'var(--fg-muted)', marginBottom: 40, lineHeight: 1.6 }}>
        All packages live in <Code>packages/ui/package.json</Code>. shadcn installs per-component Radix primitives automatically via <Code>npx shadcn@latest add</Code>.
      </p>

      <Section title="Core (always present)">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[
            ['tailwindcss',              '^4.1.0',   'CSS utility framework — used for all shadcn component classes'],
            ['@tailwindcss/vite',         '^4.1.0',   'Vite plugin that compiles Tailwind at build time'],
            ['class-variance-authority', '^0.7.1',   'cva() — typed variant factory used by every shadcn component'],
            ['clsx',                     '^2.1.1',   'Conditional class merging'],
            ['tailwind-merge',           '^2.6.0',   'Resolves conflicting Tailwind utility classes'],
            ['lucide-react',             '^0.513.0', 'Icon set used by shadcn components (chevrons, x, check…)'],
          ].map(([pkg, ver, desc]) => (
            <div key={pkg} style={{ ...card, display: 'flex', alignItems: 'flex-start', gap: 16 }}>
              <div style={{ flex: '0 0 220px' }}>
                <div style={{ ...mono, fontSize: 12, color: 'var(--accent-fg)', marginBottom: 2 }}>{pkg}</div>
                <div style={{ ...mono, fontSize: 11, color: 'var(--fg-subtle)' }}>{ver}</div>
              </div>
              <div style={{ fontSize: 12, color: 'var(--fg-muted)', lineHeight: 1.5 }}>{desc}</div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Per-component Radix primitives (installed by shadcn CLI)">
        <div style={{ ...card }}>
          <p style={{ fontSize: 12, color: 'var(--fg-muted)', marginBottom: 16, lineHeight: 1.6 }}>
            When you run <Code>npx shadcn@latest add dialog</Code>, the CLI automatically adds
            <Code>@radix-ui/react-dialog</Code> to <Code>packages/ui/package.json</Code>.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 8 }}>
            {[
              ['@radix-ui/react-dialog',          'dialog, sheet, alert-dialog'],
              ['@radix-ui/react-popover',          'popover, date-picker, combobox'],
              ['@radix-ui/react-select',           'select'],
              ['@radix-ui/react-dropdown-menu',    'dropdown-menu'],
              ['@radix-ui/react-tabs',             'tabs'],
              ['@radix-ui/react-tooltip',          'tooltip'],
              ['@radix-ui/react-checkbox',         'checkbox'],
              ['@radix-ui/react-radio-group',      'radio-group'],
              ['@radix-ui/react-switch',           'switch'],
              ['@radix-ui/react-slider',           'slider'],
              ['@radix-ui/react-accordion',        'accordion, collapsible'],
              ['@radix-ui/react-avatar',           'avatar'],
              ['@radix-ui/react-progress',         'progress'],
              ['@radix-ui/react-separator',        'separator'],
              ['@radix-ui/react-scroll-area',      'scroll-area'],
              ['@radix-ui/react-navigation-menu',  'navigation-menu'],
              ['@radix-ui/react-context-menu',     'context-menu'],
              ['@radix-ui/react-menubar',          'menubar'],
              ['@radix-ui/react-toggle',           'toggle, toggle-group'],
              ['@radix-ui/react-aspect-ratio',     'aspect-ratio'],
              ['cmdk',                             'command, combobox'],
              ['sonner',                           'toast'],
              ['react-hook-form',                  'form'],
              ['@hookform/resolvers',              'form (zod validation)'],
              ['zod',                              'form (schema)'],
              ['react-day-picker',                 'calendar, date-picker'],
              ['recharts',                         'chart'],
              ['embla-carousel-react',             'carousel'],
              ['input-otp',                        'input-otp'],
              ['vaul',                             'drawer'],
            ].map(([pkg, used]) => (
              <div key={pkg} style={{ background: 'var(--bg)', borderRadius: 6, padding: '8px 12px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ ...mono, fontSize: 11, color: 'var(--fg-muted)', marginBottom: 2 }}>{pkg}</div>
                <div style={{ fontSize: 10, color: 'var(--fg-subtle)' }}>→ {used}</div>
              </div>
            ))}
          </div>
        </div>
      </Section>
    </div>
  ),
};

export const ComponentCatalog = {
  name: '3 · Component Catalog',
  render: () => (
    <div style={{ padding: '32px 40px', maxWidth: 960, margin: '0 auto' }}>
      <h2 style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 6 }}>Component Catalog</h2>
      <p style={{ fontSize: 13, color: 'var(--fg-muted)', marginBottom: 8, lineHeight: 1.6 }}>
        All shadcn/ui components available for installation. Components marked <span style={badge('accent')}>recommended</span> are the most commonly needed starting set.
      </p>
      <div style={{ display: 'flex', gap: 8, marginBottom: 36, flexWrap: 'wrap' }}>
        <span style={badge('accent')}>recommended — install these first</span>
        <span style={badge()}>available — add on demand</span>
      </div>

      {categories.map((cat) => {
        const items = COMPONENTS.filter((c) => c.category === cat);
        return (
          <div key={cat} style={{ marginBottom: 40 }}>
            <div style={eyebrow}>{cat}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {items.map((c) => (
                <div key={c.name} style={{ ...card, display: 'flex', alignItems: 'center', gap: 16, padding: '10px 16px' }}>
                  <div style={{ flex: '0 0 160px', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ ...mono, fontSize: 12, color: 'var(--fg)' }}>{c.name}</span>
                    <span style={badge(c.status === 'recommended' ? 'accent' : '')}>
                      {c.status}
                    </span>
                  </div>
                  <div style={{ flex: 1, fontSize: 12, color: 'var(--fg-muted)' }}>{c.description}</div>
                  <Code>{`npx shadcn@latest add ${c.name}`}</Code>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  ),
};
