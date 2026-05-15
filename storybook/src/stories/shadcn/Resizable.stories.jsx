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
      style={{ height: '200px', width: '500px', border: '1px solid #e5e7eb', borderRadius: '8px' }}
    >
      <ResizablePanel defaultSize={50}>
        <div
          style={{
            display: 'flex',
            height: '100%',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '14px',
            color: '#6b7280',
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
            color: '#6b7280',
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
      style={{ height: '300px', width: '400px', border: '1px solid #e5e7eb', borderRadius: '8px' }}
    >
      <ResizablePanel defaultSize={40}>
        <div
          style={{
            display: 'flex',
            height: '100%',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '14px',
            color: '#6b7280',
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
            color: '#6b7280',
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
      style={{ height: '200px', width: '600px', border: '1px solid #e5e7eb', borderRadius: '8px' }}
    >
      <ResizablePanel defaultSize={25}>
        <div
          style={{
            display: 'flex',
            height: '100%',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '13px',
            color: '#6b7280',
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
            color: '#6b7280',
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
            color: '#6b7280',
          }}
        >
          Detail
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  ),
};
