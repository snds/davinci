import React from 'react';
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from '@davinci/ui/components/ui/resizable';

export default {
  title: 'Components/Resizable',
  component: ResizablePanelGroup,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
};

export const Horizontal = {
  render: () => (
    <ResizablePanelGroup
      direction="horizontal"
      style={{ height: '200px', width: '500px', border: '1px solid var(--border)', borderRadius: '8px' }}
    >
      <ResizablePanel defaultSize={50}>
        <div
          style={{
            display: 'flex',
            height: '100%',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '14px',
            color: 'var(--fg-muted)',
          }}
        >
          Left Panel
        </div>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={50}>
        <div
          style={{
            display: 'flex',
            height: '100%',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '14px',
            color: 'var(--fg-muted)',
          }}
        >
          Right Panel
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  ),
};

export const Vertical = {
  render: () => (
    <ResizablePanelGroup
      direction="vertical"
      style={{ height: '300px', width: '400px', border: '1px solid var(--border)', borderRadius: '8px' }}
    >
      <ResizablePanel defaultSize={40}>
        <div
          style={{
            display: 'flex',
            height: '100%',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '14px',
            color: 'var(--fg-muted)',
          }}
        >
          Top Panel
        </div>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={60}>
        <div
          style={{
            display: 'flex',
            height: '100%',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '14px',
            color: 'var(--fg-muted)',
          }}
        >
          Bottom Panel
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  ),
};

export const ThreePanels = {
  render: () => (
    <ResizablePanelGroup
      direction="horizontal"
      style={{ height: '200px', width: '600px', border: '1px solid var(--border)', borderRadius: '8px' }}
    >
      <ResizablePanel defaultSize={25}>
        <div
          style={{
            display: 'flex',
            height: '100%',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '13px',
            color: 'var(--fg-muted)',
          }}
        >
          Sidebar
        </div>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={50}>
        <div
          style={{
            display: 'flex',
            height: '100%',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '13px',
            color: 'var(--fg-muted)',
          }}
        >
          Main
        </div>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={25}>
        <div
          style={{
            display: 'flex',
            height: '100%',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '13px',
            color: 'var(--fg-muted)',
          }}
        >
          Detail
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  ),
};
