import React from 'react';
import { Alert, AlertTitle, AlertDescription } from '@davinci/ui/components/ui/alert';

export default {
  title: 'Components/Alert',
  component: Alert,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
};

export const Default = {
  render: () => (
    <Alert style={{ width: '420px' }}>
      <AlertTitle>Heads up!</AlertTitle>
      <AlertDescription>
        You can add components to your app using the CLI.
      </AlertDescription>
    </Alert>
  ),
};

export const Destructive = {
  render: () => (
    <Alert variant="destructive" style={{ width: '420px' }}>
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>
        Your session has expired. Please log in again to continue.
      </AlertDescription>
    </Alert>
  ),
};

export const AllVariants = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '420px' }}>
      <Alert>
        <AlertTitle>Information</AlertTitle>
        <AlertDescription>This is a default informational alert message.</AlertDescription>
      </Alert>
      <Alert variant="destructive">
        <AlertTitle>Destructive</AlertTitle>
        <AlertDescription>Something went wrong. Please try again later.</AlertDescription>
      </Alert>
    </div>
  ),
};

export const TitleOnly = {
  render: () => (
    <Alert style={{ width: '420px' }}>
      <AlertTitle>Saved successfully.</AlertTitle>
    </Alert>
  ),
};
