import React from 'react';
import { Panel } from '@davinci/ui/components/davinci/panel';
import { Button } from '@davinci/ui/components/davinci/button';
import { Icon } from '@davinci/ui/components/davinci/icon';

export default {
  title: 'Components/Panel',
  component: Panel,
  parameters: {
    layout: 'padded',
  },
};

export const Default = {
  args: {
    title: 'Panel Title',
    children: (
      <p style={{ margin: 0, color: 'var(--fg-muted)', fontSize: 14 }}>
        This is the panel body content. Panels are the primary surface container in the Davinci design system.
      </p>
    ),
  },
};

export const WithAction = {
  name: 'With Action Button',
  render: () => (
    <Panel
      title="People to follow"
      action={<Button variant="ghost" size="sm">See all</Button>}
    >
      <p style={{ margin: 0, color: 'var(--fg-muted)', fontSize: 14 }}>Panel body with an action in the header.</p>
    </Panel>
  ),
};

export const WithIconAction = {
  name: 'With Icon Action',
  render: () => (
    <Panel
      title="Davinci News"
      action={<Icon name="info" style={{ color: 'var(--fg-subtle)', fontSize: 16 }} />}
    >
      <p style={{ margin: 0, color: 'var(--fg-muted)', fontSize: 14 }}>Panel with an icon in the header area.</p>
    </Panel>
  ),
};

export const NoHeader = {
  name: 'No Header',
  render: () => (
    <Panel>
      <p style={{ margin: 0, color: 'var(--fg-muted)', fontSize: 14 }}>
        This panel has no title or action — just the body content.
      </p>
    </Panel>
  ),
};
