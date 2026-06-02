#!/usr/bin/env node
/**
 * sync.js — Davinci Design System master sync orchestrator
 *
 * Runs the full update pipeline in sequence:
 *   1. sync-radix    → check + upgrade @radix-ui/colors, regenerate palette.css
 *   2. sync-shadcn   → check + upgrade installed shadcn components
 *   3. generate-stories → create missing Storybook stories for new components
 *   4. generate-docs    → create missing MDX doc stubs for new components
 *
 * Usage:
 *   node scripts/sync.js              # full sync
 *   node scripts/sync.js --check      # dry run (no writes)
 *   node scripts/sync.js --radix-only # skip shadcn steps
 *   node scripts/sync.js --shadcn-only # skip radix steps
 *
 * Designed to run in CI via .github/workflows/sync-design-system.yml
 */

'use strict';

const { execSync } = require('child_process');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

const CHECK     = process.argv.includes('--check')      ? '--check' : '';
const RADIX_ONLY  = process.argv.includes('--radix-only');
const SHADCN_ONLY = process.argv.includes('--shadcn-only');

const steps = [];

if (!SHADCN_ONLY) {
  steps.push({
    label: '1/4  Radix Colors',
    cmd:   `node ${path.join(__dirname, 'sync-radix.js')} ${CHECK}`.trim(),
  });
}

if (!RADIX_ONLY) {
  steps.push({
    label: '2/4  shadcn/ui components',
    cmd:   `node ${path.join(__dirname, 'sync-shadcn.js')} ${CHECK}`.trim(),
  });

  steps.push({
    label: '3/4  Storybook stories',
    cmd:   `node ${path.join(__dirname, 'generate-stories.js')}`,
  });

  steps.push({
    label: '4/4  Documentation stubs',
    cmd:   `node ${path.join(__dirname, 'generate-docs.js')}`,
  });
}

// ---------------------------------------------------------------------------

console.log('');
console.log('╔══════════════════════════════════════════╗');
console.log('║  Davinci Design System — full sync       ║');
if (CHECK) {
  console.log('║  MODE: check only (no writes)            ║');
}
console.log('╚══════════════════════════════════════════╝');
console.log('');

const results = [];

for (const step of steps) {
  console.log(`\n${'─'.repeat(46)}`);
  console.log(`  ${step.label}`);
  console.log('─'.repeat(46));

  const start = Date.now();
  try {
    execSync(step.cmd, { cwd: ROOT, stdio: 'inherit' });
    const ms = Date.now() - start;
    results.push({ label: step.label, ok: true, ms });
  } catch (e) {
    const ms = Date.now() - start;
    results.push({ label: step.label, ok: false, ms, error: e.message });
    console.error(`\n✗ Step failed: ${step.label}`);
    // Continue remaining steps even if one fails
  }
}

// ---------------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------------

console.log('\n');
console.log('╔══════════════════════════════════════════╗');
console.log('║  Sync summary                            ║');
console.log('╚══════════════════════════════════════════╝');

for (const r of results) {
  const icon   = r.ok ? '✓' : '✗';
  const timing = `${(r.ms / 1000).toFixed(1)}s`;
  console.log(`  ${icon}  ${r.label.padEnd(32)} ${timing}`);
  if (!r.ok) console.log(`     Error: ${r.error}`);
}

const failed = results.filter((r) => !r.ok).length;
if (failed > 0) {
  console.log(`\n  ${failed} step(s) failed.\n`);
  process.exit(1);
} else {
  console.log('\n  All steps completed successfully.\n');
}
