import React from 'react';
import Feed from '../../components/Feed';

export default {
  title: 'Patterns/Feed',
  component: Feed,
  parameters: {
    layout: 'padded',
  },
};

export const Default = {
  render: () => (
    <div style={{ maxWidth: 560 }}>
      <Feed />
    </div>
  ),
};
