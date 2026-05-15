const path = require('path');

/** @type { import('@storybook/react-vite').StorybookConfig } */
const config = {
  // Includes both Davinci-native stories and auto-generated shadcn stories
  stories: ['../src/**/*.stories.@(jsx|tsx|js|ts)'],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-a11y',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  viteFinal: async (viteConfig) => {
    // Lazy-load @tailwindcss/vite so storybook still works before packages/ui is installed
    let tailwindPlugin;
    try {
      const tw = await import('@tailwindcss/vite');
      tailwindPlugin = tw.default();
    } catch (_) {
      // @tailwindcss/vite not yet installed — shadcn stories will work once packages/ui is set up
    }

    if (tailwindPlugin) {
      viteConfig.plugins = [...(viteConfig.plugins || []), tailwindPlugin];
    }

    viteConfig.resolve = viteConfig.resolve || {};
    viteConfig.resolve.alias = {
      ...viteConfig.resolve.alias,
      '@':           path.resolve(__dirname, '../src'),
      '@tokens':     path.resolve(__dirname, '../../colors_and_type.css'),
      // Workspace package aliases — resolve to source for hot reload
      '@davinci/tokens': path.resolve(__dirname, '../../packages/tokens'),
      '@davinci/ui':     path.resolve(__dirname, '../../packages/ui/src'),
    };

    // Allow Vite to serve the project root (CSS assets, workspace packages)
    viteConfig.server = viteConfig.server || {};
    viteConfig.server.fs = viteConfig.server.fs || {};
    viteConfig.server.fs.allow = [
      ...(viteConfig.server.fs.allow || []),
      path.resolve(__dirname, '../../../'),
    ];

    return viteConfig;
  },
};

module.exports = config;
