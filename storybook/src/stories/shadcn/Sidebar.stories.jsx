import React from 'react';
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@davinci/ui/components/ui/sidebar';

export default {
  title: 'Components/Sidebar',
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
};

const navItems = [
  { label: 'Dashboard', icon: '⊞' },
  { label: 'Projects', icon: '📁' },
  { label: 'Team', icon: '👥' },
  { label: 'Calendar', icon: '📅' },
  { label: 'Documents', icon: '📄' },
  { label: 'Reports', icon: '📊' },
];

const settingsItems = [
  { label: 'Settings', icon: '⚙️' },
  { label: 'Help & Support', icon: '❓' },
];

export const Default = {
  render: () => (
    <SidebarProvider style={{ minHeight: '400px' }}>
      <Sidebar>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Application</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {navItems.map((item) => (
                  <SidebarMenuItem key={item.label}>
                    <SidebarMenuButton asChild>
                      <a href="#" onClick={(e) => e.preventDefault()}>
                        <span>{item.icon}</span>
                        <span>{item.label}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupLabel>Settings</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {settingsItems.map((item) => (
                  <SidebarMenuItem key={item.label}>
                    <SidebarMenuButton asChild>
                      <a href="#" onClick={(e) => e.preventDefault()}>
                        <span>{item.icon}</span>
                        <span>{item.label}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>

      <main className="flex-1 p-6">
        <h1 className="text-2xl font-bold">Main Content</h1>
        <p className="text-muted-foreground mt-2">The sidebar is rendered on the left.</p>
      </main>
    </SidebarProvider>
  ),
};
