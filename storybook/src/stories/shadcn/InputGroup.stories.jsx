import React from 'react';
import { InputGroup } from '@davinci/ui/components/ui/input-group';
import { Input } from '@davinci/ui/components/ui/input';
import { Button } from '@davinci/ui/components/ui/button';
import { Label } from '@davinci/ui/components/ui/label';

export default {
  title: 'Components/Input Group',
  component: InputGroup,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
};

export const WithButton = {
  name: 'Input + button',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, width: 360 }}>
      <Label htmlFor="coupon">Coupon code</Label>
      <InputGroup>
        <Input id="coupon" placeholder="I'm with small ->" />
        <Button size="sm">I'm Small</Button>
      </InputGroup>
    </div>
  ),
};

export const Attached = {
  name: 'Attached (joined seams)',
  render: () => (
    <InputGroup attached style={{ width: 360 }}>
      <Input placeholder="Search people or companies…" />
      <Button variant="secondary" size="sm">Search</Button>
    </InputGroup>
  ),
};

export const TrailingText = {
  render: () => (
    <InputGroup style={{ width: 320 }}>
      <Input placeholder="0.00" inputMode="decimal" />
      <span style={{ fontSize: 13, color: 'var(--fg-muted)' }}>USD</span>
    </InputGroup>
  ),
};
