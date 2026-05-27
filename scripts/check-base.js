#!/usr/bin/env node
/* Base-purity guard (three-way contract — see repo CLAUDE.md).
 *
 * The base layer (packages/ui/src/components/ui) must stay regenerable stock
 * shadcn: behavior only, never Davinci skin. Appearance belongs in the theme
 * (ui_kits/web_app/davinci.css, keyed off data-slot/data-variant/data-size);
 * product ergonomics belong in wrappers (components/davinci). This guard fails
 * the build when a base file drifts into the wrong layer.
 *
 * It is the fast, dependency-free gate. The deeper check is to re-add each
 * tracked component (see .shadcn-registry.json) with
 *   npx shadcn@latest add <name> --overwrite
 * into a temp dir and diff against components/ui — divergence = wrong layer.
 *
 * Detects:
 *   1. Davinci tokens injected via Tailwind arbitrary values  ( -[var(--bg-…)] )
 *   2. davinci.css class composition  ( "btn …", btn--…, input--… )
 *   3. base importing from the wrapper layer  ( components/davinci/… )
 *   4. Davinci-native primitives left in the base folder
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const BASE_DIR = path.join(ROOT, 'packages/ui/src/components/ui');

// Davinci semantic + palette token roots. Stock shadcn never references these
// in component className strings (it uses semantic utilities like bg-primary,
// or the shadcn var shorthand bg-(--color-…)). Arbitrary -[var(--…)] values
// pointing at these names are baked-in Davinci skin and belong in the theme.
const DAVINCI_TOKENS =
  'bg|fg|accent|border-strong|border-subtle|blue|yellow|teal|red|green|amber|' +
  'tomato|violet|sage|olive|sand|slate|mauve|gray|crimson|ruby|pink|plum|' +
  'purple|indigo|cyan|grass|lime|mint|sky|orange|brown|gold|bronze|focus-ring';

const RULES = [
  { name: 'Davinci token in arbitrary value', re: new RegExp(`-\\[var\\(--(?:${DAVINCI_TOKENS})`) },
  { name: 'davinci.css class composition (.btn--/.input--/…)', re: /\b(?:btn|input|card|alert|badge|avatar|pill|composer|dropdown|dialog)--[a-z]/ },
  { name: 'davinci.css base class ("btn " prefix)', re: /["'\s]btn\s/ },
  { name: 'base imports from wrapper layer', re: /components\/davinci\// },
];

// Native (non-shadcn) primitives that must live in components/davinci, not here.
const FORBIDDEN_NATIVE = ['surface.jsx', 'empty-state.jsx', 'input-group.jsx', 'rich-textarea.jsx'];

const violations = [];

if (!fs.existsSync(BASE_DIR)) {
  console.error(`check:base — base dir not found: ${BASE_DIR}`);
  process.exit(1);
}

for (const native of FORBIDDEN_NATIVE) {
  if (fs.existsSync(path.join(BASE_DIR, native))) {
    violations.push(`${native}: Davinci-native primitive in base folder — move to components/davinci/`);
  }
}

for (const file of fs.readdirSync(BASE_DIR).filter((f) => f.endsWith('.jsx'))) {
  const lines = fs.readFileSync(path.join(BASE_DIR, file), 'utf8').split('\n');
  lines.forEach((line, i) => {
    // skip comment-only lines
    const code = line.replace(/\/\*.*?\*\//g, '').replace(/\/\/.*$/, '');
    for (const rule of RULES) {
      if (rule.re.test(code)) {
        violations.push(`${file}:${i + 1}  ${rule.name}\n      ${line.trim().slice(0, 100)}`);
      }
    }
  });
}

if (violations.length) {
  console.error('\n✗ check:base — base layer is not pristine shadcn:\n');
  for (const v of violations) console.error('  ' + v);
  console.error(
    '\nThe base (components/ui) owns behavior only. Move appearance to ' +
    'davinci.css (data-attribute selectors) and ergonomics to components/davinci.\n' +
    'See CLAUDE.md → "The three-way contract".\n'
  );
  process.exit(1);
}

console.log('✓ check:base — base layer is pristine (no Davinci skin in components/ui)');
