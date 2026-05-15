import React from 'react';
import TopNav from '../../components/TopNav';

export default {
  title: 'Patterns/TopNav',
  component: TopNav,
  parameters: {
    layout: 'fullscreen',
  },
};

export const Default = {
  name: 'Home Active',
  render: () => <TopNav active="home" />,
};

export const NetworkActive = {
  name: 'Network Active',
  render: () => <TopNav active="network" />,
};

export const WithAlerts = {
  name: 'With Alert Count',
  render: () => <TopNav active="home" alertCount={3} />,
};

export const MessagingActive = {
  name: 'Messaging Active',
  render: () => <TopNav active="messaging" />,
};
