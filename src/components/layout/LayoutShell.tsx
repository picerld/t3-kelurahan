"use client";

import * as React from "react";

export function LayoutShell({
  sidebar,
  navbar,
  children,
}: {
  sidebar: React.ReactNode;
  navbar: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex">
        <aside className="fixed top-0 left-0 h-screen w-[280px] bg-sidebar border-r border-sidebar-border px-[30px] pt-[50px] pb-[30px]">
          {sidebar}
        </aside>

        <div className="ml-[280px] flex-1">
          <header className="p-[30px] pb-0">{navbar}</header>
          <main className="flex p-[30px]">{children}</main>
        </div>
      </div>
    </div>
  );
}
