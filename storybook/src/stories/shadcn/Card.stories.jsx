import React from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@davinci/ui/components/ui/card';
import { Button } from '@davinci/ui/components/ui/button';
import { Input } from '@davinci/ui/components/davinci/input';
import { Label } from '@davinci/ui/components/ui/label';

export default {
  title: 'Components/Card',
  component: Card,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
};

export const Default = {
  render: () => (
    <Card style={{ width: '360px' }}>
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>Card description goes here.</CardDescription>
      </CardHeader>
      <CardContent>
        <p style={{ fontSize: '14px', color: 'var(--fg-muted)' }}>
          This is the main content area of the card. You can put any content here.
        </p>
      </CardContent>
      <CardFooter>
        <Button>Action</Button>
      </CardFooter>
    </Card>
  ),
};

export const LoginForm = {
  render: () => (
    <Card style={{ width: '360px' }}>
      <CardHeader>
        <CardTitle>Sign in</CardTitle>
        <CardDescription>Enter your credentials to access your account.</CardDescription>
      </CardHeader>
      <CardContent>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <Label htmlFor="card-email">Email</Label>
            <Input id="card-email" type="email" placeholder="you@example.com" />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <Label htmlFor="card-password">Password</Label>
            <Input id="card-password" type="password" placeholder="••••••••" />
          </div>
        </div>
      </CardContent>
      <CardFooter style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
        <Button variant="outline">Cancel</Button>
        <Button>Sign in</Button>
      </CardFooter>
    </Card>
  ),
};

export const ProductCard = {
  render: () => (
    <Card style={{ width: '300px' }}>
      <div
        style={{
          height: '160px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: '8px 8px 0 0',
        }}
      />
      <CardHeader>
        <CardTitle>Premium Plan</CardTitle>
        <CardDescription>Everything you need to scale your team.</CardDescription>
      </CardHeader>
      <CardContent>
        <p style={{ fontSize: '28px', fontWeight: 700 }}>
          $49<span style={{ fontSize: '14px', fontWeight: 400, color: 'var(--fg-muted)' }}>/mo</span>
        </p>
        <ul style={{ marginTop: '12px', fontSize: '14px', color: 'var(--fg-muted)', lineHeight: '2' }}>
          <li>Unlimited projects</li>
          <li>Priority support</li>
          <li>Advanced analytics</li>
        </ul>
      </CardContent>
      <CardFooter>
        <Button style={{ width: '100%' }}>Get started</Button>
      </CardFooter>
    </Card>
  ),
};

export const Simple = {
  render: () => (
    <Card style={{ width: '320px' }}>
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
      </CardHeader>
      <CardContent>
        <p style={{ fontSize: '14px', color: 'var(--fg-muted)' }}>You have 3 unread messages.</p>
      </CardContent>
    </Card>
  ),
};
