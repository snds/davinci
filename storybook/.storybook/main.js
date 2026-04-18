const path = require('path');

/** @type { import('@storybook/react-vite').StorybookConfig } */
const config = {
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
    viteConfig.resolve = viteConfig.resolve || {};
    viteConfig.resolve.alias = {
      ...viteConfig.resolve.alias,
      '@': path.resolve(__dirname, '../src'),
      '@tokens': path.resolve(__dirname, '../../colors_and_type.css'),
    };
    // Allow Vite to serve the project root (for CSS assets like noise textures)
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
