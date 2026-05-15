/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  docs: [
    'intro',

    // -------------------------------------------------------------------------
    // Foundations — design tokens
    // -------------------------------------------------------------------------
    {
      type: 'category',
      label: 'Foundations',
      items: [
        'foundations/colors',
        'foundations/typography',
        'foundations/spacing',
        'foundations/shadows',
        'foundations/radii',
        'foundations/breakpoints',
      ],
    },

    // -------------------------------------------------------------------------
    // Primitives — atomic building blocks + layout utilities
    // -------------------------------------------------------------------------
    {
      type: 'category',
      label: 'Primitives',
      items: [
        // Davinci-specific (not in shadcn)
        'primitives/icons',

        // shadcn atomic components
        'shadcn/button',
        'shadcn/input',
        'shadcn/textarea',
        'shadcn/label',
        'shadcn/badge',
        'shadcn/avatar',
        'shadcn/progress',
        'shadcn/slider',
        'shadcn/switch',
        'shadcn/checkbox',
        'shadcn/radio-group',
        'shadcn/toggle',
        'shadcn/toggle-group',

        // Structural / layout utilities
        {
          type: 'category',
          label: 'Utilities',
          items: [
            'shadcn/separator',
            'shadcn/skeleton',
            'shadcn/aspect-ratio',
            'shadcn/scroll-area',
          ],
        },
      ],
    },

    // -------------------------------------------------------------------------
    // Components — composed, interactive, multi-part
    // -------------------------------------------------------------------------
    {
      type: 'category',
      label: 'Components',
      link: { type: 'doc', id: 'shadcn/index' },
      items: [
        {
          type: 'category',
          label: 'Utilities',
          items: [
            'shadcn/resizable',
            'shadcn/collapsible',
          ],
        },
        'shadcn/card',
        'shadcn/dialog',
        'shadcn/alert-dialog',
        'shadcn/sheet',
        'shadcn/drawer',
        'shadcn/popover',
        'shadcn/hover-card',
        'shadcn/tooltip',
        'shadcn/context-menu',
        'shadcn/tabs',
        'shadcn/dropdown-menu',
        'shadcn/menubar',
        'shadcn/navigation-menu',
        'shadcn/breadcrumb',
        'shadcn/pagination',
        'shadcn/command',
        'shadcn/sidebar',
        'shadcn/table',
        'shadcn/accordion',
        'shadcn/carousel',
        'shadcn/chart',
        'shadcn/calendar',
        'shadcn/form',
        'shadcn/select',
        'shadcn/input-otp',
        'shadcn/alert',
        'shadcn/sonner',
        'components/empty-state',
      ],
    },

    // -------------------------------------------------------------------------
    // Patterns — Davinci app-specific compositions
    // -------------------------------------------------------------------------
    {
      type: 'category',
      label: 'Patterns',
      items: [
        // App component demos (Davinci-specific)
        'components/panel',
        'components/post',
        'components/composer',
        'components/navigation',
        // Full-page patterns
        'patterns/feed',
        'patterns/profile',
        'patterns/rails',
      ],
    },
  ],
};

module.exports = sidebars;
