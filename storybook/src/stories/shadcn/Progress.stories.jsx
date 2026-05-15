import React from 'react';
import { Progress } from '@davinci/ui/components/ui/progress';

export default {
  title: 'Components/Progress',
  component: Progress,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
};

export const Static = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '320px' }}>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '13px', color: '#6b7280' }}>
          <span>Progress</span>
          <span>60%</span>
        </div>
        <Progress value={60} />
      </div>
    </div>
  ),
};

export const Animated = {
  render: () => {
    const [progress, setProgress] = React.useState(0);

    React.useEffect(() => {
      const timer = setTimeout(() => setProgress(75), 500);
      return () => clearTimeout(timer);
    }, []);

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '320px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#6b7280' }}>
          <span>Loading…</span>
          <span>{progress}%</span>
        </div>
        <Progress value={progress} />
      </div>
    );
  },
};

export const MultipleValues = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', width: '320px' }}>
      {[
        { label: 'Storage used', value: 88 },
        { label: 'CPU usage', value: 45 },
        { label: 'Memory', value: 62 },
        { label: 'Bandwidth', value: 30 },
      ].map(({ label, value }) => (
        <div key={label}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '13px', color: '#374151' }}>
            <span>{label}</span>
            <span style={{ color: '#6b7280' }}>{value}%</span>
          </div>
          <Progress value={value} />
        </div>
      ))}
    </div>
  ),
};

export const IndeterminateStyle = {
  render: () => (
    <div style={{ width: '320px' }}>
      <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '8px' }}>
        No value = indeterminate appearance
      </p>
      <Progress />
    </div>
  ),
};
