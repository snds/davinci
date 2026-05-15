import React from 'react';
import { Skeleton } from '@davinci/ui/components/ui/skeleton';

export default {
  title: 'Components/Skeleton',
  component: Skeleton,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
};

export const Default = {
  render: () => <Skeleton style={{ width: '200px', height: '20px' }} />,
};

export const CardSkeleton = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '300px' }}>
      <Skeleton style={{ height: '160px', borderRadius: '8px' }} />
      <Skeleton style={{ height: '20px', width: '75%' }} />
      <Skeleton style={{ height: '16px', width: '55%' }} />
      <Skeleton style={{ height: '16px', width: '90%' }} />
      <Skeleton style={{ height: '16px', width: '70%' }} />
    </div>
  ),
};

export const ProfileSkeleton = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '320px' }}>
      <Skeleton style={{ width: '48px', height: '48px', borderRadius: '50%', flexShrink: 0 }} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
        <Skeleton style={{ height: '16px', width: '60%' }} />
        <Skeleton style={{ height: '14px', width: '85%' }} />
      </div>
    </div>
  ),
};

export const TableSkeleton = {
  render: () => (
    <div style={{ width: '480px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <div style={{ display: 'flex', gap: '12px' }}>
        <Skeleton style={{ height: '16px', width: '30%' }} />
        <Skeleton style={{ height: '16px', width: '40%' }} />
        <Skeleton style={{ height: '16px', width: '20%' }} />
      </div>
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} style={{ display: 'flex', gap: '12px' }}>
          <Skeleton style={{ height: '14px', width: '30%' }} />
          <Skeleton style={{ height: '14px', width: '40%' }} />
          <Skeleton style={{ height: '14px', width: '20%' }} />
        </div>
      ))}
    </div>
  ),
};
