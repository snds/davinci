#!/usr/bin/env node
/* Deprecated-token ratchet (QA audit follow-up).
 *
 * Some tokens are deprecated but kept as aliases so existing consumers don't
 * break (see the relevant DDR). This guard prevents *new* usage from creeping
 * in and drives the existing count to zero, after which the alias can be
 * removed and the entry deleted from this file.
 *
 * It is a ratchet: the build fails if a token's consumer count differs from its
 * recorded baseline in EITHER direction —
 *   • count > baseline → new deprecated usage was added. Use the replacement.
 *   • count < baseline → consumers were migrated (good!) — lower the baseline
 *     here to lock in the win.
 * The gate is satisfied only when count === baseline, ending naturally at 0.
 *
 * Scope: source files only. The token *definition* file and this script are
 * excluded so the alias declaration and these strings don't self-count.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

// One entry per deprecated token. Lower `baseline` as consumers migrate.
const DEPRECATED = [
  {
    token: '--fg-subtle',
    baseline: 92,
    replacement: '.text-tertiary (class) or var(--fg-muted)',
    ddr: 'DS-2026-001',
  },
];

// Directories that actually contain consumers. Everything else is ignored.
const SCAN_DIRS = ['storybook/src', 'ui_kits', 'apps', 'docs/src', 'preview', 'packages'];
const EXTS = ['.css', '.jsx', '.tsx', '.js', '.ts'];
const SKIP_DIRS = new Set(['node_modules', 'build', 'dist', '.next', 'storybook-static']);
// The token definition lives here — exclude so the alias declaration isn't counted.
const EXCLUDE_FILES = new Set([path.join(ROOT, 'colors_and_type.css')]);

function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.isDirectory()) {
      if (!SKIP_DIRS.has(e.name)) walk(path.join(dir, e.name), out);
    } else if (EXTS.includes(path.extname(e.name))) {
      out.push(path.join(dir, e.name));
    }
  }
  return out;
}

const files = SCAN_DIRS.flatMap((d) => walk(path.join(ROOT, d))).filter((f) => !EXCLUDE_FILES.has(f));

const failures = [];
for (const dep of DEPRECATED) {
  const needle = dep.token;
  let count = 0;
  const sites = [];
  for (const file of files) {
    const lines = fs.readFileSync(file, 'utf8').split('\n');
    lines.forEach((line, i) => {
      // count every occurrence on the line (a line may reference the token twice)
      const n = line.split(needle).length - 1;
      if (n > 0) {
        count += n;
        sites.push(`${path.relative(ROOT, file)}:${i + 1}`);
      }
    });
  }
  if (count > dep.baseline) {
    failures.push(
      `${needle}: ${count} usages (baseline ${dep.baseline}) — ${count - dep.baseline} NEW. ` +
        `Replace with ${dep.replacement} (DDR ${dep.ddr}).\n` +
        sites.slice(-Math.min(sites.length, 8)).map((s) => '      ' + s).join('\n')
    );
  } else if (count < dep.baseline) {
    failures.push(
      `${needle}: ${count} usages, below baseline ${dep.baseline} — consumers were migrated. ` +
        `Lower the baseline for "${needle}" to ${count} in scripts/check-deprecated-tokens.js to lock it in` +
        (count === 0 ? `, then remove the alias + this entry (deprecation complete).` : `.`)
    );
  }
}

if (failures.length) {
  console.error('\n✗ Deprecated-token check failed:\n');
  failures.forEach((f) => console.error('  • ' + f + '\n'));
  process.exit(1);
}
console.log(`✓ Deprecated-token check passed (${DEPRECATED.map((d) => `${d.token}=${d.baseline}`).join(', ')}).`);
