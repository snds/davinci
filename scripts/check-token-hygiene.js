#!/usr/bin/env node
/* Token-hygiene guard (QA audit, Phase 2).
 *
 * Fails if Storybook stories or docs pages introduce hardcoded colors that
 * won't adapt to the light/dark theme. Use CSS variables
 * (var(--fg-muted), var(--border), var(--bg-subtle)…) or shadcn semantic
 * classes (bg-muted, text-muted-foreground, bg-card…) instead.
 *
 * Exempt: lines that are decorative color art (contain `gradient` or `hsl(`)
 * and fenced code examples in .md/.mdx (so "✗ avoid" snippets can show hex).
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const TARGETS = [
  { dir: 'storybook/src/stories', exts: ['.jsx', '.tsx'] },
  { dir: 'docs/docs', exts: ['.mdx', '.md'] },
];

const HEX = /#[0-9a-fA-F]{3,8}\b/;
const RGB = /\brgba?\(/;
const GRAYSCALE = /\b(?:bg|text|border|ring|divide|from|via|to)-(?:gray|zinc|slate|neutral|stone)-\d{2,3}\b/;
const ALLOW_LINE = /gradient|hsl\(/i;

function walk(dir, exts, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, exts, out);
    else if (exts.includes(path.extname(e.name))) out.push(p);
  }
  return out;
}

const violations = [];
for (const t of TARGETS) {
  const base = path.join(ROOT, t.dir);
  if (!fs.existsSync(base)) continue;
  const isDoc = t.exts.some((e) => e === '.mdx' || e === '.md');
  for (const file of walk(base, t.exts)) {
    let inFence = false;
    fs.readFileSync(file, 'utf8').split('\n').forEach((line, i) => {
      if (isDoc && /^\s*```/.test(line)) { inFence = !inFence; return; }
      if (inFence || ALLOW_LINE.test(line)) return;
      const hit = HEX.test(line) ? 'hardcoded hex color'
        : RGB.test(line) ? 'hardcoded rgb()/rgba() color'
        : GRAYSCALE.test(line) ? 'grayscale Tailwind palette class'
        : null;
      if (hit) violations.push(`${path.relative(ROOT, file)}:${i + 1} — ${hit}: ${line.trim().slice(0, 90)}`);
    });
  }
}

if (violations.length) {
  console.error(`\n✗ Token-hygiene check failed — ${violations.length} hardcoded color(s) that won't adapt to theme:\n`);
  violations.forEach((v) => console.error('  ' + v));
  console.error('\nFix: use CSS variables (var(--fg-muted), var(--border)…) or shadcn semantic classes');
  console.error('(bg-muted, text-muted-foreground, bg-card…). Decorative gradient/hsl art and fenced');
  console.error('code examples are exempt.\n');
  process.exit(1);
}
console.log('✓ Token-hygiene check passed (stories + docs).');
