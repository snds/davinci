#!/usr/bin/env node
/**
 * generate-stories.js
 *
 * Auto-generates Storybook story files for shadcn/ui components
 * installed in packages/ui/src/components/ui/.
 *
 * Rules:
 *   • Never overwrites an existing story — only creates stubs for new components.
 *   • Story is created at: storybook/src/stories/shadcn/{ComponentName}.stories.jsx
 *   • Generated stories include: Default, with props controls, and a showcase render.
 *
 * Usage:
 *   node scripts/generate-stories.js                    # all missing stories
 *   node scripts/generate-stories.js --components btn   # specific component(s)
 *   node scripts/generate-stories.js --force            # overwrite existing
 *
 * Called automatically by sync-shadcn.js after installs.
 */

'use strict';

const fs   = require('fs');
const path = require('path');

// ---------------------------------------------------------------------------
// Paths
// ---------------------------------------------------------------------------

const ROOT          = path.resolve(__dirname, '..');
const UI_SRC        = path.join(ROOT, 'packages', 'ui', 'src', 'components', 'ui');
const STORIES_OUT   = path.join(ROOT, 'storybook', 'src', 'stories', 'shadcn');

const FORCE    = process.argv.includes('--force');
const argIdx   = process.argv.indexOf('--components');
const FILTER   = argIdx !== -1
  ? process.argv[argIdx + 1].split(',').map((s) => s.trim().toLowerCase())
  : null;

// ---------------------------------------------------------------------------
// Component metadata hints
// Enriches the generated story with known props/variants per component.
// Add entries here as new shadcn components are adopted.
// ---------------------------------------------------------------------------

const COMPONENT_HINTS = {
  button: {
    argTypes: {
      variant:  { control: 'select', options: ['default','destructive','outline','secondary','ghost','link'] },
      size:     { control: 'select', options: ['default','sm','lg','icon'] },
      disabled: { control: 'boolean' },
      children: { control: 'text' },
    },
    defaultArgs: { children: 'Button', variant: 'default' },
    showcase: `
  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
    <Component variant="default">Default</Component>
    <Component variant="secondary">Secondary</Component>
    <Component variant="destructive">Destructive</Component>
    <Component variant="outline">Outline</Component>
    <Component variant="ghost">Ghost</Component>
    <Component variant="link">Link</Component>
  </div>`,
  },
  badge: {
    argTypes: {
      variant:  { control: 'select', options: ['default','secondary','destructive','outline'] },
      children: { control: 'text' },
    },
    defaultArgs: { children: 'Badge', variant: 'default' },
    showcase: `
  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
    <Component>Default</Component>
    <Component variant="secondary">Secondary</Component>
    <Component variant="destructive">Destructive</Component>
    <Component variant="outline">Outline</Component>
  </div>`,
  },
  input: {
    argTypes: {
      type:        { control: 'text' },
      placeholder: { control: 'text' },
      disabled:    { control: 'boolean' },
    },
    defaultArgs: { placeholder: 'Enter text…' },
  },
  textarea: {
    argTypes: {
      placeholder: { control: 'text' },
      disabled:    { control: 'boolean' },
    },
    defaultArgs: { placeholder: 'Enter text…' },
  },
  card: {
    argTypes: {
      children: { control: 'text' },
    },
    defaultArgs: {},
    showcase: `
  <Component style={{ maxWidth: 360 }}>
    <ComponentHeader>
      <ComponentTitle>Card Title</ComponentTitle>
      <ComponentDescription>Card description goes here.</ComponentDescription>
    </ComponentHeader>
    <ComponentContent>
      <p>Card body content.</p>
    </ComponentContent>
    <ComponentFooter>
      <span>Footer</span>
    </ComponentFooter>
  </Component>`,
  },
  dialog: {
    argTypes: {},
    defaultArgs: {},
  },
  select: {
    argTypes: {
      disabled: { control: 'boolean' },
    },
    defaultArgs: {},
  },
  checkbox: {
    argTypes: {
      checked:  { control: 'boolean' },
      disabled: { control: 'boolean' },
    },
    defaultArgs: {},
  },
  switch: {
    argTypes: {
      checked:  { control: 'boolean' },
      disabled: { control: 'boolean' },
    },
    defaultArgs: {},
  },
  slider: {
    argTypes: {
      min:      { control: 'number' },
      max:      { control: 'number' },
      step:     { control: 'number' },
      disabled: { control: 'boolean' },
    },
    defaultArgs: { defaultValue: [50], max: 100 },
  },
  tabs: {
    argTypes: {},
    defaultArgs: {},
  },
  tooltip: {
    argTypes: {},
    defaultArgs: {},
  },
  avatar: {
    argTypes: {},
    defaultArgs: {},
  },
  alert: {
    argTypes: {
      variant:  { control: 'select', options: ['default','destructive'] },
      children: { control: 'text' },
    },
    defaultArgs: { variant: 'default' },
  },
  separator: {
    argTypes: {
      orientation: { control: 'select', options: ['horizontal','vertical'] },
    },
    defaultArgs: {},
  },
};

// ---------------------------------------------------------------------------
// Code generation
// ---------------------------------------------------------------------------

function toPascalCase(str) {
  return str
    .split(/[-_]/)
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join('');
}

function renderArgTypes(argTypes) {
  if (!argTypes || Object.keys(argTypes).length === 0) return '  argTypes: {},';
  const lines = Object.entries(argTypes).map(([key, cfg]) => {
    const cfgStr = JSON.stringify(cfg).replace(/"([^"]+)":/g, '$1:');
    return `    ${key}: ${cfgStr},`;
  });
  return `  argTypes: {\n${lines.join('\n')}\n  },`;
}

function renderDefaultArgs(args) {
  if (!args || Object.keys(args).length === 0) return '';
  const argsStr = JSON.stringify(args, null, 4)
    .split('\n')
    .map((l, i) => (i === 0 ? l : '  ' + l))
    .join('\n');
  return `\nexport const Default = {\n  args: ${argsStr},\n};\n`;
}

function generateStory(componentName, hint) {
  const pascal   = toPascalCase(componentName);
  const relPath  = `../../../../packages/ui/src/components/ui/${componentName}`;
  const argTypes = hint?.argTypes || {};
  const defArgs  = hint?.defaultArgs || {};
  const showcase = hint?.showcase || null;

  const showcaseExport = showcase
    ? `\nexport const Showcase = {\n  name: 'Showcase',\n  render: () => (${showcase}\n  ),\n};\n`
    : '';

  return `import React from 'react';
import { ${pascal} } from '${relPath}';

export default {
  title: 'shadcn/${pascal}',
  component: ${pascal},
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'shadcn/ui ${pascal} component, themed with Davinci tokens.',
      },
    },
  },
${renderArgTypes(argTypes)}
};
${renderDefaultArgs(defArgs)}${showcaseExport}`;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

function main() {
  console.log('╔══════════════════════════════════════════╗');
  console.log('║  Davinci — generate Storybook stories    ║');
  console.log('╚══════════════════════════════════════════╝\n');

  if (!fs.existsSync(UI_SRC)) {
    console.log(`No components found at ${UI_SRC}`);
    console.log('Run `npx shadcn@latest add <component>` inside packages/ui first.\n');
    return;
  }

  if (!fs.existsSync(STORIES_OUT)) {
    fs.mkdirSync(STORIES_OUT, { recursive: true });
  }

  const componentFiles = fs
    .readdirSync(UI_SRC)
    .filter((f) => /\.(jsx|tsx|js|ts)$/.test(f));

  let created = 0;
  let skipped = 0;

  for (const file of componentFiles) {
    const name = path.basename(file, path.extname(file));

    if (FILTER && !FILTER.includes(name.toLowerCase())) {
      continue;
    }

    const storyPath = path.join(STORIES_OUT, `${toPascalCase(name)}.stories.jsx`);

    if (fs.existsSync(storyPath) && !FORCE) {
      console.log(`  – ${name}: story exists (skip)`);
      skipped++;
      continue;
    }

    const hint    = COMPONENT_HINTS[name.toLowerCase()];
    const content = generateStory(name, hint);

    fs.writeFileSync(storyPath, content);
    console.log(`  ✓ ${name}: story created → ${path.relative(ROOT, storyPath)}`);
    created++;
  }

  console.log(`\n✓ Done. ${created} created, ${skipped} skipped.\n`);

  if (created > 0) {
    updateBarrelExport();
  }
}

function updateBarrelExport() {
  const indexPath = path.join(
    ROOT, 'packages', 'ui', 'src', 'index.js'
  );

  const uiDir = path.join(ROOT, 'packages', 'ui', 'src', 'components', 'ui');
  if (!fs.existsSync(uiDir)) return;

  const exports = fs
    .readdirSync(uiDir)
    .filter((f) => /\.(jsx|tsx|js|ts)$/.test(f))
    .map((f) => {
      const base   = path.basename(f, path.extname(f));
      const pascal = toPascalCase(base);
      return `export * from './components/ui/${base}.js';`;
    });

  const content = [
    '/* Auto-generated barrel — do not edit manually */',
    '/* Regenerate with: node scripts/generate-stories.js */',
    '',
    "export { cn } from './lib/utils.js';",
    '',
    ...exports,
    '',
  ].join('\n');

  fs.writeFileSync(indexPath, content);
  console.log(`✓ Barrel updated: ${path.relative(ROOT, indexPath)}\n`);
}

main();
