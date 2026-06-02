#!/usr/bin/env node
/* Doc-embed guard.
 *
 * Every <StorybookEmbed story="…"> in the docs hard-codes a Storybook story
 * ID. When a story's title or export name changes, the embed silently points
 * at nothing and renders a blank "story not found" iframe — a broken preview
 * the docs build can't catch. This validates every embed ID against the IDs
 * actually derived from the story files.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const STORY_DIR = path.join(ROOT, 'storybook/src/stories');
const DOCS_DIR = path.join(ROOT, 'docs/docs');

function walk(dir, test, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, test, out);
    else if (test(e.name)) out.push(p);
  }
  return out;
}

// Mirror Storybook's id derivation. NOTE the asymmetry:
//  - the title (kind) is lowercased with non-alphanumerics collapsed, but
//    camelCase is NOT split: "Components/AlertDialog" → "components-alertdialog".
//  - the export name IS split on camelCase (via Storybook's storyNameFromExport
//    start-casing): "SixteenByNine" → "sixteen-by-nine".
function sanitizeKind(s) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}
function sanitizeName(s) {
  return s
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/([A-Za-z])([0-9])/g, '$1-$2')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Build the set of valid story IDs from the story files.
const validIds = new Set();
for (const file of walk(STORY_DIR, (n) => n.endsWith('.stories.jsx'))) {
  const src = fs.readFileSync(file, 'utf8');
  const titleMatch = src.match(/title:\s*['"]([^'"]+)['"]/);
  if (!titleMatch) continue;
  const kind = sanitizeKind(titleMatch[1]);
  for (const m of src.matchAll(/export\s+const\s+([A-Za-z0-9_]+)\s*=/g)) {
    validIds.add(`${kind}--${sanitizeName(m[1])}`);
  }
}

// Check every embed in the docs.
const violations = [];
for (const file of walk(DOCS_DIR, (n) => n.endsWith('.mdx') || n.endsWith('.md'))) {
  const src = fs.readFileSync(file, 'utf8');
  for (const m of src.matchAll(/<StorybookEmbed[^>]*\bstory=["']([^"']+)["']/g)) {
    if (!validIds.has(m[1])) {
      const line = src.slice(0, m.index).split('\n').length;
      violations.push(`${path.relative(ROOT, file)}:${line} — story="${m[1]}" has no matching Storybook story`);
    }
  }
}

if (violations.length) {
  console.error(`\n✗ Doc-embed check failed — ${violations.length} embed(s) point at a non-existent story:\n`);
  violations.forEach((v) => console.error('  ' + v));
  console.error('\nFix the story id (kebab of "Title/Path" + "--" + kebab of the export name), or add the story.\n');
  process.exit(1);
}
console.log(`✓ Doc-embed check passed (${validIds.size} stories, all embeds resolve).`);
