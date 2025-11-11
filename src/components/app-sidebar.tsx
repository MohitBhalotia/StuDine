import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Image from "next/image";
import {
  AlertTriangle,
  Bell,
  LayoutDashboard,
  Menu,
  ShoppingCart,
} from "lucide-react";
import { ModeToggle } from "./theme-toggle";
const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Menu",
      url: "/menu",
      icon: Menu,
    },
    {
      title: "Orders",
      url: "/orders",
      icon: ShoppingCart,
    },
    {
      title: "Issues",
      url: "/issues",
      icon: AlertTriangle,
    },
    {
      title: "Notices",
      url: "/notices",
      icon: Bell,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5"
            >
              <Image
                src="/logo.png"
                alt="StuDine"
                className="w-full h-full object-contain"
                width={200}
                height={200}
                priority
              />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter className="flex flex-col items-center justify-between">
        <Image
          src="/iiitn.png"
          alt="Studine Logo"
          width={100}
          height={100}
          className="rounded-md mb-12"
        />
        <div className="flex  items-center justify-between">
          <NavUser />
          <ModeToggle />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
