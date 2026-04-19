import React from 'react';
import LeftRail from '../../components/LeftRail';

export default {
  title: 'Patterns/LeftRail',
  component: LeftRail,
  parameters: {
    layout: 'padded',
  },
};

export const Default = {
  render: () => (
    <div style={{ width: 240 }}>
      <LeftRail />
    </div>
  ),
};
