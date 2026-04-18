/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  docs: [
    'intro',
    {
      type: 'category',
      label: 'Foundations',
      items: [
        'foundations/colors',
        'foundations/typography',
        'foundations/spacing',
        'foundations/shadows',
        'foundations/radii',
      ],
    },
    {
      type: 'category',
      label: 'Primitives',
      items: [
        'primitives/buttons',
        'primitives/avatars',
        'primitives/icons',
        'primitives/pills',
      ],
    },
    {
      type: 'category',
      label: 'Components',
      items: [
        'components/panel',
        'components/post',
        'components/composer',
        'components/navigation',
      ],
    },
    {
      type: 'category',
      label: 'Patterns',
      items: [
        'patterns/feed',
        'patterns/profile',
        'patterns/rails',
      ],
    },
  ],
};

module.exports = sidebars;
