"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Users,
  Settings,
  PanelLeft,
  LogOut,
} from "lucide-react"

import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useIsMobile } from "@/hooks/use-mobile"
import { useAuth } from "@/hooks/use-auth"
import { useEffect } from "react"

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/customers", label: "Customers", icon: Users },
  { href: "/admin/settings", label: "Settings", icon: Settings },
]

function AdminNav() {
  const pathname = usePathname()

  return (
    <SidebarMenu>
      {navItems.map((item) => (
        <SidebarMenuItem key={item.label}>
          <SidebarMenuButton
            asChild
            isActive={item.href === '/admin/dashboard' ? pathname === item.href : pathname.startsWith(item.href)}
            tooltip={{ children: item.label }}
          >
            <Link href={item.href}>
              <item.icon />
              <span>{item.label}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  )
}

function AdminHeader() {
  const isMobile = useIsMobile()
  const { adminLogout } = useAuth()
  return (
    <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
      {!isMobile ? (
        <SidebarTrigger />
      ) : (
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="shrink-0 md:hidden">
              <PanelLeft className="h-5 w-5" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="flex flex-col p-0">
            <SidebarHeader className="p-2">
              <Link href="/" className="flex items-center">
                <span className="font-headline text-2xl font-bold">Clothiva</span>
              </Link>
            </SidebarHeader>
            <AdminNav />
          </SheetContent>
        </Sheet>
      )}

      <div className="w-full flex-1 text-center">
        <h1 className="text-xl font-headline font-semibold">Admin Panel</h1>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary" size="icon" className="rounded-full">
            <Avatar className="h-8 w-8">
              <AvatarImage src="https://picsum.photos/seed/admin/100/100" alt="Admin" data-ai-hint="woman portrait"/>
              <AvatarFallback>A</AvatarFallback>
            </Avatar>
            <span className="sr-only">Toggle user menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Admin Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={adminLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  )
}

function ProtectedAdminLayout({ children }: { children: React.ReactNode }) {
    const { admin } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!admin) {
            router.replace('/admin/login');
        }
    }, [admin, router]);

    if (!admin) {
        return null; // Or a loading spinner
    }

    return (
        <SidebarProvider>
        <Sidebar collapsible="icon">
            <SidebarHeader>
            <Link href="/" className="flex items-center">
                <span className="font-headline text-2xl font-bold">Clothiva</span>
                </Link>
            </SidebarHeader>
            <SidebarContent className="mt-4">
            <AdminNav />
            </SidebarContent>
        </Sidebar>
        <SidebarInset>
            <AdminHeader />
            <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 bg-background">
            {children}
            </main>
        </SidebarInset>
        </SidebarProvider>
    );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    if (pathname === '/admin/login') {
        return <>{children}</>;
    }

    return <ProtectedAdminLayout>{children}</ProtectedAdminLayout>
}
