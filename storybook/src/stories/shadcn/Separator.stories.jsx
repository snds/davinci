import React from 'react';
import { Separator } from '@davinci/ui/components/ui/separator';

export default {
  title: 'Components/Separator',
  component: Separator,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
};

export const Horizontal = {
  render: () => (
    <div style={{ width: '300px' }}>
      <div style={{ fontSize: '14px', fontWeight: 500 }}>Section A</div>
      <p style={{ fontSize: '13px', color: 'var(--fg-muted)', margin: '4px 0 8px' }}>
        Content above the separator.
      </p>
      <Separator />
      <p style={{ fontSize: '13px', color: 'var(--fg-muted)', margin: '8px 0 0' }}>
        Content below the separator.
      </p>
    </div>
  ),
};

export const Vertical = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', height: '24px' }}>
      <span style={{ fontSize: '14px' }}>Blog</span>
      <Separator orientation="vertical" />
      <span style={{ fontSize: '14px' }}>Docs</span>
      <Separator orientation="vertical" />
      <span style={{ fontSize: '14px' }}>Source</span>
    </div>
  ),
};

export const InList = {
  render: () => (
    <div style={{ width: '280px' }}>
      {['Home', 'About', 'Services', 'Contact'].map((item, i, arr) => (
        <React.Fragment key={item}>
          <div style={{ padding: '10px 0', fontSize: '14px' }}>{item}</div>
          {i < arr.length - 1 && <Separator />}
        </React.Fragment>
      ))}
    </div>
  ),
};
