// @ts-check
const { themes } = require('prism-react-renderer');

// Single source of truth for the Primitives ↔ Components split. Both live under
// /shadcn/*, so the navbar active-state is decided by this slug list rather
// than two hand-kept regexes that could drift. Add a new primitive slug here
// once and both regexes below update together.
const PRIMITIVE_SLUGS = [
  'button', 'input', 'textarea', 'label', 'badge', 'avatar', 'progress',
  'slider', 'switch', 'checkbox', 'radio-group', 'toggle', 'toggle-group',
  'separator', 'skeleton', 'aspect-ratio', 'scroll-area',
];
const PRIMITIVE_SHADCN = PRIMITIVE_SLUGS.join('|');
const PRIMITIVES_ACTIVE_REGEX = `^/(primitives|shadcn/(${PRIMITIVE_SHADCN}))`;
const COMPONENTS_ACTIVE_REGEX = `^/(shadcn(?!/(${PRIMITIVE_SHADCN}))|components/empty-state)`;

/** Inline Docusaurus plugin that wires @tailwindcss/postcss into the CSS pipeline. */
async function tailwindPlugin() {
  return {
    name: 'docusaurus-tailwindcss',
    configurePostCss(postcssOptions) {
      postcssOptions.plugins.push(require('@tailwindcss/postcss'));
      return postcssOptions;
    },
  };
}

/**
 * Drops Docusaurus's webpackbar progress plugin.
 *
 * webpackbar's WebpackBarPlugin extends webpack's ProgressPlugin and stores
 * its own options ({name, color, reporters, ...}) on `this.options`. On the
 * compiler `validate` hook, webpack re-validates `this.options` against the
 * strict ProgressPlugin schema, which rejects those extra keys with a
 * ValidationError. This surfaces on clean `npm ci` installs (CI) while a
 * warm/incremental dev tree happens to skip the strict path. The progress
 * bar is cosmetic, so removing the plugin is safe and makes the build
 * deterministic across environments.
 */
function dropProgressBarPlugin() {
  return {
    name: 'davinci-drop-webpackbar',
    configureWebpack(config) {
      if (Array.isArray(config.plugins)) {
        config.plugins = config.plugins.filter(
          (p) => !p || p.constructor?.name !== 'WebpackBarPlugin',
        );
      }
      return {};
    },
  };
}

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Davinci Design System',
  tagline: 'Foundations to patterns for the Davinci platform',
  favicon: 'img/favicon.ico',

  url: 'https://snds.github.io',
  baseUrl: process.env.BASE_URL || '/davinci/',

  organizationName: 'snds',
  projectName: 'davinci',
  deploymentBranch: 'gh-pages',
  trailingSlash: false,

  plugins: [tailwindPlugin, dropProgressBarPlugin],

  stylesheets: [
    'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap',
    'https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200',
  ],

  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  customFields: {
    // Override at build time: STORYBOOK_URL=https://storybook.example.com npm run build
    storybookUrl: process.env.STORYBOOK_URL || 'http://localhost:6006',
  },

  markdown: {
    mdx1Compat: {
      comments: false,
      admonitions: false,
      headingIds: false,
    },
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          routeBasePath: '/',
          editUrl: 'https://github.com/snds/davinci/tree/main/project/docs/',
        },
        blog: false,
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      colorMode: {
        defaultMode: 'dark',
        disableSwitch: false,
        respectPrefersColorScheme: false,
      },

      tableOfContents: {
        minHeadingLevel: 2,
        maxHeadingLevel: 2,
      },

      navbar: {
        title: 'Davinci',
        logo: {
          alt: 'Davinci Logo',
          src: 'img/logo.svg',
          srcDark: 'img/logo.svg',
        },
        items: [
          { to: '/foundations/colors', activeBasePath: '/foundations', label: 'Foundations', position: 'left' },
          {
            to: '/primitives/icons',
            activeBaseRegex: PRIMITIVES_ACTIVE_REGEX,
            label: 'Primitives',
            position: 'left',
          },
          {
            to: '/shadcn',
            activeBaseRegex: COMPONENTS_ACTIVE_REGEX,
            label: 'Components',
            position: 'left',
          },
          {
            to: '/components/panel',
            activeBaseRegex: '^/(components/(?:panel|post|composer|navigation)|patterns)',
            label: 'Patterns',
            position: 'left',
          },
          {
            href: process.env.DEMO_URL || 'http://localhost:3001',
            label: 'Live Demo',
            position: 'right',
          },
          {
            href: process.env.STORYBOOK_URL || 'http://localhost:6006',
            label: 'Storybook',
            position: 'right',
          },
          {
            href: 'https://github.com/snds/davinci',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },

      footer: {
        style: 'dark',
        links: [
          {
            title: 'Design System',
            items: [
              { label: 'Foundations', to: '/foundations/colors' },
              { label: 'Primitives', to: '/primitives/icons' },
              { label: 'Components', to: '/shadcn' },
              { label: 'Patterns', to: '/patterns/feed' },
            ],
          },
          {
            title: 'Resources',
            items: [
              { label: 'Storybook', href: process.env.STORYBOOK_URL || 'http://localhost:6006' },
              { label: 'GitHub', href: 'https://github.com/snds/davinci' },
            ],
          },
        ],
        copyright: `Davinci Design System — ${new Date().getFullYear()}`,
      },

      prism: {
        // Light mode needs a light syntax theme: Dracula's off-white foreground
        // (#f8f8f2) is invisible on the near-white `--bg-subtle` code surface.
        // Prism swaps theme↔darkTheme on html[data-theme]; the code background is
        // already theme-aware, so dark mode keeps Dracula.
        theme: themes.github,
        darkTheme: themes.dracula,
        additionalLanguages: ['css', 'jsx', 'bash'],
      },
    }),
};

module.exports = config;
