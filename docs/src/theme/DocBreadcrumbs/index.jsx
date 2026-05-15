// Swizzled against @docusaurus/theme-classic@3.10.0
// RISK: useSidebarBreadcrumbs is from @docusaurus/plugin-content-docs/client (stable)
//       useHomePageRoute is from @docusaurus/theme-common/internal (internal — may change)
// Wrapped in ErrorBoundary so a breaking API change silently hides breadcrumbs rather
// than crashing the page.
import React from 'react';
import Link from '@docusaurus/Link';
import { useSidebarBreadcrumbs } from '@docusaurus/plugin-content-docs/client';
import { useHomePageRoute } from '@docusaurus/theme-common/internal';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@davinci/ui/components/ui/breadcrumb';

class BreadcrumbErrorBoundary extends React.Component {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? null : this.props.children; }
}

function DocBreadcrumbsInner() {
  const breadcrumbs = useSidebarBreadcrumbs();
  const homePageRoute = useHomePageRoute();

  if (!breadcrumbs || breadcrumbs.length === 0) return null;

  return (
    <Breadcrumb className="mb-4">
      <BreadcrumbList>
        {homePageRoute && (
          <>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to={homePageRoute.path}>Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
          </>
        )}
        {breadcrumbs.map((item, idx) => {
          const isLast = idx === breadcrumbs.length - 1;
          return (
            <React.Fragment key={idx}>
              <BreadcrumbItem>
                {isLast || !item.href ? (
                  <BreadcrumbPage>{item.label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link to={item.href}>{item.label}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {!isLast && <BreadcrumbSeparator />}
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

export default function DocBreadcrumbs() {
  return (
    <BreadcrumbErrorBoundary>
      <DocBreadcrumbsInner />
    </BreadcrumbErrorBoundary>
  );
}
