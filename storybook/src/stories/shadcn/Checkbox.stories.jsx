import React from 'react';
import { Checkbox } from '@davinci/ui/components/ui/checkbox';
import { Label } from '@davinci/ui/components/ui/label';

export default {
  title: 'Components/Checkbox',
  component: Checkbox,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
};

export const Default = {
  render: () => <Checkbox />,
};

export const Checked = {
  render: () => <Checkbox defaultChecked />,
};

export const Disabled = {
  render: () => <Checkbox disabled />,
};

export const DisabledChecked = {
  render: () => <Checkbox disabled defaultChecked />,
};

export const WithLabel = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <Checkbox id="newsletter" />
      <Label htmlFor="newsletter">Subscribe to newsletter</Label>
    </div>
  ),
};

export const CheckboxList = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {['Notifications', 'Marketing emails', 'Product updates'].map((item) => (
        <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Checkbox id={item} />
          <Label htmlFor={item}>{item}</Label>
        </div>
      ))}
    </div>
  ),
};
