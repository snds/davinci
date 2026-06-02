#!/usr/bin/env node
/**
 * check-updates.js
 *
 * Checks whether Docusaurus and TinaCMS packages have safe (non-breaking)
 * updates available. Fetches the latest version from the npm registry and
 * scans the GitHub changelog for BREAKING CHANGE markers or major-version bumps.
 *
 * Usage:
 *   node scripts/check-updates.js
 *
 * Run this before updating either dependency group in docs/package.json.
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const DOCS_PKG_PATH = path.resolve(__dirname, '../docs/package.json');

const GROUPS = [
  {
    name: 'Docusaurus',
    packages: [
      '@docusaurus/core',
      '@docusaurus/preset-classic',
      '@docusaurus/module-type-aliases',
    ],
    changelogUrl:
      'https://raw.githubusercontent.com/facebook/docusaurus/main/CHANGELOG.md',
  },
  {
    name: 'TinaCMS',
    packages: ['tinacms', '@tinacms/cli'],
    changelogUrl:
      'https://raw.githubusercontent.com/tinacms/tinacms/main/packages/tinacms/CHANGELOG.md',
  },
];

// ── helpers ──────────────────────────────────────────────────────────────────

function get(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, { headers: { 'User-Agent': 'davinci-check-updates' } }, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          return get(res.headers.location).then(resolve).catch(reject);
        }
        let body = '';
        res.on('data', (c) => (body += c));
        res.on('end', () => resolve(body));
      })
      .on('error', reject);
  });
}

function majorOf(version) {
  return parseInt((version || '0').replace(/^[^\d]*/, '').split('.')[0], 10);
}

function stripRange(version) {
  return (version || '').replace(/^[\^~>=<\s]+/, '').split(/\s/)[0];
}

async function latestVersion(pkg) {
  try {
    const body = await get(`https://registry.npmjs.org/${encodeURIComponent(pkg)}/latest`);
    return JSON.parse(body).version;
  } catch {
    return null;
  }
}

async function changelogHasBreaking(url, fromVer, toVer) {
  if (majorOf(toVer) > majorOf(fromVer)) return true;
  try {
    const text = await get(url);
    return /BREAKING[ -]CHANGE|⚠️\s*BREAKING|### Breaking/i.test(text);
  } catch {
    return false;
  }
}

// ── main ─────────────────────────────────────────────────────────────────────

async function main() {
  const docsPkg = JSON.parse(fs.readFileSync(DOCS_PKG_PATH, 'utf8'));
  const installed = { ...docsPkg.dependencies, ...docsPkg.devDependencies };

  const RESET  = '\x1b[0m';
  const BOLD   = '\x1b[1m';
  const GREEN  = '\x1b[32m';
  const YELLOW = '\x1b[33m';
  const RED    = '\x1b[31m';
  const DIM    = '\x1b[2m';

  console.log(`\n${BOLD}Checking for updates…${RESET}\n`);

  for (const group of GROUPS) {
    console.log(`${BOLD}── ${group.name} ──────────────────────────────────────${RESET}`);
    const safeUpdates = [];

    for (const pkg of group.packages) {
      const rawCurrent = installed[pkg];
      if (!rawCurrent) {
        console.log(`  ${DIM}${pkg}  (not installed)${RESET}`);
        continue;
      }
      const current = stripRange(rawCurrent);
      const latest  = await latestVersion(pkg);

      if (!latest) {
        console.log(`  ${YELLOW}?${RESET}  ${pkg}  ${DIM}(could not fetch latest)${RESET}`);
        continue;
      }

      if (latest === current) {
        console.log(`  ${GREEN}✓${RESET}  ${pkg}  ${DIM}${current} (up to date)${RESET}`);
        continue;
      }

      const breaking = await changelogHasBreaking(group.changelogUrl, current, latest);
      if (breaking) {
        console.log(
          `  ${RED}✗${RESET}  ${pkg}  ${current} → ${BOLD}${latest}${RESET}  ${RED}[BREAKING — do not update automatically]${RESET}`
        );
      } else {
        console.log(
          `  ${GREEN}↑${RESET}  ${pkg}  ${current} → ${BOLD}${latest}${RESET}  ${GREEN}[safe to update]${RESET}`
        );
        safeUpdates.push(`${pkg}@latest`);
      }
    }

    if (safeUpdates.length > 0) {
      console.log(
        `\n  ${DIM}To apply safe updates:${RESET}\n` +
        `  npm install ${safeUpdates.join(' ')} --workspace docs\n`
      );
    } else {
      console.log();
    }
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
