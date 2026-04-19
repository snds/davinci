import React from 'react';
import ProfilePage from '../../components/ProfilePage';

export default {
  title: 'Patterns/ProfilePage',
  component: ProfilePage,
  parameters: {
    layout: 'padded',
  },
};

export const Default = {
  render: () => (
    <div style={{ maxWidth: 680 }}>
      <ProfilePage />
    </div>
  ),
};
