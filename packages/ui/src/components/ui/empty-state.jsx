import * as React from 'react';
import { cn } from '@/lib/utils';

const EmptyState = React.forwardRef(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'flex flex-col items-center justify-center gap-4 rounded-lg border border-dashed border-border bg-bg-subtle px-6 py-12 text-center',
      className
    )}
    {...props}
  >
    {children}
  </div>
));
EmptyState.displayName = 'EmptyState';

const EmptyStateIcon = React.forwardRef(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'flex size-12 items-center justify-center rounded-full bg-bg-surface text-fg-muted',
      className
    )}
    {...props}
  >
    {children}
  </div>
));
EmptyStateIcon.displayName = 'EmptyStateIcon';

const EmptyStateTitle = React.forwardRef(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-base font-semibold text-fg', className)}
    {...props}
  />
));
EmptyStateTitle.displayName = 'EmptyStateTitle';

const EmptyStateDescription = React.forwardRef(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('max-w-xs text-sm text-muted-foreground', className)}
    {...props}
  />
));
EmptyStateDescription.displayName = 'EmptyStateDescription';

const EmptyStateAction = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex gap-2', className)}
    {...props}
  />
));
EmptyStateAction.displayName = 'EmptyStateAction';

export {
  EmptyState,
  EmptyStateIcon,
  EmptyStateTitle,
  EmptyStateDescription,
  EmptyStateAction,
};
