import React from 'react';
import { ScrollArea } from '@davinci/ui/components/ui/scroll-area';
import { Separator } from '@davinci/ui/components/ui/separator';

const TAGS = Array.from({ length: 50 }, (_, i) => `Item ${i + 1}`);

export default {
  title: 'Components/ScrollArea',
  component: ScrollArea,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
};

export const Default = {
  render: () => (
    <ScrollArea style={{ height: '300px', width: '240px', border: '1px solid var(--border)', borderRadius: '8px' }}>
      <div style={{ padding: '12px' }}>
        <h4 style={{ margin: '0 0 12px', fontSize: '14px', fontWeight: 600 }}>Items</h4>
        {TAGS.map((tag, i) => (
          <React.Fragment key={tag}>
            <div style={{ fontSize: '14px', padding: '4px 0' }}>{tag}</div>
            {i < TAGS.length - 1 && <Separator />}
          </React.Fragment>
        ))}
      </div>
    </ScrollArea>
  ),
};

export const HorizontalScroll = {
  render: () => (
    <ScrollArea style={{ width: '300px', whiteSpace: 'nowrap', border: '1px solid var(--border)', borderRadius: '8px' }}>
      <div style={{ display: 'flex', padding: '12px', gap: '12px' }}>
        {Array.from({ length: 20 }, (_, i) => (
          <div
            key={i}
            style={{
              flexShrink: 0,
              width: '120px',
              height: '80px',
              background: `hsl(${i * 18}, 60%, 70%)`,
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '13px',
              fontWeight: 500,
            }}
          >
            Card {i + 1}
          </div>
        ))}
      </div>
    </ScrollArea>
  ),
};
