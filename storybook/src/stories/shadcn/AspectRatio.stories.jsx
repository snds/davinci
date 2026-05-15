import React from 'react';
import { AspectRatio } from '@davinci/ui/components/ui/aspect-ratio';

export default {
  title: 'Components/AspectRatio',
  component: AspectRatio,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
};

export const SixteenByNine = {
  render: () => (
    <div style={{ width: '480px' }}>
      <AspectRatio ratio={16 / 9}>
        <div
          style={{
            width: '100%',
            height: '100%',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '18px',
            fontWeight: 500,
          }}
        >
          16 : 9
        </div>
      </AspectRatio>
    </div>
  ),
};

export const Square = {
  render: () => (
    <div style={{ width: '240px' }}>
      <AspectRatio ratio={1}>
        <div
          style={{
            width: '100%',
            height: '100%',
            background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '18px',
            fontWeight: 500,
          }}
        >
          1 : 1
        </div>
      </AspectRatio>
    </div>
  ),
};

export const FourByThree = {
  render: () => (
    <div style={{ width: '320px' }}>
      <AspectRatio ratio={4 / 3}>
        <div
          style={{
            width: '100%',
            height: '100%',
            background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '18px',
            fontWeight: 500,
          }}
        >
          4 : 3
        </div>
      </AspectRatio>
    </div>
  ),
};
