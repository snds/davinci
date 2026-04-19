import React from 'react';
import Button from '../../components/Button';

export default {
  title: 'Primitives/Button',
  component: Button,
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'outline', 'ghost'],
      description: 'Button variant',
    },
    size: {
      control: 'select',
      options: [undefined, 'sm'],
      description: 'Button size',
    },
    pill: {
      control: 'boolean',
      description: 'Pill shape',
    },
    icon: {
      control: 'text',
      description: 'Leading icon name',
    },
    iconRight: {
      control: 'text',
      description: 'Trailing icon name',
    },
    children: {
      control: 'text',
      description: 'Button label',
    },
  },
};

export const Primary = {
  args: {
    variant: 'primary',
    children: 'Primary Button',
  },
};

export const Secondary = {
  args: {
    variant: 'secondary',
    children: 'Secondary Button',
  },
};

export const Outline = {
  args: {
    variant: 'outline',
    children: 'Outline Button',
  },
};

export const Ghost = {
  args: {
    variant: 'ghost',
    children: 'Ghost Button',
  },
};

export const WithIcon = {
  name: 'With Leading Icon',
  args: {
    variant: 'primary',
    icon: 'add',
    children: 'Create Post',
  },
};

export const WithIconRight = {
  name: 'With Trailing Icon',
  args: {
    variant: 'outline',
    iconRight: 'arrow_forward',
    children: 'View Profile',
  },
};

export const SmallSize = {
  name: 'Small Size',
  args: {
    variant: 'secondary',
    size: 'sm',
    children: 'Small Button',
  },
};

export const PillShape = {
  name: 'Pill Shape',
  args: {
    variant: 'outline',
    pill: true,
    icon: 'add',
    children: 'Follow',
  },
};

export const AllVariants = {
  name: 'All Variants',
  render: () => (
    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="primary" icon="add">With Icon</Button>
      <Button variant="outline" pill icon="add">Follow</Button>
      <Button variant="secondary" size="sm">Small</Button>
    </div>
  ),
};
