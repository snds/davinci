// @ts-check
const { themes } = require('prism-react-renderer');

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

  plugins: [tailwindPlugin],

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
            activeBaseRegex: '^/(primitives|shadcn/(button|input|textarea|label|badge|avatar|progress|slider|switch|checkbox|radio-group|toggle|toggle-group|separator|skeleton|aspect-ratio|scroll-area))',
            label: 'Primitives',
            position: 'left',
          },
          {
            to: '/shadcn',
            activeBaseRegex: '^/(shadcn(?!/(button|input|textarea|label|badge|avatar|progress|slider|switch|checkbox|radio-group|toggle|toggle-group|separator|skeleton|aspect-ratio|scroll-area))|components/empty-state)',
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
        theme: themes.dracula,
        darkTheme: themes.dracula,
        additionalLanguages: ['css', 'jsx', 'bash'],
      },
    }),
};

module.exports = config;
