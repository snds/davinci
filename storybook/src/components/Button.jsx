import React from 'react';
import { Button as ShadcnButton } from '@davinci/ui/components/ui/button';
import Icon from './Icon';

// Map Davinci variant names to shadcn variants
const VARIANT_MAP = {
  primary:     'default',
  secondary:   'secondary',
  outline:     'outline',
  ghost:       'ghost',
  destructive: 'destructive',
  link:        'link',
};

function Button({ variant = 'secondary', size, pill, children, onClick, icon, iconRight, style, className, ...props }) {
  const shadcnVariant = VARIANT_MAP[variant] ?? variant;
  const shadcnSize   = size === 'sm' ? 'sm' : size === 'lg' ? 'lg' : 'default';

  return (
    <ShadcnButton
      variant={shadcnVariant}
      size={shadcnSize}
      onClick={onClick}
      style={style}
      className={[pill && 'rounded-full', className].filter(Boolean).join(' ') || undefined}
      {...props}
    >
      {icon && <Icon name={icon} style={{ fontSize: 16 }} />}
      {children}
      {iconRight && <Icon name={iconRight} style={{ fontSize: 16 }} />}
    </ShadcnButton>
  );
}

export default Button;
