
"use client";

import type React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  LayoutDashboard,
  Users,
  DollarSign,
  FileText,
  Briefcase,
  Receipt,
  Truck,
  ClipboardList,
  FilePlus,
  TrendingUp,
  Package,
  Boxes,
  Settings,
  Calculator,
  Coins,
  UserCog,
  CreditCard,
  ShoppingCart,
  Wallet,
  Palette,
  ShieldCheck,
  Bell,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarInset,
  SidebarTrigger,
  SidebarGroup,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";


interface NavItem {
  href: string;
  icon: React.ElementType;
  label: string;
  // subItems are not directly rendered in the sidebar by this component,
  // but can be used for structuring or future enhancements.
  // The /settings page acts as a hub for settings sub-pages.
  subItems?: NavItem[]; 
  group: string;
}

const navItems: NavItem[] = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard", group: "Overview" },
  { href: "/transactions", icon: DollarSign, label: "Transactions", group: "Financials" },
  { href: "/budgets", icon: Wallet, label: "Budgets", group: "Financials" },
  { href: "/invoices", icon: FileText, label: "Invoices", group: "Sales & CRM" },
  { href: "/quotations", icon: FilePlus, label: "Quotations", group: "Sales & CRM" },
  { href: "/sales", icon: TrendingUp, label: "Sales", group: "Sales & CRM" },
  { href: "/clients", icon: Users, label: "Clients", group: "Sales & CRM" },
  { href: "/expenses", icon: Receipt, label: "Expenses", group: "Operations" },
  { href: "/bills", icon: CreditCard, label: "Bills", group: "Operations" },
  { href: "/vendors", icon: Truck, label: "Vendors", group: "Operations" },
  { href: "/items", icon: Package, label: "Items & Services", group: "Inventory" },
  { href: "/inventory", icon: Boxes, label: "Inventory", group: "Inventory" },
  { href: "/reports", icon: BarChart3, label: "Reports", group: "Analysis" },
  { 
    href: "/settings", 
    icon: Settings, 
    label: "Settings", 
    group: "System",
    // These subItems are for logical grouping. Navigation to these occurs via the /settings page.
    subItems: [ 
      { href: "/settings/general", icon: Settings, label: "General", group: "System" },
      { href: "/settings/tax", icon: Calculator, label: "Tax Settings", group: "System" },
      { href: "/settings/currency", icon: Coins, label: "Currency Converter", group: "System" },
      { href: "/settings/users", icon: UserCog, label: "User Management", group: "System" },
      { href: "/settings/appearance", icon: Palette, label: "Appearance", group: "System" },
      { href: "/settings/security", icon: ShieldCheck, label: "Security", group: "System" },
      { href: "/settings/notifications", icon: Bell, label: "Notifications", group: "System" },
    ]
  },
];

const navGroups = ["Overview", "Financials", "Sales & CRM", "Operations", "Inventory", "Analysis", "System"];


export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen">
      <Sidebar collapsible="icon" side="left" variant="sidebar" className="border-r">
        <SidebarHeader className="p-4">
          <div className="flex items-center gap-2 group-data-[collapsible=icon]:justify-center">
            <Briefcase className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-semibold text-primary group-data-[collapsible=icon]:hidden">
              BudgetFlow
            </h1>
          </div>
        </SidebarHeader>
        <SidebarContent className="flex-1 overflow-y-auto">
          {navGroups.map((groupName) => (
            <SidebarGroup key={groupName}>
              <SidebarGroupLabel className="group-data-[collapsible=icon]:hidden">
                {groupName}
              </SidebarGroupLabel>
              <SidebarMenu>
                {navItems.filter(item => item.group === groupName).map((item) => (
                  <SidebarMenuItem key={item.href}>
                    <Link href={item.href} legacyBehavior passHref>
                      <SidebarMenuButton
                        asChild
                        isActive={pathname === item.href || (pathname.startsWith(item.href) && item.href !== "/" && item.href !== "/settings") || (item.href === "/settings" && pathname.startsWith("/settings"))}
                        tooltip={item.label}
                        className={cn(
                            "w-full justify-start",
                           (pathname === item.href || (pathname.startsWith(item.href) && item.href !== "/" && item.href !== "/settings") || (item.href === "/settings" && pathname.startsWith("/settings"))) ? "bg-sidebar-accent text-sidebar-accent-foreground" : ""
                          )}
                      >
                        <a>
                          <item.icon className="h-5 w-5" />
                          <span className="group-data-[collapsible=icon]:hidden">{item.label}</span>
                        </a>
                      </SidebarMenuButton>
                    </Link>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroup>
          ))}
        </SidebarContent>
        <SidebarHeader className="p-2 mt-auto border-t">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="w-full justify-start p-2 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:w-auto">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="https://picsum.photos/100/100" alt="User Avatar" data-ai-hint="user avatar"/>
                  <AvatarFallback>BF</AvatarFallback>
                </Avatar>
                <span className="ml-2 group-data-[collapsible=icon]:hidden">User Name</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="right" align="start" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/settings">Settings</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarHeader>
      </Sidebar>
      <SidebarInset className="flex-1 flex flex-col">
        <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 py-4">
          <SidebarTrigger className="sm:hidden" />
          <div className="flex-1">
            {/* Could add breadcrumbs or page title here */}
          </div>
        </header>
        <main className="flex-1 overflow-auto p-4 sm:px-6 sm:py-0">
          {children}
        </main>
      </SidebarInset>
    </div>
  );
}
