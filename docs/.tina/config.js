const { defineConfig } = require('tinacms');

module.exports = defineConfig({
  branch: 'main',

  // After signing up at app.tina.io, fill these in:
  clientId: '',
  token: '',

  build: {
    outputFolder: 'admin',
    publicFolder: 'static',
  },

  media: {
    tina: {
      mediaRoot: 'img',
      publicFolder: 'static',
    },
  },

  schema: {
    collections: [
      // ── Foundations ──────────────────────────────────────────────
      {
        name: 'foundations',
        label: 'Foundations',
        path: 'docs/foundations',
        format: 'mdx',
        fields: [
          {
            type: 'string',
            name: 'title',
            label: 'Title',
            isTitle: true,
            required: true,
          },
          {
            type: 'string',
            name: 'description',
            label: 'Description',
            ui: { component: 'textarea' },
          },
          {
            type: 'rich-text',
            name: 'body',
            label: 'Body',
            isBody: true,
          },
        ],
      },

      // ── Primitives ───────────────────────────────────────────────
      {
        name: 'primitives',
        label: 'Primitives',
        path: 'docs/primitives',
        format: 'mdx',
        fields: [
          {
            type: 'string',
            name: 'title',
            label: 'Title',
            isTitle: true,
            required: true,
          },
          {
            type: 'string',
            name: 'description',
            label: 'Description',
            ui: { component: 'textarea' },
          },
          {
            type: 'rich-text',
            name: 'body',
            label: 'Body',
            isBody: true,
          },
        ],
      },

      // ── Components ───────────────────────────────────────────────
      {
        name: 'components',
        label: 'Components',
        path: 'docs/components',
        format: 'mdx',
        fields: [
          {
            type: 'string',
            name: 'title',
            label: 'Title',
            isTitle: true,
            required: true,
          },
          {
            type: 'string',
            name: 'description',
            label: 'Description',
            ui: { component: 'textarea' },
          },
          {
            type: 'rich-text',
            name: 'body',
            label: 'Body',
            isBody: true,
          },
        ],
      },

      // ── Patterns ─────────────────────────────────────────────────
      {
        name: 'patterns',
        label: 'Patterns',
        path: 'docs/patterns',
        format: 'mdx',
        fields: [
          {
            type: 'string',
            name: 'title',
            label: 'Title',
            isTitle: true,
            required: true,
          },
          {
            type: 'string',
            name: 'description',
            label: 'Description',
            ui: { component: 'textarea' },
          },
          {
            type: 'rich-text',
            name: 'body',
            label: 'Body',
            isBody: true,
          },
        ],
      },
    ],
  },
});
