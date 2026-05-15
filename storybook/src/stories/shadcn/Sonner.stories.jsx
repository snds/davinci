import React from 'react';
import { Toaster } from '@davinci/ui/components/ui/sonner';
import { toast } from 'sonner';
import { Button } from '@davinci/ui/components/ui/button';

export default {
  title: 'Components/Sonner',
  component: Toaster,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
};

export const Default = {
  render: () => (
    <>
      <Toaster />
      <Button onClick={() => toast('Event has been created.')}>
        Show toast
      </Button>
    </>
  ),
};

export const Success = {
  render: () => (
    <>
      <Toaster />
      <Button onClick={() => toast.success('Profile updated successfully.')}>
        Success toast
      </Button>
    </>
  ),
};

export const Error = {
  render: () => (
    <>
      <Toaster />
      <Button
        variant="destructive"
        onClick={() => toast.error('Something went wrong. Please try again.')}
      >
        Error toast
      </Button>
    </>
  ),
};

export const Warning = {
  render: () => (
    <>
      <Toaster />
      <Button
        variant="outline"
        onClick={() => toast.warning('Your session is about to expire.')}
      >
        Warning toast
      </Button>
    </>
  ),
};

export const AllTypes = {
  render: () => (
    <>
      <Toaster />
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <Button onClick={() => toast('Default notification')}>Default</Button>
        <Button onClick={() => toast.success('Success!')}>Success</Button>
        <Button variant="destructive" onClick={() => toast.error('Error!')}>Error</Button>
        <Button variant="outline" onClick={() => toast.warning('Warning!')}>Warning</Button>
        <Button
          variant="secondary"
          onClick={() =>
            toast.promise(new Promise((res) => setTimeout(res, 2000)), {
              loading: 'Loading…',
              success: 'Done!',
              error: 'Failed',
            })
          }
        >
          Promise
        </Button>
      </div>
    </>
  ),
};
