// Swizzled against @docusaurus/theme-classic@3.10.0
// SAFE: props (label, permalink, count) are stable public API
import React from 'react';
import Link from '@docusaurus/Link';
import { Badge } from '@davinci/ui/components/ui/badge';

export default function Tag({ label, permalink, count }) {
  return (
    <Badge variant="secondary" asChild>
      <Link to={permalink}>
        {label}
        {count !== undefined && <span className="ml-1 opacity-60">({count})</span>}
      </Link>
    </Badge>
  );
}
