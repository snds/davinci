import React from 'react';
import { Avatar } from '@davinci/ui/components/davinci/avatar';

export default {
  title: 'Primitives/Avatar',
  component: Avatar,
  argTypes: {
    size: {
      control: 'select',
      options: [32, 40, 48, 64, 128],
      description: 'Avatar size in px',
    },
    variant: {
      control: 'select',
      options: ['g1', 'g2', 'g3', 'g4', 'g5', 'g6'],
      description: 'Gradient variant',
    },
    initials: {
      control: 'text',
      description: 'Initials to display (when no photo)',
    },
    photo: {
      control: 'text',
      description: 'Photo URL',
    },
  },
};

export const Default = {
  args: {
    initials: 'YO',
    size: 40,
    variant: 'g1',
  },
};

export const AllVariants = {
  name: 'All Gradient Variants',
  render: () => (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
      {['g1', 'g2', 'g3', 'g4', 'g5', 'g6'].map(v => (
        <div key={v} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
          <Avatar initials="AB" size={40} variant={v} />
          <span style={{ fontSize: 11, color: 'var(--fg-muted)', fontFamily: 'var(--font-mono)' }}>{v}</span>
        </div>
      ))}
    </div>
  ),
};

export const AllSizes = {
  name: 'All Sizes',
  render: () => (
    <div style={{ display: 'flex', gap: 16, alignItems: 'flex-end', flexWrap: 'wrap' }}>
      {[32, 40, 48, 64, 128].map(size => (
        <div key={size} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
          <Avatar initials="YO" size={size} variant="g1" />
          <span style={{ fontSize: 11, color: 'var(--fg-muted)', fontFamily: 'var(--font-mono)' }}>{size}px</span>
        </div>
      ))}
    </div>
  ),
};

export const WithPhoto = {
  name: 'With Photo',
  args: {
    initials: 'YO',
    size: 40,
    variant: 'g1',
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&crop=faces&auto=format&q=75',
  },
};

export const Initials = {
  name: 'Initials Only',
  render: () => (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
      {[
        { initials: 'YO', variant: 'g1' },
        { initials: 'SA', variant: 'g4' },
        { initials: 'DA', variant: 'g6' },
        { initials: 'PR', variant: 'g5' },
        { initials: 'MC', variant: 'g2' },
        { initials: 'KT', variant: 'g3' },
      ].map(({ initials, variant }) => (
        <Avatar key={initials} initials={initials} size={40} variant={variant} photo={null} />
      ))}
    </div>
  ),
};
