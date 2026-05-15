import React from 'react';
import { RadioGroup, RadioGroupItem } from '@davinci/ui/components/ui/radio-group';
import { Label } from '@davinci/ui/components/ui/label';

export default {
  title: 'Components/RadioGroup',
  component: RadioGroup,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
};

export const Default = {
  render: () => (
    <RadioGroup defaultValue="option-1">
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <RadioGroupItem value="option-1" id="option-1" />
        <Label htmlFor="option-1">Option One</Label>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <RadioGroupItem value="option-2" id="option-2" />
        <Label htmlFor="option-2">Option Two</Label>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <RadioGroupItem value="option-3" id="option-3" />
        <Label htmlFor="option-3">Option Three</Label>
      </div>
    </RadioGroup>
  ),
};

export const Horizontal = {
  render: () => (
    <RadioGroup defaultValue="sm" style={{ display: 'flex', gap: '16px' }}>
      {['sm', 'md', 'lg', 'xl'].map((size) => (
        <div key={size} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <RadioGroupItem value={size} id={`size-${size}`} />
          <Label htmlFor={`size-${size}`}>{size.toUpperCase()}</Label>
        </div>
      ))}
    </RadioGroup>
  ),
};

export const Disabled = {
  render: () => (
    <RadioGroup defaultValue="option-1" disabled>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <RadioGroupItem value="option-1" id="d-option-1" />
        <Label htmlFor="d-option-1">Option One (disabled)</Label>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <RadioGroupItem value="option-2" id="d-option-2" />
        <Label htmlFor="d-option-2">Option Two (disabled)</Label>
      </div>
    </RadioGroup>
  ),
};
