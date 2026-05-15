import React from 'react';
import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from '@davinci/ui/components/ui/hover-card';

export default {
  title: 'Components/HoverCard',
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
};

export const Default = {
  render: () => (
    <HoverCard>
      <HoverCardTrigger asChild>
        <a
          href="#"
          className="text-sm font-medium underline underline-offset-4 hover:text-primary"
          onClick={(e) => e.preventDefault()}
        >
          @shadcn
        </a>
      </HoverCardTrigger>
      <HoverCardContent className="w-72">
        <div className="flex gap-4">
          <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-sm font-bold flex-shrink-0">
            SC
          </div>
          <div className="flex flex-col gap-1">
            <h4 className="text-sm font-semibold">@shadcn</h4>
            <p className="text-sm text-muted-foreground">
              The designer and developer behind shadcn/ui. Building beautiful components.
            </p>
            <p className="text-xs text-muted-foreground mt-1">Joined December 2021</p>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  ),
};

export const UserProfile = {
  render: () => (
    <div className="flex gap-4">
      {[
        { handle: '@alice', name: 'Alice Johnson', bio: 'Frontend engineer & design systems enthusiast.' },
        { handle: '@bob', name: 'Bob Smith', bio: 'Full-stack developer. Open source contributor.' },
      ].map(({ handle, name, bio }) => (
        <HoverCard key={handle}>
          <HoverCardTrigger asChild>
            <a
              href="#"
              className="text-sm font-medium underline underline-offset-4 hover:text-primary"
              onClick={(e) => e.preventDefault()}
            >
              {handle}
            </a>
          </HoverCardTrigger>
          <HoverCardContent className="w-64">
            <div className="flex gap-3">
              <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold flex-shrink-0">
                {handle[1].toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-semibold">{name}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{bio}</p>
              </div>
            </div>
          </HoverCardContent>
        </HoverCard>
      ))}
    </div>
  ),
};
