import React from 'react';
import NavList from '../../components/NavList';
import Panel from '../../components/Panel';

export default {
  title: 'Components/NavList',
  component: NavList,
  parameters: {
    layout: 'padded',
  },
};

export const Default = {
  render: () => (
    <div style={{ width: 240 }}>
      <Panel>
        <NavList />
      </Panel>
    </div>
  ),
};

export const WithActiveItem = {
  name: 'With Active Item',
  render: () => (
    <div style={{ width: 240 }}>
      <Panel>
        <NavList activeId="saved" />
      </Panel>
    </div>
  ),
};
