// Swizzled against @docusaurus/theme-classic@3.10.0
// SAFE: Root wraps the entire app — no Docusaurus-specific hooks used
// Syncs .dark class from data-theme attribute for shadcn/Tailwind dark variant compatibility
import React, { useEffect } from 'react';

// Docusaurus signals dark mode via data-theme="dark" on <html>.
// The Tailwind dark variant in globals.css supports both data-theme="dark"
// and .dark class. This observer keeps .dark in sync so any embedded
// shadcn components that check classList directly continue to work.
function syncDarkClass() {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  document.documentElement.classList.toggle('dark', isDark);
}

export default function Root({ children }) {
  useEffect(() => {
    syncDarkClass();

    const observer = new MutationObserver((mutations) => {
      for (const m of mutations) {
        if (m.attributeName === 'data-theme' || m.attributeName === 'class') {
          const shouldBeDark = document.documentElement.getAttribute('data-theme') === 'dark';
          const hasDark = document.documentElement.classList.contains('dark');
          if (shouldBeDark !== hasDark) syncDarkClass();
          break;
        }
      }
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme', 'class'],
    });

    return () => observer.disconnect();
  }, []);

  return <>{children}</>;
}
