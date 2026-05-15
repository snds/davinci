import React from 'react';
import { Badge } from '@davinci/ui/components/ui/badge';

// Map Davinci pill variants to shadcn badge variants
const VARIANT_MAP = {
  default:     'default',
  secondary:   'secondary',
  outline:     'outline',
  destructive: 'destructive',
  // Davinci-specific pill variants fall back to secondary
  accent:      'default',
  alt:         'secondary',
};

function Pill({ children, variant, style }) {
  const shadcnVariant = VARIANT_MAP[variant] ?? 'secondary';
  return (
    <Badge variant={shadcnVariant} style={style}>
      {children}
    </Badge>
  );
}

export default Pill;
