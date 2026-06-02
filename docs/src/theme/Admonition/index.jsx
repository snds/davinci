// Swizzled against @docusaurus/theme-classic@3.10.0
// SAFE: props (type, title, children) are stable public API
import React from 'react';
import { Alert, AlertTitle, AlertDescription } from '@davinci/ui/components/ui/alert';
import { Info, Lightbulb, AlertTriangle, XCircle, BookOpen, AlertCircle } from 'lucide-react';
import clsx from 'clsx';

const TYPE_MAP = {
  note:    { icon: BookOpen,       className: 'admonition-note' },
  tip:     { icon: Lightbulb,      className: 'admonition-tip' },
  info:    { icon: Info,           className: 'admonition-info' },
  warning: { icon: AlertTriangle,  className: 'admonition-warning' },
  danger:  { icon: XCircle,        className: 'admonition-danger', variant: 'destructive' },
  caution: { icon: AlertCircle,    className: 'admonition-caution' },
};

export default function Admonition({ type = 'note', title, children }) {
  const { icon: Icon, className, variant } = TYPE_MAP[type] ?? TYPE_MAP.note;

  return (
    <Alert variant={variant} className={clsx('my-4', className)}>
      <Icon />
      {title && <AlertTitle>{title}</AlertTitle>}
      <AlertDescription>{children}</AlertDescription>
    </Alert>
  );
}
