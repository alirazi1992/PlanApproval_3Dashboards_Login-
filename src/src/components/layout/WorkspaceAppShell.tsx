import React from 'react';
import { WorkspaceSidebar } from './WorkspaceSidebar';
import { WorkspaceTopbar } from './WorkspaceTopbar';

export interface WorkspaceAppShellProps {
  children: React.ReactNode;
}

export function WorkspaceAppShell({
  children
}: WorkspaceAppShellProps) {
  return <div className="min-h-screen bg-[#F7F8FA] relative overflow-hidden" dir="rtl">
      <div className="absolute inset-0 bg-gradient-to-b from-white via-[#F7F8FA] to-[#eef1f5]" />

      <div className="relative z-10 flex flex-row-reverse max-w-7xl mx-auto">
        <WorkspaceSidebar />
        <div className="flex-1 flex flex-col min-h-screen text-right px-6 py-8 lg:px-10">
          <WorkspaceTopbar />
          <main className="flex-1">{children}</main>
        </div>
      </div>
    </div>;
}
