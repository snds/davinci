import React from 'react';
import { Switch } from '@davinci/ui/components/ui/switch';
import { Label } from '@davinci/ui/components/ui/label';

export default {
  title: 'Components/Switch',
  component: Switch,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
};

export const Default = {
  render: () => <Switch />,
};

export const Checked = {
  render: () => <Switch defaultChecked />,
};

export const Disabled = {
  render: () => <Switch disabled />,
};

export const DisabledChecked = {
  render: () => <Switch disabled defaultChecked />,
};

export const WithLabel = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <Switch id="airplane-mode" />
      <Label htmlFor="airplane-mode">Airplane mode</Label>
    </div>
  ),
};

export const SettingsList = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', minWidth: '260px' }}>
      {[
        { id: 'notifications', label: 'Push notifications', checked: true },
        { id: 'marketing', label: 'Marketing emails', checked: false },
        { id: 'updates', label: 'Product updates', checked: true },
      ].map(({ id, label, checked }) => (
        <div key={id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Label htmlFor={id}>{label}</Label>
          <Switch id={id} defaultChecked={checked} />
        </div>
      ))}
    </div>
  ),
};
