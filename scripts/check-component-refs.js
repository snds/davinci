#!/usr/bin/env node
/* Component-reference guard.
 *
 * Catches the class of bug that builds clean but blanks the app at runtime:
 * a capitalized JSX component used in a module that is NOT imported or locally
 * declared (e.g. only *re-exported* — `export { X } from …` creates no local
 * binding). esbuild/rollup leave the free identifier alone, so the build
 * passes and React throws "Element type is invalid" only at render time.
 *
 * Scans the demo app source (the client-rendered SPA most exposed to this).
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SCAN_DIRS = ['apps/demo/src'];
const EXTS = ['.jsx', '.tsx'];

// Roots that are always available without an explicit import in these files.
const GLOBALS = new Set(['React', 'Fragment']);

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (EXTS.includes(path.extname(e.name))) out.push(p);
  }
  return out;
}

function declaredNames(src) {
  const names = new Set(GLOBALS);
  // import { a, b as c }, Default, * as NS
  for (const m of src.matchAll(/import\s+([^;]*?)\s+from\s+['"][^'"]+['"]/g)) {
    const clause = m[1];
    const named = clause.match(/\{([^}]*)\}/);
    if (named) named[1].split(',').forEach((n) => {
      const name = n.trim().split(/\s+as\s+/).pop().trim();
      if (name) names.add(name);
    });
    const ns = clause.match(/\*\s+as\s+(\w+)/);
    if (ns) names.add(ns[1]);
    const def = clause.replace(/\{[^}]*\}/, '').replace(/\*\s+as\s+\w+/, '').replace(/,/g, '').trim();
    if (/^[A-Za-z_$][\w$]*$/.test(def)) names.add(def);
  }
  // local function / const / class declarations (any case; we only test caps usage)
  for (const m of src.matchAll(/(?:function|const|let|var|class)\s+([A-Za-z_$][\w$]*)/g)) names.add(m[1]);
  return names;
}

const violations = [];
for (const d of SCAN_DIRS) {
  const base = path.join(ROOT, d);
  if (!fs.existsSync(base)) continue;
  for (const file of walk(base)) {
    const src = fs.readFileSync(file, 'utf8');
    const declared = declaredNames(src);
    const seen = new Set();
    // <Component  or  <Component.Member  — take the root identifier
    for (const m of src.matchAll(/<([A-Z][\w]*)(\.\w+)?[\s/>]/g)) {
      const root = m[1];
      if (declared.has(root) || seen.has(root)) continue;
      seen.add(root);
      const line = src.slice(0, m.index).split('\n').length;
      violations.push(`${path.relative(ROOT, file)}:${line} — <${root}${m[2] || ''}> is used but not imported or declared in this module`);
    }
  }
}

if (violations.length) {
  console.error(`\n✗ Component-reference check failed — ${violations.length} undefined component reference(s):\n`);
  violations.forEach((v) => console.error('  ' + v));
  console.error('\nA component used in a module must be imported or declared there. Note: `export { X }');
  console.error("from '…'` is a re-export — it does NOT create a local binding. Import it as well.\n");
  process.exit(1);
}
console.log('✓ Component-reference check passed (demo).');
