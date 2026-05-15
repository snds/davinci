// Swizzled against @docusaurus/theme-classic@3.10.0
// SAFE: prop (editUrl) is stable public API
import React from 'react';
import Translate from '@docusaurus/Translate';
import { Button } from '@davinci/ui/components/ui/button';
import { Pencil } from 'lucide-react';

export default function EditThisPage({ editUrl }) {
  return (
    <Button variant="ghost" size="sm" asChild>
      <a href={editUrl} target="_blank" rel="noreferrer noopener">
        <Pencil />
        <Translate id="theme.common.editThisPage">Edit this page</Translate>
      </a>
    </Button>
  );
}
