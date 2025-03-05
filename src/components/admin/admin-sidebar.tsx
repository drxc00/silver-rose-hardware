"use client";
import {
  ChartBarStackedIcon,
  LayoutDashboard,
  LogOutIcon,
  Package,
  Quote,
  Settings,
  Users,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { User } from "next-auth";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { clientLogout } from "@/app/(server)/actions/auth-actions";

// Menu items.
const items = [
  {
    title: "Dashboard",
    baseUrl: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Products",
    baseUrl: "/admin/products",
    children: ["add", "edit"],
    icon: Package,
  },
  {
    title: "Categories",
    baseUrl: "/admin/categories",
    children: ["add", "edit"],
    icon: ChartBarStackedIcon,
  },
  {
    title: "Quotations",
    baseUrl: "/admin/quotations",
    icon: Quote,
  },
];

export function AdminSidebar() {
  // Get url of the current page
  const pathname = usePathname();
  return (
    <Sidebar>
      <SidebarHeader className="flex flex-col gap-4 pt-4 px-4">
        <div className="flex flex-row items-center gap-2">
          <div className="p-2">
            <h1 className="font-semibold">Silver Rose Hardware</h1>
            <p className="text-xs text-muted-foreground">Admin Panel</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="p-4 pt-0">
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                isActive={
                  pathname === item.baseUrl ||
                  item.children?.some(
                    (child) => pathname === `${item.baseUrl}/${child}`
                  )
                }
              >
                <Link href={item.baseUrl}>
                  <item.icon />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <Popover>
          <PopoverTrigger>
            <Settings />
          </PopoverTrigger>
          <PopoverContent className="px-2 py-2">
            <Button
              className="flex gap-2 w-full justify-start"
              variant="ghost"
              onClick={async () => await clientLogout("/admin/login")}
            >
              <LogOutIcon className="w-4 h-4" />
              <span>Logout</span>
            </Button>
          </PopoverContent>
        </Popover>
      </SidebarFooter>
    </Sidebar>
  );
}
