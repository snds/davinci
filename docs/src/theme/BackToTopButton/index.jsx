// Swizzled against @docusaurus/theme-classic@3.10.0
// SAFE: no Docusaurus hooks — self-contained scroll logic
import React, { useCallback, useEffect, useState } from 'react';
import { Button } from '@davinci/ui/components/ui/button';
import { ArrowUp } from 'lucide-react';
import clsx from 'clsx';

export default function BackToTopButton() {
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const onScroll = () => setShown(window.scrollY > 300);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  if (!shown) return null;

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={scrollToTop}
      aria-label="Scroll back to top"
      className="fixed bottom-6 right-6 z-50 shadow-md"
    >
      <ArrowUp />
    </Button>
  );
}
