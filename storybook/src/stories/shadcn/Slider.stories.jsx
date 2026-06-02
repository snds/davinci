import React from 'react';
import { Slider } from '@davinci/ui/components/ui/slider';

export default {
  title: 'Components/Slider',
  component: Slider,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
};

export const Default = {
  render: () => {
    const [value, setValue] = React.useState([50]);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '300px' }}>
        <Slider
          min={0}
          max={100}
          step={1}
          value={value}
          onValueChange={setValue}
        />
        <span style={{ fontSize: '14px', color: 'var(--fg-muted)' }}>Value: {value[0]}</span>
      </div>
    );
  },
};

export const Range = {
  render: () => {
    const [value, setValue] = React.useState([20, 80]);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '300px' }}>
        <Slider
          min={0}
          max={100}
          step={1}
          value={value}
          onValueChange={setValue}
        />
        <span style={{ fontSize: '14px', color: 'var(--fg-muted)' }}>
          Range: {value[0]} – {value[1]}
        </span>
      </div>
    );
  },
};

export const StepFive = {
  render: () => {
    const [value, setValue] = React.useState([25]);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '300px' }}>
        <Slider
          min={0}
          max={100}
          step={5}
          value={value}
          onValueChange={setValue}
        />
        <span style={{ fontSize: '14px', color: 'var(--fg-muted)' }}>Step 5 — Value: {value[0]}</span>
      </div>
    );
  },
};

export const Disabled = {
  render: () => (
    <Slider
      min={0}
      max={100}
      step={1}
      defaultValue={[40]}
      disabled
      style={{ width: '300px' }}
    />
  ),
};
