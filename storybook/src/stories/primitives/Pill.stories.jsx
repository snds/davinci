import React from 'react';
import Pill from '../../components/Pill';

export default {
  title: 'Primitives/Pill',
  component: Pill,
  argTypes: {
    variant: {
      control: 'select',
      options: [undefined, 'accent', 'alt', 'success'],
      description: 'Pill variant',
    },
    children: {
      control: 'text',
      description: 'Pill label',
    },
  },
};

export const Default = {
  args: {
    children: 'Default Pill',
  },
};

export const Accent = {
  args: {
    variant: 'accent',
    children: 'Accent Pill',
  },
};

export const Alt = {
  args: {
    variant: 'alt',
    children: 'Alt Pill',
  },
};

export const Success = {
  args: {
    variant: 'success',
    children: 'Success Pill',
  },
};

export const AllVariants = {
  name: 'All Variants',
  render: () => (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
      <Pill>Default</Pill>
      <Pill variant="accent">Accent</Pill>
      <Pill variant="alt">Alt</Pill>
      <Pill variant="success">Success</Pill>
    </div>
  ),
};
