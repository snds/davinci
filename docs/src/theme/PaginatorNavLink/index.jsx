// Swizzled against @docusaurus/theme-classic@3.10.0
// SAFE: props (permalink, title, subLabel, isNext) are stable public API
import React from 'react';
import Link from '@docusaurus/Link';
import { Button } from '@davinci/ui/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function PaginatorNavLink({ permalink, title, subLabel, isNext }) {
  return (
    <Button variant="outline" asChild className={isNext ? 'ml-auto' : ''}>
      <Link to={permalink}>
        {!isNext && <ChevronLeft />}
        <span className="flex flex-col items-start gap-0.5">
          <span className="text-xs text-muted-foreground font-normal">{subLabel}</span>
          <span>{title}</span>
        </span>
        {isNext && <ChevronRight />}
      </Link>
    </Button>
  );
}
