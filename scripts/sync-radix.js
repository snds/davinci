#!/usr/bin/env node
/**
 * sync-radix.js
 *
 * Checks npm for the latest @radix-ui/colors version and, if newer than
 * the currently installed version, upgrades and regenerates palette.css.
 *
 * Usage:
 *   node scripts/sync-radix.js [--check]   # dry run
 *   node scripts/sync-radix.js [--force]   # regenerate even if version unchanged
 */

'use strict';

const fs   = require('fs');
const path = require('path');
const https = require('https');
const { execSync } = require('child_process');

// ---------------------------------------------------------------------------
// Paths
// ---------------------------------------------------------------------------

const ROOT       = path.resolve(__dirname, '..');
const RADIX_DIR  = path.join(ROOT, 'storybook', 'node_modules', '@radix-ui', 'colors');
const PKG_PATH   = path.join(RADIX_DIR, 'package.json');

const CHECK_ONLY = process.argv.includes('--check');
const FORCE      = process.argv.includes('--force');

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'davinci-sync/1.0' } }, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        if (res.statusCode !== 200) {
          reject(new Error(`HTTP ${res.statusCode}`));
          return;
        }
        try { resolve(JSON.parse(data)); }
        catch (e) { reject(e); }
      });
    }).on('error', reject);
  });
}

function installedVersion() {
  if (!fs.existsSync(PKG_PATH)) return null;
  return JSON.parse(fs.readFileSync(PKG_PATH, 'utf8')).version;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  console.log('╔══════════════════════════════════════════╗');
  console.log('║  Davinci — sync @radix-ui/colors         ║');
  console.log('╚══════════════════════════════════════════╝\n');

  const current = installedVersion();
  console.log(`  Installed : ${current || '(not installed)'}`);

  // Fetch latest from npm registry
  let latest;
  try {
    const data = await fetchJson('https://registry.npmjs.org/@radix-ui/colors/latest');
    latest = data.version;
  } catch (e) {
    console.error('  ✗ Could not reach npm registry:', e.message);
    process.exit(1);
  }

  console.log(`  Latest    : ${latest}\n`);

  if (!FORCE && current === latest) {
    console.log('✓ @radix-ui/colors is up to date. No regeneration needed.\n');
    return;
  }

  if (current !== latest) {
    console.log(`Update available: ${current} → ${latest}`);
  }

  if (CHECK_ONLY) {
    console.log('(--check mode: no changes written)\n');
    return;
  }

  // Install/update in storybook (where the Radix CSS files live)
  console.log('\nUpdating @radix-ui/colors…');
  try {
    execSync(
      `npm install --save-dev @radix-ui/colors@${latest}`,
      { cwd: path.join(ROOT, 'storybook'), stdio: 'inherit' }
    );
    console.log(`✓ Installed @radix-ui/colors@${latest}\n`);
  } catch (e) {
    console.error('✗ npm install failed:', e.message);
    process.exit(1);
  }

  // Regenerate palette.css
  console.log('Regenerating palette.css…');
  try {
    execSync(
      `node ${path.join(__dirname, 'generate-palette.js')}`,
      { cwd: ROOT, stdio: 'inherit' }
    );
    console.log('✓ palette.css regenerated\n');
  } catch (e) {
    console.error('✗ Palette generation failed:', e.message);
    process.exit(1);
  }

  console.log(`✓ @radix-ui/colors updated to v${latest}.\n`);
}

main().catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
