import React from 'react';
import { Textarea } from '@davinci/ui/components/ui/textarea';
import { Label } from '@davinci/ui/components/ui/label';

export default {
  title: 'Components/Textarea',
  component: Textarea,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
};

export const Default = {
  render: () => <Textarea style={{ width: '320px' }} />,
};

export const WithLabel = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '320px' }}>
      <Label htmlFor="message">Your message</Label>
      <Textarea id="message" placeholder="Type your message here..." rows={4} />
    </div>
  ),
};

export const WithPlaceholder = {
  render: () => (
    <Textarea placeholder="Write a short bio about yourself..." style={{ width: '320px' }} rows={4} />
  ),
};

export const Disabled = {
  render: () => (
    <Textarea disabled placeholder="This field is disabled" style={{ width: '320px' }} rows={4} />
  ),
};
