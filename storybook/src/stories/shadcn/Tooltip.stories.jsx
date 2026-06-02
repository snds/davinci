import React from 'react';
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from '@davinci/ui/components/ui/tooltip';
import { Button } from '@davinci/ui/components/ui/button';

export default {
  title: 'Components/Tooltip',
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
};

export const Default = {
  render: () => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline">Hover me</Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Add to library</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ),
};

export const SideRight = {
  render: () => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline">Hover for right tooltip</Button>
        </TooltipTrigger>
        <TooltipContent side="right">
          <p>Tooltip on the right</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ),
};

export const AllSides = {
  render: () => (
    <TooltipProvider>
      <div className="grid grid-cols-2 gap-6 p-8">
        {['top', 'right', 'bottom', 'left'].map((side) => (
          <Tooltip key={side}>
            <TooltipTrigger asChild>
              <Button variant="outline" className="w-32">{side}</Button>
            </TooltipTrigger>
            <TooltipContent side={side}>
              <p>Tooltip on {side}</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  ),
};

export const WithShortcut = {
  render: () => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button size="icon" variant="outline">
            <span className="sr-only">Bold</span>
            <strong>B</strong>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Bold <kbd className="ml-1 rounded bg-muted px-1 py-0.5 text-xs font-mono">⌘B</kbd></p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ),
};
