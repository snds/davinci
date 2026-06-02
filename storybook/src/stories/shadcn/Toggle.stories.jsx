import React from 'react';
import { Toggle } from '@davinci/ui/components/ui/toggle';

export default {
  title: 'Components/Toggle',
  component: Toggle,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
};

export const Default = {
  render: () => (
    <Toggle aria-label="Toggle italic">
      <span style={{ fontStyle: 'italic', fontWeight: 500 }}>I</span>
    </Toggle>
  ),
};

export const Bold = {
  render: () => (
    <Toggle aria-label="Toggle bold" defaultPressed>
      <span style={{ fontWeight: 700 }}>B</span>
    </Toggle>
  ),
};

export const Outline = {
  render: () => (
    <Toggle variant="outline" aria-label="Toggle underline">
      <span style={{ textDecoration: 'underline' }}>U</span>
    </Toggle>
  ),
};

export const Disabled = {
  render: () => (
    <Toggle disabled aria-label="Toggle strikethrough">
      <span style={{ textDecoration: 'line-through' }}>S</span>
    </Toggle>
  ),
};

export const TextFormatting = {
  render: () => (
    <div style={{ display: 'flex', gap: '4px' }}>
      <Toggle aria-label="Bold" size="sm">
        <span style={{ fontWeight: 700, fontSize: '13px' }}>B</span>
      </Toggle>
      <Toggle aria-label="Italic" size="sm">
        <span style={{ fontStyle: 'italic', fontSize: '13px' }}>I</span>
      </Toggle>
      <Toggle aria-label="Underline" size="sm">
        <span style={{ textDecoration: 'underline', fontSize: '13px' }}>U</span>
      </Toggle>
      <Toggle variant="outline" aria-label="Strikethrough" size="sm">
        <span style={{ textDecoration: 'line-through', fontSize: '13px' }}>S</span>
      </Toggle>
    </div>
  ),
};
