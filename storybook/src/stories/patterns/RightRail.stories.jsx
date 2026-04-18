import React from 'react';
import RightRail from '../../components/RightRail';

export default {
  title: 'Patterns/RightRail',
  component: RightRail,
  parameters: {
    layout: 'padded',
  },
};

export const Default = {
  render: () => (
    <div style={{ width: 320 }}>
      <RightRail />
    </div>
  ),
};
