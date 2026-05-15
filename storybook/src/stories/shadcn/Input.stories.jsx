import React from 'react';
import { Input } from '@davinci/ui/components/ui/input';
import { Label } from '@davinci/ui/components/ui/label';

export default {
  title: 'Components/Input',
  component: Input,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
};

export const Default = {
  render: () => <Input style={{ width: '280px' }} />,
};

export const WithLabel = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '280px' }}>
      <Label htmlFor="email">Email address</Label>
      <Input id="email" type="email" placeholder="you@example.com" />
    </div>
  ),
};

export const WithPlaceholder = {
  render: () => <Input placeholder="Search..." style={{ width: '280px' }} />,
};

export const Disabled = {
  render: () => <Input disabled placeholder="Disabled input" style={{ width: '280px' }} />,
};

export const Password = {
  render: () => <Input type="password" placeholder="Enter password" style={{ width: '280px' }} />,
};
