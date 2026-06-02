import React from 'react';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@davinci/ui/components/ui/popover';
import { Button } from '@davinci/ui/components/ui/button';

export default {
  title: 'Components/Popover',
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
};

export const Default = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Open Popover</Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="flex flex-col gap-4">
          <div>
            <h4 className="font-medium leading-none">Dimensions</h4>
            <p className="text-sm text-muted-foreground mt-1">Set the dimensions for the layer.</p>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Width</label>
              <input
                className="w-24 rounded border border-input px-2 py-1 text-sm"
                defaultValue="100%"
              />
            </div>
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Height</label>
              <input
                className="w-24 rounded border border-input px-2 py-1 text-sm"
                defaultValue="auto"
              />
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  ),
};

export const Settings = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Settings</Button>
      </PopoverTrigger>
      <PopoverContent className="w-64" align="start">
        <div className="flex flex-col gap-3">
          <h4 className="font-medium text-sm">Notification Settings</h4>
          <div className="flex flex-col gap-2">
            {['Email notifications', 'Push notifications', 'Weekly digest'].map((label) => (
              <label key={label} className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded" />
                {label}
              </label>
            ))}
          </div>
          <Button size="sm" className="mt-1">Save preferences</Button>
        </div>
      </PopoverContent>
    </Popover>
  ),
};
