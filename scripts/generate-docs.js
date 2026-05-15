#!/usr/bin/env node
/**
 * generate-docs.js
 *
 * Auto-generates Docusaurus MDX documentation stubs for shadcn/ui
 * components installed in packages/ui/src/components/ui/.
 *
 * Rules:
 *   • Never overwrites existing docs — only creates stubs for new components.
 *   • Doc is created at: docs/docs/shadcn/{component-name}.mdx
 *   • The stub includes: frontmatter, description, import snippet, props table,
 *     and a live preview placeholder.
 *
 * Usage:
 *   node scripts/generate-docs.js                      # all missing docs
 *   node scripts/generate-docs.js --components button  # specific component(s)
 *   node scripts/generate-docs.js --force              # overwrite existing
 *
 * Called automatically by sync-shadcn.js after installs.
 */

'use strict';

const fs   = require('fs');
const path = require('path');

// ---------------------------------------------------------------------------
// Paths
// ---------------------------------------------------------------------------

const ROOT       = path.resolve(__dirname, '..');
const UI_SRC     = path.join(ROOT, 'packages', 'ui', 'src', 'components', 'ui');
const DOCS_OUT   = path.join(ROOT, 'docs', 'docs', 'shadcn');

const FORCE  = process.argv.includes('--force');
const argIdx = process.argv.indexOf('--components');
const FILTER = argIdx !== -1
  ? process.argv[argIdx + 1].split(',').map((s) => s.trim().toLowerCase())
  : null;

// ---------------------------------------------------------------------------
// Component metadata
// Provides richer descriptions and usage guidance per component.
// ---------------------------------------------------------------------------

const COMPONENT_META = {
  button: {
    description: 'Triggers an action or event, such as submitting a form, opening a dialog, cancelling an action, or performing a delete operation.',
    category: 'Primitives',
    radixPrimitive: null,
    variants: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'],
    sizes: ['default', 'sm', 'lg', 'icon'],
  },
  badge: {
    description: 'Displays a short status descriptor for UI elements.',
    category: 'Primitives',
    radixPrimitive: null,
    variants: ['default', 'secondary', 'destructive', 'outline'],
  },
  input: {
    description: 'Displays a form input field or a component that looks like an input field.',
    category: 'Forms',
    radixPrimitive: null,
  },
  textarea: {
    description: 'Displays a multi-line text input control.',
    category: 'Forms',
    radixPrimitive: null,
  },
  card: {
    description: 'Displays a card with header, content, and footer sections.',
    category: 'Layout',
    radixPrimitive: null,
    subComponents: ['CardHeader', 'CardTitle', 'CardDescription', 'CardContent', 'CardFooter'],
  },
  dialog: {
    description: 'A window overlaid on the primary window. Renders content that requires interaction.',
    category: 'Overlays',
    radixPrimitive: '@radix-ui/react-dialog',
    subComponents: ['DialogTrigger', 'DialogContent', 'DialogHeader', 'DialogTitle', 'DialogDescription', 'DialogFooter'],
  },
  select: {
    description: 'Displays a list of options for the user to pick from — triggered by a button.',
    category: 'Forms',
    radixPrimitive: '@radix-ui/react-select',
    subComponents: ['SelectTrigger', 'SelectValue', 'SelectContent', 'SelectItem', 'SelectLabel', 'SelectSeparator'],
  },
  checkbox: {
    description: 'A control that allows the user to toggle between checked and not checked.',
    category: 'Forms',
    radixPrimitive: '@radix-ui/react-checkbox',
  },
  switch: {
    description: 'A control that allows the user to toggle between checked and not checked.',
    category: 'Forms',
    radixPrimitive: '@radix-ui/react-switch',
  },
  slider: {
    description: 'An input where the user selects a value from within a given range.',
    category: 'Forms',
    radixPrimitive: '@radix-ui/react-slider',
  },
  tabs: {
    description: 'A set of layered sections of content — known as tab panels — that are displayed one at a time.',
    category: 'Navigation',
    radixPrimitive: '@radix-ui/react-tabs',
    subComponents: ['TabsList', 'TabsTrigger', 'TabsContent'],
  },
  tooltip: {
    description: 'A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.',
    category: 'Overlays',
    radixPrimitive: '@radix-ui/react-tooltip',
    subComponents: ['TooltipProvider', 'TooltipTrigger', 'TooltipContent'],
  },
  avatar: {
    description: "An image element with a fallback for representing the user.",
    category: 'Primitives',
    radixPrimitive: '@radix-ui/react-avatar',
    subComponents: ['AvatarImage', 'AvatarFallback'],
  },
  alert: {
    description: 'Displays a callout for user attention.',
    category: 'Feedback',
    radixPrimitive: null,
    variants: ['default', 'destructive'],
    subComponents: ['AlertTitle', 'AlertDescription'],
  },
  separator: {
    description: 'Visually or semantically separates content.',
    category: 'Layout',
    radixPrimitive: '@radix-ui/react-separator',
  },
  sheet: {
    description: 'Extends the Dialog component to display content that complements the main content of the screen.',
    category: 'Overlays',
    radixPrimitive: '@radix-ui/react-dialog',
  },
  popover: {
    description: 'Displays rich content in a portal, triggered by a button.',
    category: 'Overlays',
    radixPrimitive: '@radix-ui/react-popover',
  },
  dropdown_menu: {
    description: 'Displays a menu to the user — such as a set of actions or functions — triggered by a button.',
    category: 'Navigation',
    radixPrimitive: '@radix-ui/react-dropdown-menu',
  },
  table: {
    description: 'A responsive table component.',
    category: 'Data Display',
    radixPrimitive: null,
  },
};

// ---------------------------------------------------------------------------
// Template
// ---------------------------------------------------------------------------

function toPascalCase(str) {
  return str.split(/[-_]/).map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join('');
}

function toTitleCase(str) {
  return str.split(/[-_]/).map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');
}

function generateDoc(componentName) {
  const pascal   = toPascalCase(componentName);
  const title    = toTitleCase(componentName);
  const meta     = COMPONENT_META[componentName.toLowerCase()] || {};
  const category = meta.category || 'Components';
  const desc     = meta.description || `The ${title} component from shadcn/ui, themed with Davinci design tokens.`;
  const radix    = meta.radixPrimitive;
  const subs     = meta.subComponents || [];
  const variants = meta.variants || [];

  const importNames = [pascal, ...subs].join(', ');

  const variantsSection = variants.length > 0
    ? `\n## Variants\n\n| Variant | Description |\n|---------|-------------|\n${variants.map((v) => `| \`${v}\` | — |`).join('\n')}\n`
    : '';

  const subSection = subs.length > 0
    ? `\n## Sub-components\n\n${subs.map((s) => `- \`${s}\``).join('\n')}\n`
    : '';

  const radixSection = radix
    ? `\n## Primitive\n\nBuilt on [${radix}](https://radix-ui.com).\n`
    : '';

  return `---
title: ${title}
description: ${desc}
category: shadcn/${category}
sidebar_position: 50
---

import { ${importNames} } from '@davinci/ui/components/ui/${componentName}';

# ${title}

${desc}
${radixSection}${variantsSection}
## Usage

\`\`\`jsx
import { ${importNames} } from '@davinci/ui/components/ui/${componentName}';

export default function Example() {
  return (
    <${pascal}>
      {/* content */}
    </${pascal}>
  );
}
\`\`\`
${subSection}
## Theming

This component inherits all values from the Davinci token system via the
shadcn bridge layer (\`@davinci/tokens/shadcn-bridge.css\`). No per-component
overrides are required — change Davinci semantic tokens to update the appearance
system-wide.

| shadcn var | Davinci token | Role |
|------------|---------------|------|
| \`--primary\` | \`--accent\` | Primary action color |
| \`--background\` | \`--bg\` | Page background |
| \`--foreground\` | \`--fg\` | Default text |
| \`--border\` | \`--border\` | Borders and dividers |
| \`--ring\` | \`--border-focus\` | Focus ring |

## Storybook

View live examples in Storybook under **shadcn › ${pascal}**.
`;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

function main() {
  console.log('╔══════════════════════════════════════════╗');
  console.log('║  Davinci — generate docs stubs           ║');
  console.log('╚══════════════════════════════════════════╝\n');

  if (!fs.existsSync(UI_SRC)) {
    console.log(`No components found at ${UI_SRC}`);
    console.log('Run `npx shadcn@latest add <component>` inside packages/ui first.\n');
    return;
  }

  if (!fs.existsSync(DOCS_OUT)) {
    fs.mkdirSync(DOCS_OUT, { recursive: true });

    // Write a category index so Docusaurus knows the sidebar label
    const indexContent = `---
title: shadcn/ui Components
sidebar_label: shadcn Components
---

# shadcn/ui Components

These components are sourced from [shadcn/ui](https://ui.shadcn.com) and themed
with the Davinci design token system. They are installed via \`npx shadcn@latest add\`
into \`packages/ui/src/components/ui/\`.

## Adding a component

\`\`\`bash
cd packages/ui
npx shadcn@latest add <component-name>
# Then regenerate stories and docs:
cd ../..
node scripts/generate-stories.js
node scripts/generate-docs.js
\`\`\`
`;
    fs.writeFileSync(path.join(DOCS_OUT, 'index.mdx'), indexContent);
    console.log('  ✓ Created shadcn index page\n');
  }

  const componentFiles = fs
    .readdirSync(UI_SRC)
    .filter((f) => /\.(jsx|tsx|js|ts)$/.test(f));

  let created = 0;
  let skipped = 0;

  for (const file of componentFiles) {
    const name    = path.basename(file, path.extname(file));

    if (FILTER && !FILTER.includes(name.toLowerCase())) {
      continue;
    }

    const docPath = path.join(DOCS_OUT, `${name}.mdx`);

    if (fs.existsSync(docPath) && !FORCE) {
      console.log(`  – ${name}: doc exists (skip)`);
      skipped++;
      continue;
    }

    const content = generateDoc(name);
    fs.writeFileSync(docPath, content);
    console.log(`  ✓ ${name}: doc created → ${path.relative(ROOT, docPath)}`);
    created++;
  }

  console.log(`\n✓ Done. ${created} created, ${skipped} skipped.\n`);
}

main();
