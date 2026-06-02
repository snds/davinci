import React, { useEffect } from 'react';
import '../../colors_and_type.css';
import '../../ui_kits/web_app/davinci.css';
import '@davinci/ui/styles/globals.css';

// Inject Google Fonts and Material Symbols via <link> tags
function injectFonts() {
  if (typeof document === 'undefined') return;

  const links = [
    'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap',
    'https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200',
  ];

  links.forEach((href) => {
    if (document.querySelector(`link[href="${href}"]`)) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    document.head.appendChild(link);
  });
}

injectFonts();

// Set default theme
if (typeof document !== 'undefined') {
  document.documentElement.setAttribute('data-theme', 'dark');
}

/** @type { import('@storybook/react').Preview } */
const preview = {
  globalTypes: {
    theme: {
      description: 'Global theme for components',
      defaultValue: 'dark',
      toolbar: {
        title: 'Theme',
        icon: 'circlehollow',
        items: [
          { value: 'dark', icon: 'circle', title: 'Dark' },
          { value: 'light', icon: 'circlehollow', title: 'Light' },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    theme: 'dark',
  },
  decorators: [
    (Story, context) => {
      const theme = context.globals.theme || 'dark';

      useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
      }, [theme]);

      return (
        <div
          style={{
            padding: '24px',
            minHeight: '100vh',
            background: 'var(--bg)',
            color: 'var(--fg)',
          }}
        >
          <Story />
        </div>
      );
    },
  ],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    options: {
      storySort: {
        order: [
          'Foundations',
          'Primitives',
          'Components', ['Panel', 'Post', 'Composer', 'NavList', 'TopNav'],
          'Patterns', ['Feed', 'LeftRail', 'RightRail', 'ProfilePage'],
          'shadcn',
        ],
      },
    },
  },
};

export default preview;
