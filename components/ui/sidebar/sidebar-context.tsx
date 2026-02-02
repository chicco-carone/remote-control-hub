"use client";

import * as React from "react";

import type { SidebarContext } from "./sidebar-types";

const SidebarContextInternal = React.createContext<SidebarContext | null>(null);

export function useSidebar(): SidebarContext {
  const context = React.useContext(SidebarContextInternal);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider.");
  }

  return context;
}

export { SidebarContextInternal };
