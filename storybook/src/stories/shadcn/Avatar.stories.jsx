import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@davinci/ui/components/ui/avatar';

export default {
  title: 'Components/Avatar',
  component: Avatar,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
};

export const WithImage = {
  render: () => (
    <Avatar>
      <AvatarImage src="https://github.com/shadcn.png" alt="shadcn" />
      <AvatarFallback>SC</AvatarFallback>
    </Avatar>
  ),
};

export const FallbackOnly = {
  render: () => (
    <Avatar>
      <AvatarImage src="" alt="User" />
      <AvatarFallback>JD</AvatarFallback>
    </Avatar>
  ),
};

export const Sizes = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      <Avatar style={{ width: '24px', height: '24px', fontSize: '10px' }}>
        <AvatarFallback>XS</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback>SM</AvatarFallback>
      </Avatar>
      <Avatar style={{ width: '48px', height: '48px', fontSize: '16px' }}>
        <AvatarFallback>MD</AvatarFallback>
      </Avatar>
      <Avatar style={{ width: '64px', height: '64px', fontSize: '20px' }}>
        <AvatarFallback>LG</AvatarFallback>
      </Avatar>
    </div>
  ),
};

export const AvatarGroup = {
  render: () => {
    const users = [
      { src: 'https://github.com/shadcn.png', fallback: 'SC' },
      { src: '', fallback: 'JD' },
      { src: '', fallback: 'AB' },
      { src: '', fallback: 'MK' },
    ];

    return (
      <div style={{ display: 'flex' }}>
        {users.map((user, i) => (
          <Avatar
            key={i}
            style={{
              marginLeft: i === 0 ? 0 : '-8px',
              border: '2px solid var(--bg-surface)',
              zIndex: users.length - i,
            }}
          >
            {user.src ? <AvatarImage src={user.src} alt={user.fallback} /> : null}
            <AvatarFallback>{user.fallback}</AvatarFallback>
          </Avatar>
        ))}
        <div
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: 'var(--bg-subtle)',
            border: '2px solid var(--bg-surface)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '12px',
            fontWeight: 600,
            color: 'var(--fg-muted)',
            marginLeft: '-8px',
          }}
        >
          +5
        </div>
      </div>
    );
  },
};
