// @ts-check
const { themes } = require('prism-react-renderer');

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

  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  customFields: {
    storybookUrl: 'http://localhost:6006',
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
        respectPrefersColorScheme: true,
      },

      navbar: {
        title: 'Davinci',
        logo: {
          alt: 'Davinci Logo',
          src: 'img/logo.svg',
          srcDark: 'img/logo.svg',
        },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'docs',
            position: 'left',
            label: 'Foundations',
            to: '/foundations/colors',
          },
          {
            type: 'docSidebar',
            sidebarId: 'docs',
            position: 'left',
            label: 'Primitives',
            to: '/primitives/buttons',
          },
          {
            type: 'docSidebar',
            sidebarId: 'docs',
            position: 'left',
            label: 'Components',
            to: '/components/panel',
          },
          {
            type: 'docSidebar',
            sidebarId: 'docs',
            position: 'left',
            label: 'Patterns',
            to: '/patterns/feed',
          },
          {
            href: 'http://localhost:6006',
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
              { label: 'Primitives', to: '/primitives/buttons' },
              { label: 'Components', to: '/components/panel' },
              { label: 'Patterns', to: '/patterns/feed' },
            ],
          },
          {
            title: 'Resources',
            items: [
              { label: 'Storybook', href: 'http://localhost:6006' },
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
