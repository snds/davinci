import React, { useEffect, useState } from 'react';

export default {
  title: 'Foundations/Colors',
  parameters: {
    layout: 'fullscreen',
    controls: { disable: true },
  },
};

// ---------------------------------------------------------------------------
// Primitives
// ---------------------------------------------------------------------------

function useVar(name) {
  const [value, setValue] = useState('');
  useEffect(() => {
    const read = () => setValue(getComputedStyle(document.documentElement).getPropertyValue(name).trim());
    read();
    // Re-read when the theme toolbar flips data-theme so printed values update.
    const obs = new MutationObserver(read);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => obs.disconnect();
  }, [name]);
  return value;
}

/** Single square chip used in scale rows */
function ScaleChip({ scale, step }) {
  const varName = `--${scale}-${step}`;
  const value = useVar(varName);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, flex: '1 1 0' }}>
      <div
        title={`${varName}: ${value}`}
        style={{
          width: '100%',
          height: 40,
          background: `var(${varName})`,
          borderRadius: step === 1 ? '6px 0 0 6px' : step === 12 ? '0 6px 6px 0' : 0,
          cursor: 'default',
        }}
      />
      <span style={{ fontSize: 10, color: 'var(--fg-subtle)', fontFamily: 'var(--font-mono)', lineHeight: 1 }}>
        {step}
      </span>
    </div>
  );
}

/** Full 12-step horizontal scale band */
function ScaleRow({ scale, label }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <div style={{ width: 64, flexShrink: 0, fontSize: 12, fontWeight: 600, color: 'var(--fg-muted)', fontFamily: 'var(--font-mono)', textAlign: 'right' }}>
        {label || scale}
      </div>
      <div style={{ flex: 1, display: 'flex', borderRadius: 6, overflow: 'hidden', border: '1px solid var(--border-subtle)' }}>
        {[1,2,3,4,5,6,7,8,9,10,11,12].map((step) => (
          <ScaleChip key={step} scale={scale} step={step} />
        ))}
      </div>
    </div>
  );
}

/** Scale group with eyebrow label and multiple rows */
function ScaleGroup({ title, scales }) {
  return (
    <div style={{ marginBottom: 40 }}>
      <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--fg-subtle)', marginBottom: 12 }}>
        {title}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {scales.map(([scale, label]) => (
          <ScaleRow key={scale} scale={scale} label={label} />
        ))}
      </div>
    </div>
  );
}

/** Single semantic token swatch (tall chip + name + value) */
function SemanticSwatch({ name, description }) {
  const value = useVar(name);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, minWidth: 0 }}>
      <div
        title={`${name}: ${value}`}
        style={{
          height: 48,
          borderRadius: 8,
          background: `var(${name})`,
          border: '1px solid var(--border-subtle)',
        }}
      />
      <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--fg)', fontFamily: 'var(--font-mono)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {name}
      </div>
      {description && (
        <div style={{ fontSize: 10, color: 'var(--fg-subtle)', lineHeight: 1.4 }}>{description}</div>
      )}
      <div style={{ fontSize: 10, color: 'var(--fg-muted)', fontFamily: 'var(--font-mono)' }}>{value || '—'}</div>
    </div>
  );
}

/** Grid of semantic swatches */
function SemanticGroup({ title, tokens }) {
  return (
    <div style={{ marginBottom: 40 }}>
      <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--fg-subtle)', marginBottom: 14 }}>
        {title}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 14, padding: '20px', background: 'var(--bg-surface)', borderRadius: 10, border: '1px solid var(--border)' }}>
        {tokens.map(([name, desc]) => (
          <SemanticSwatch key={name} name={name} description={desc} />
        ))}
      </div>
    </div>
  );
}

/** Semantic token row with step reference badge */
function BrandToken({ name, description, resolves }) {
  const value = useVar(name);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', borderRadius: 8, background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
      <div style={{ width: 40, height: 40, borderRadius: 8, background: `var(${name})`, border: '1px solid var(--border-subtle)', flexShrink: 0 }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--fg)', fontFamily: 'var(--font-mono)' }}>{name}</div>
        <div style={{ fontSize: 11, color: 'var(--fg-muted)', marginTop: 2 }}>{description}</div>
      </div>
      <div style={{ fontSize: 10, color: 'var(--fg-subtle)', fontFamily: 'var(--font-mono)', whiteSpace: 'nowrap' }}>
        {resolves}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Story 1: Full Palette
// ---------------------------------------------------------------------------

export const Palette = {
  name: '1 · Full Palette',
  render: () => (
    <div style={{ padding: '32px 40px', maxWidth: 960, margin: '0 auto' }}>
      <h2 style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 6 }}>Foundation Palette</h2>
      <p style={{ fontSize: 13, color: 'var(--fg-muted)', marginBottom: 40, lineHeight: 1.6 }}>
        All 31 Radix Color scales. Each row shows steps 1–12: backgrounds (1–2), component fills (3–5), borders (6–8), solid fills (9–10), and text (11–12). These raw scale variables are the source of truth — always reference them via semantic tokens, never directly in components.
      </p>

      <ScaleGroup title="Neutrals" scales={[
        ['gray',  'gray'],
        ['mauve', 'mauve'],
        ['slate', 'slate'],
        ['sage',  'sage'],
        ['olive', 'olive'],
        ['sand',  'sand ↗ used'],
      ]} />

      <ScaleGroup title="Reds & Pinks" scales={[
        ['tomato',  'tomato'],
        ['red',     'red ↗ danger'],
        ['ruby',    'ruby'],
        ['crimson', 'crimson'],
        ['pink',    'pink'],
        ['plum',    'plum'],
      ]} />

      <ScaleGroup title="Purples" scales={[
        ['purple', 'purple'],
        ['violet', 'violet'],
        ['iris',   'iris'],
        ['indigo', 'indigo'],
      ]} />

      <ScaleGroup title="Blues" scales={[
        ['blue', 'blue ↗ accent'],
        ['cyan', 'cyan'],
        ['sky',  'sky'],
      ]} />

      <ScaleGroup title="Greens & Teals" scales={[
        ['teal',  'teal'],
        ['jade',  'jade'],
        ['green', 'green ↗ success'],
        ['grass', 'grass'],
        ['mint',  'mint'],
        ['sage',  'sage'],
      ]} />

      <ScaleGroup title="Yellows, Ambers & Oranges" scales={[
        ['yellow', 'yellow ↗ alt'],
        ['amber',  'amber ↗ warning'],
        ['orange', 'orange'],
        ['lime',   'lime'],
      ]} />

      <ScaleGroup title="Browns & Metals" scales={[
        ['brown',  'brown'],
        ['bronze', 'bronze'],
        ['gold',   'gold'],
      ]} />
    </div>
  ),
};

// ---------------------------------------------------------------------------
// Story 2: Semantic Tokens
// ---------------------------------------------------------------------------

export const Semantic = {
  name: '2 · Semantic Tokens',
  render: () => (
    <div style={{ padding: '32px 40px', maxWidth: 960, margin: '0 auto' }}>
      <h2 style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 6 }}>Semantic Tokens</h2>
      <p style={{ fontSize: 13, color: 'var(--fg-muted)', marginBottom: 8, lineHeight: 1.6 }}>
        Purpose-driven aliases over the raw palette. These are the tokens you use in component CSS — never raw scale values. All tokens adapt automatically between dark (default) and light themes.
      </p>
      <div style={{ display: 'inline-block', fontSize: 11, color: 'var(--accent-fg)', background: 'var(--accent-subtle)', border: '1px solid var(--accent-border)', borderRadius: 6, padding: '4px 10px', marginBottom: 36 }}>
        Toggle theme in the Storybook toolbar to see all values update
      </div>

      <SemanticGroup title="Backgrounds" tokens={[
        ['--bg',           'Page background'],
        ['--bg-subtle',    'Navbar, sidebar, footer'],
        ['--bg-surface',   'Cards and panels'],
        ['--bg-elevated',  'Dropdowns, tooltips'],
        ['--bg-hover',     'Interactive hover'],
        ['--bg-active',    'Pressed / active'],
        ['--bg-selected',  'Selected (blue-tinted)'],
      ]} />

      <SemanticGroup title="Foreground / Text" tokens={[
        ['--fg',           'Primary text'],
        ['--fg-muted',     'Secondary text'],
        ['--fg-subtle',    'Tertiary / timestamps'],
        ['--fg-disabled',  'Disabled'],
        ['--fg-on-accent', 'On blue fills (always white)'],
        ['--fg-on-alt',    'On yellow fills (dark brown)'],
      ]} />

      <SemanticGroup title="Borders" tokens={[
        ['--border',        'Default separator'],
        ['--border-subtle', 'Inner / row dividers'],
        ['--border-strong', 'Emphatic borders'],
        ['--border-focus',  'Keyboard focus ring'],
      ]} />

      <SemanticGroup title="Status" tokens={[
        ['--success',     'Positive — green-9'],
        ['--success-fg',  'Success text'],
        ['--danger',      'Destructive — red-9'],
        ['--danger-fg',   'Danger text'],
        ['--warning',     'Cautionary — amber-9'],
        ['--warning-fg',  'Warning text'],
      ]} />
    </div>
  ),
};

// ---------------------------------------------------------------------------
// Story 3: Brand — Primary (Blue) & Alt (Yellow)
// ---------------------------------------------------------------------------

export const Brand = {
  name: '3 · Brand Colors',
  render: () => (
    <div style={{ padding: '32px 40px', maxWidth: 960, margin: '0 auto' }}>
      <h2 style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 6 }}>Brand Colors</h2>
      <p style={{ fontSize: 13, color: 'var(--fg-muted)', marginBottom: 40, lineHeight: 1.6 }}>
        Davinci has two brand colors: <strong style={{ color: 'var(--fg)' }}>Blue (primary/accent)</strong> and <strong style={{ color: 'var(--fg)' }}>Yellow (alt/spotlight)</strong>. Below: the full scale for reference, followed by the semantic aliases that map into each scale.
      </p>

      {/* ── Blue ── */}
      <div style={{ marginBottom: 48 }}>
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--fg-subtle)', marginBottom: 14 }}>
          Primary — Blue
        </div>
        <ScaleRow scale="blue" />
        <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <BrandToken name="--accent"        description="Primary interactive color — buttons, links"         resolves="blue-9"  />
          <BrandToken name="--accent-hover"  description="Hover state"                                        resolves="blue-10" />
          <BrandToken name="--accent-subtle" description="Tinted background for accent regions"               resolves="blue-3"  />
          <BrandToken name="--accent-fg"     description="Text on neutral bg in accent context"               resolves="blue-11" />
          <BrandToken name="--accent-border" description="Border in accent-tinted containers"                 resolves="blue-7"  />
          <BrandToken name="--bg-selected"   description="Selected item background"                           resolves="blue-4"  />
          <BrandToken name="--border-focus"  description="Focus ring"                                         resolves="blue-8"  />
        </div>
      </div>

      {/* ── Yellow ── */}
      <div style={{ marginBottom: 48 }}>
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--fg-subtle)', marginBottom: 14 }}>
          Alt — Yellow (Spotlight)
        </div>
        <ScaleRow scale="yellow" />
        <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <BrandToken name="--alt"        description="Secondary brand — used sparingly"       resolves="yellow-9"  />
          <BrandToken name="--alt-hover"  description="Hover state"                            resolves="yellow-10" />
          <BrandToken name="--alt-subtle" description="Tinted background for alt regions"      resolves="yellow-3"  />
          <BrandToken name="--alt-fg"     description="Yellow-toned text on neutral bg"        resolves="yellow-11" />
        </div>
      </div>

      {/* ── Alpha overlays ── */}
      <div style={{ marginBottom: 48 }}>
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--fg-subtle)', marginBottom: 14 }}>
          Theme-independent Overlays
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--fg-muted)', marginBottom: 10, fontFamily: 'var(--font-mono)' }}>White alpha</div>
            <div style={{ display: 'flex', height: 32, borderRadius: 6, overflow: 'hidden', border: '1px solid var(--border-subtle)', background: 'var(--sand-9)' }}>
              {[1,2,3,4,5,6,7,8,9,10,11,12].map((s) => (
                <div key={s} style={{ flex: 1, background: `var(--white-a${s})` }} title={`--white-a${s}`} />
              ))}
            </div>
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--fg-muted)', marginBottom: 10, fontFamily: 'var(--font-mono)' }}>Black alpha</div>
            <div style={{ display: 'flex', height: 32, borderRadius: 6, overflow: 'hidden', border: '1px solid var(--border-subtle)', background: 'var(--sand-3)' }}>
              {[1,2,3,4,5,6,7,8,9,10,11,12].map((s) => (
                <div key={s} style={{ flex: 1, background: `var(--black-a${s})` }} title={`--black-a${s}`} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
};

// ---------------------------------------------------------------------------
// Story 4: All (combined reference — kept for backward compat / embeds)
// ---------------------------------------------------------------------------

export const AllColors = {
  name: '4 · Reference (all)',
  render: () => (
    <div style={{ padding: '32px 40px', maxWidth: 960, margin: '0 auto' }}>
      <h2 style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 6 }}>All Color Tokens</h2>
      <p style={{ fontSize: 13, color: 'var(--fg-muted)', marginBottom: 40, lineHeight: 1.6 }}>
        Compact combined view. See individual stories for full detail: <em>1 · Full Palette</em>, <em>2 · Semantic Tokens</em>, <em>3 · Brand Colors</em>.
      </p>

      <ScaleGroup title="Primary scales used in UI" scales={[
        ['sand',   'sand'],
        ['blue',   'blue'],
        ['yellow', 'yellow'],
        ['green',  'green'],
        ['red',    'red'],
        ['amber',  'amber'],
      ]} />

      <SemanticGroup title="Backgrounds" tokens={[
        ['--bg','Page'],['--bg-subtle','Subtle'],['--bg-surface','Surface'],['--bg-elevated','Elevated'],
        ['--bg-hover','Hover'],['--bg-active','Active'],['--bg-selected','Selected'],
      ]} />
      <SemanticGroup title="Foregrounds" tokens={[
        ['--fg','Primary'],['--fg-muted','Muted'],['--fg-subtle','Subtle'],['--fg-disabled','Disabled'],
        ['--fg-on-accent','On accent'],['--fg-on-alt','On alt'],
      ]} />
      <SemanticGroup title="Borders" tokens={[
        ['--border','Default'],['--border-subtle','Subtle'],['--border-strong','Strong'],['--border-focus','Focus'],
      ]} />
      <SemanticGroup title="Accent (blue)" tokens={[
        ['--accent','Fill'],['--accent-hover','Hover'],['--accent-subtle','Subtle bg'],
        ['--accent-fg','Text'],['--accent-border','Border'],
      ]} />
      <SemanticGroup title="Alt (yellow)" tokens={[
        ['--alt','Fill'],['--alt-hover','Hover'],['--alt-subtle','Subtle bg'],['--alt-fg','Text'],
      ]} />
      <SemanticGroup title="Status" tokens={[
        ['--success','Success'],['--success-fg','Success text'],
        ['--danger','Danger'],['--danger-fg','Danger text'],
        ['--warning','Warning'],['--warning-fg','Warning text'],
      ]} />
    </div>
  ),
};
