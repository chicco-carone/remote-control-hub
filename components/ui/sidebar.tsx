// Main export file for sidebar components
// This file maintains backward compatibility while using the refactored structure

export { useSidebar } from "./sidebar/sidebar-context";
export { SidebarProvider } from "./sidebar/sidebar-provider";
export {
  Sidebar,
  SidebarRail,
  SidebarTrigger,
} from "./sidebar/sidebar-components";
export {
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "./sidebar/sidebar-menu";
export {
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarInput,
  SidebarMenuSkeleton,
  SidebarSeparator,
} from "./sidebar/sidebar-layout";
