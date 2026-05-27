import React from 'react';
import { RichTextarea } from '@davinci/ui/components/davinci/rich-textarea';
import { Textarea } from '@davinci/ui/components/davinci/textarea';
import { Label } from '@davinci/ui/components/ui/label';

export default {
  title: 'Components/Rich Textarea',
  component: RichTextarea,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
};

export const Default = {
  render: () => (
    <div style={{ width: 460 }}>
      <RichTextarea placeholder="Write something…" />
    </div>
  ),
};

export const WithLabel = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, width: 460 }}>
      <Label>Rich Textarea</Label>
      <RichTextarea placeholder="Connecting the world's professionals…" />
    </div>
  ),
};

// The "Poor Textarea" from the reference sheet — the plain Textarea primitive.
export const RichVsPoor = {
  name: 'Rich vs. Poor',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, width: 460 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <Label>Rich Textarea (Lexical)</Label>
        <RichTextarea placeholder="Formatting toolbar: bold, italic, lists, links…" />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <Label htmlFor="poor">Poor Textarea (plain)</Label>
        <Textarea id="poor" placeholder="Just text." rows={4} />
      </div>
    </div>
  ),
};
