#!/usr/bin/env node
/**
 * sync-shadcn.js
 *
 * Checks the shadcn/ui registry for new or updated components and
 * runs `npx shadcn@latest add --overwrite` for any that are out of date.
 *
 * Registry lockfile: packages/ui/.shadcn-registry.json
 *   Stores { componentName: { version, updatedAt } } for each installed component.
 *
 * Usage:
 *   node scripts/sync-shadcn.js [--check]   # --check = dry run, no writes
 *   node scripts/sync-shadcn.js [--force]   # re-add all installed components
 *
 * Workflow:
 *   1. Read installed list from lockfile
 *   2. Fetch registry index to get current component metadata
 *   3. Compare checksums / timestamps
 *   4. For updated components, run: npx shadcn@latest add <name> --overwrite --cwd packages/ui
 *   5. Write updated lockfile
 *   6. Run generate-stories and generate-docs for any changed components
 */

'use strict';

const fs      = require('fs');
const path    = require('path');
const https   = require('https');
const { execSync } = require('child_process');

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const ROOT          = path.resolve(__dirname, '..');
const UI_DIR        = path.join(ROOT, 'packages', 'ui');
const LOCKFILE      = path.join(UI_DIR, '.shadcn-registry.json');
const STYLE         = 'new-york';

// Registry base — shadcn serves per-style component manifests
const REGISTRY_BASE = 'https://ui.shadcn.com/r';

const CHECK_ONLY  = process.argv.includes('--check');
const FORCE       = process.argv.includes('--force');

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
          reject(new Error(`HTTP ${res.statusCode} for ${url}`));
          return;
        }
        try { resolve(JSON.parse(data)); }
        catch (e) { reject(new Error(`JSON parse error for ${url}: ${e.message}`)); }
      });
    }).on('error', reject);
  });
}

function readLockfile() {
  if (!fs.existsSync(LOCKFILE)) return { components: {}, fetchedAt: null };
  return JSON.parse(fs.readFileSync(LOCKFILE, 'utf8'));
}

function writeLockfile(data) {
  fs.writeFileSync(LOCKFILE, JSON.stringify(data, null, 2) + '\n');
}

function installedComponentNames(lock) {
  return Object.keys(lock.components || {});
}

function installedComponentFiles() {
  const uiDir = path.join(UI_DIR, 'src', 'components', 'ui');
  if (!fs.existsSync(uiDir)) return [];
  return fs.readdirSync(uiDir)
    .filter((f) => f.endsWith('.jsx') || f.endsWith('.tsx') || f.endsWith('.js') || f.endsWith('.ts'))
    .map((f) => path.basename(f, path.extname(f)));
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  console.log('╔══════════════════════════════════════════╗');
  console.log('║  Davinci — shadcn/ui sync                ║');
  console.log('╚══════════════════════════════════════════╝\n');

  // 1. Read lockfile + discover installed components from filesystem
  const lock = readLockfile();
  const fromFiles  = installedComponentFiles();
  const fromLock   = installedComponentNames(lock);

  // Union of both — lockfile is canonical, filesystem catches manual additions
  const installed = [...new Set([...fromLock, ...fromFiles])];

  if (installed.length === 0) {
    console.log('No shadcn components installed yet.');
    console.log('To add your first component:');
    console.log('  cd packages/ui && npx shadcn@latest add button\n');
    console.log('Then re-run this script to register it in the lockfile.\n');
    return;
  }

  console.log(`Installed components (${installed.length}): ${installed.join(', ')}\n`);

  // 2. Fetch registry metadata for each installed component
  console.log('Fetching registry metadata…');
  const registryData = {};
  const errors = [];

  await Promise.all(
    installed.map(async (name) => {
      try {
        const url = `${REGISTRY_BASE}/styles/${STYLE}/${name}.json`;
        registryData[name] = await fetchJson(url);
      } catch (e) {
        errors.push({ name, error: e.message });
      }
    })
  );

  if (errors.length > 0) {
    console.warn('⚠  Could not fetch registry data for:');
    errors.forEach(({ name, error }) => console.warn(`   ${name}: ${error}`));
  }

  // 3. Determine which components need updating
  const toUpdate = [];

  for (const name of installed) {
    const remote = registryData[name];
    if (!remote) continue;

    const localEntry = lock.components[name];

    // Use remote version field or file content hash for comparison
    const remoteVersion = remote.version || remote.meta?.version || null;

    if (FORCE || !localEntry || (remoteVersion && localEntry.version !== remoteVersion)) {
      toUpdate.push({ name, remoteVersion });
    }
  }

  if (toUpdate.length === 0) {
    console.log('✓ All components are up to date.\n');
    return;
  }

  console.log(`\nUpdates available for: ${toUpdate.map((c) => c.name).join(', ')}\n`);

  if (CHECK_ONLY) {
    console.log('(--check mode: no changes written)\n');
    return;
  }

  // 4. Re-add each outdated component
  const changed = [];

  for (const { name, remoteVersion } of toUpdate) {
    console.log(`  › Adding ${name}…`);
    try {
      execSync(
        `npx shadcn@latest add ${name} --overwrite --yes`,
        { cwd: UI_DIR, stdio: 'inherit' }
      );
      lock.components[name] = {
        version:     remoteVersion || 'unknown',
        updatedAt:   new Date().toISOString(),
        style:       STYLE,
      };
      changed.push(name);
      console.log(`  ✓ ${name}\n`);
    } catch (e) {
      console.error(`  ✗ Failed to add ${name}: ${e.message}\n`);
    }
  }

  // 5. Write updated lockfile
  if (changed.length > 0) {
    lock.fetchedAt = new Date().toISOString();
    writeLockfile(lock);
    console.log(`✓ Lockfile updated: ${LOCKFILE}\n`);
  }

  // 6. Trigger downstream generators for changed components
  if (changed.length > 0) {
    console.log('Running generators for changed components…');
    try {
      execSync(
        `node ${path.join(__dirname, 'generate-stories.js')} --components ${changed.join(',')}`,
        { cwd: ROOT, stdio: 'inherit' }
      );
      execSync(
        `node ${path.join(__dirname, 'generate-docs.js')} --components ${changed.join(',')}`,
        { cwd: ROOT, stdio: 'inherit' }
      );
    } catch (e) {
      console.warn('⚠  Generator step encountered errors:', e.message);
    }
  }

  console.log(`\n✓ Sync complete. ${changed.length} component(s) updated.\n`);
}

main().catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
