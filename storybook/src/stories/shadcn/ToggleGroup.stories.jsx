import React from 'react';
import { ToggleGroup, ToggleGroupItem } from '@davinci/ui/components/ui/toggle-group';

export default {
  title: 'Components/ToggleGroup',
  component: ToggleGroup,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
};

export const SingleAlignment = {
  render: () => (
    <ToggleGroup type="single" defaultValue="center">
      <ToggleGroupItem value="left" aria-label="Align left">
        Left
      </ToggleGroupItem>
      <ToggleGroupItem value="center" aria-label="Align center">
        Center
      </ToggleGroupItem>
      <ToggleGroupItem value="right" aria-label="Align right">
        Right
      </ToggleGroupItem>
    </ToggleGroup>
  ),
};

export const Multiple = {
  render: () => (
    <ToggleGroup type="multiple" defaultValue={['bold', 'italic']}>
      <ToggleGroupItem value="bold" aria-label="Bold">
        <span style={{ fontWeight: 700 }}>B</span>
      </ToggleGroupItem>
      <ToggleGroupItem value="italic" aria-label="Italic">
        <span style={{ fontStyle: 'italic' }}>I</span>
      </ToggleGroupItem>
      <ToggleGroupItem value="underline" aria-label="Underline">
        <span style={{ textDecoration: 'underline' }}>U</span>
      </ToggleGroupItem>
    </ToggleGroup>
  ),
};

export const Outline = {
  render: () => (
    <ToggleGroup type="single" variant="outline" defaultValue="sm">
      <ToggleGroupItem value="sm">SM</ToggleGroupItem>
      <ToggleGroupItem value="md">MD</ToggleGroupItem>
      <ToggleGroupItem value="lg">LG</ToggleGroupItem>
      <ToggleGroupItem value="xl">XL</ToggleGroupItem>
    </ToggleGroup>
  ),
};

export const Disabled = {
  render: () => (
    <ToggleGroup type="single" disabled defaultValue="left">
      <ToggleGroupItem value="left">Left</ToggleGroupItem>
      <ToggleGroupItem value="center">Center</ToggleGroupItem>
      <ToggleGroupItem value="right">Right</ToggleGroupItem>
    </ToggleGroup>
  ),
};
