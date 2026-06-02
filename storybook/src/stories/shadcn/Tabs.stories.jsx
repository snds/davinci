import React from 'react';
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@davinci/ui/components/ui/tabs';

export default {
  title: 'Components/Tabs',
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
};

export const Default = {
  render: () => (
    <Tabs defaultValue="account" className="w-[400px]">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="password">Password</TabsTrigger>
        <TabsTrigger value="notifications">Notifications</TabsTrigger>
      </TabsList>
      <TabsContent value="account">
        <div className="rounded-lg border p-6 flex flex-col gap-4">
          <div>
            <h3 className="text-lg font-medium">Account</h3>
            <p className="text-sm text-muted-foreground">
              Make changes to your account here. Click save when you're done.
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Name</label>
            <input
              className="rounded-md border border-input bg-background px-3 py-2 text-sm"
              defaultValue="Pedro Duarte"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Username</label>
            <input
              className="rounded-md border border-input bg-background px-3 py-2 text-sm"
              defaultValue="@peduarte"
            />
          </div>
        </div>
      </TabsContent>
      <TabsContent value="password">
        <div className="rounded-lg border p-6 flex flex-col gap-4">
          <div>
            <h3 className="text-lg font-medium">Password</h3>
            <p className="text-sm text-muted-foreground">
              Change your password here. After saving, you'll be logged out.
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Current password</label>
            <input type="password" className="rounded-md border border-input bg-background px-3 py-2 text-sm" />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">New password</label>
            <input type="password" className="rounded-md border border-input bg-background px-3 py-2 text-sm" />
          </div>
        </div>
      </TabsContent>
      <TabsContent value="notifications">
        <div className="rounded-lg border p-6 flex flex-col gap-4">
          <div>
            <h3 className="text-lg font-medium">Notifications</h3>
            <p className="text-sm text-muted-foreground">
              Configure how you receive notifications.
            </p>
          </div>
          {['Email', 'Push', 'SMS'].map((type) => (
            <label key={type} className="flex items-center gap-2 text-sm cursor-pointer">
              <input type="checkbox" defaultChecked={type === 'Email'} />
              {type} notifications
            </label>
          ))}
        </div>
      </TabsContent>
    </Tabs>
  ),
};
