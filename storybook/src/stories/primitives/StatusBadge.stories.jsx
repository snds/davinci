import React from 'react';
import { StatusBadge } from '@davinci/ui/components/davinci/status-badge';

export default {
  title: 'Primitives/StatusBadge',
  component: StatusBadge,
  argTypes: {
    status: {
      control: 'select',
      options: ['online', 'hiring', 'away', 'closed', 'new'],
      description: 'Status tone — drives the dot color and default label.',
    },
    children: { control: 'text', description: 'Override the default label.' },
  },
};

export const Default = { args: { status: 'online' } };

export const AllStatuses = {
  name: 'All statuses',
  render: () => (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
      <StatusBadge status="online" />
      <StatusBadge status="hiring" />
      <StatusBadge status="away" />
      <StatusBadge status="closed" />
      <StatusBadge status="new" />
    </div>
  ),
};

export const CustomLabel = {
  name: 'Custom label',
  render: () => <StatusBadge status="online">Available now</StatusBadge>,
};
