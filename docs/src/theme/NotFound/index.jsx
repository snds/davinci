// Swizzled against @docusaurus/theme-classic@3.10.0
// SAFE: PageMetadata, Layout, and translate are stable public APIs
// Required as parent shell so @theme/NotFound resolves — do not delete without updating Content too
import React from 'react';
import { translate } from '@docusaurus/Translate';
import { PageMetadata } from '@docusaurus/theme-common';
import Layout from '@theme/Layout';
import NotFoundContent from '@theme/NotFound/Content';

export default function NotFound() {
  const title = translate({
    id: 'theme.NotFound.title',
    message: 'Page Not Found',
  });
  return (
    <>
      <PageMetadata title={title} />
      <Layout>
        <NotFoundContent />
      </Layout>
    </>
  );
}
