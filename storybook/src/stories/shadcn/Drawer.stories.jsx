import React from 'react';
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
} from '@davinci/ui/components/ui/drawer';
import { Button } from '@davinci/ui/components/ui/button';

export default {
  title: 'Components/Drawer',
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
};

export const Default = {
  render: () => (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline">Open Drawer</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Move Goal</DrawerTitle>
          <DrawerDescription>Set your daily activity goal.</DrawerDescription>
        </DrawerHeader>
        <div className="p-4 pb-0">
          <div className="flex items-center justify-center gap-4 py-8">
            <div className="text-center">
              <p className="text-5xl font-bold">350</p>
              <p className="text-sm text-muted-foreground mt-1">calories / day</p>
            </div>
          </div>
        </div>
        <DrawerFooter>
          <Button>Submit</Button>
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  ),
};

export const WithForm = {
  render: () => (
    <Drawer>
      <DrawerTrigger asChild>
        <Button>Share Feedback</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Share your feedback</DrawerTitle>
          <DrawerDescription>Help us improve your experience.</DrawerDescription>
        </DrawerHeader>
        <div className="p-4 flex flex-col gap-3">
          <textarea
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm min-h-[100px] resize-none"
            placeholder="Tell us what you think..."
          />
        </div>
        <DrawerFooter>
          <Button>Send Feedback</Button>
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  ),
};
