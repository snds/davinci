import React from 'react';
import Composer from '../../components/Composer';

export default {
  title: 'Patterns/Composer',
  component: Composer,
  parameters: {
    layout: 'padded',
  },
};

export const Default = {
  render: () => <Composer />,
};
