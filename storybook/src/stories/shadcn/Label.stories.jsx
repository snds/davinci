import React from 'react';
import { Label } from '@davinci/ui/components/ui/label';
import { Input } from '@davinci/ui/components/ui/input';
import { Checkbox } from '@davinci/ui/components/ui/checkbox';

export default {
  title: 'Components/Label',
  component: Label,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
};

export const Default = {
  render: () => <Label>Label text</Label>,
};

export const PairedWithInput = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '280px' }}>
      <Label htmlFor="username">Username</Label>
      <Input id="username" placeholder="johndoe" />
    </div>
  ),
};

export const PairedWithCheckbox = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <Checkbox id="terms" />
      <Label htmlFor="terms">I agree to the terms and conditions</Label>
    </div>
  ),
};
