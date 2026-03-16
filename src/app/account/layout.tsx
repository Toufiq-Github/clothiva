"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  User,
  ShoppingBag,
  LogOut,
  LayoutDashboard,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

const navItems = [
  { href: "/account/profile", label: "Profile", icon: User },
  { href: "/account/orders", label: "Orders", icon: ShoppingBag },
]

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const { user, logout, admin } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user === null) {
      router.push('/login')
    }
  }, [user, router])

  if (!user) {
      return null // or a loading spinner
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
        <header className="mb-8">
            <h1 className="text-4xl font-bold font-headline">My Account</h1>
        </header>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
        <aside className="md:col-span-1">
          <nav className="flex flex-col space-y-2 sticky top-24">
            {navItems.map((item) => (
              <Button
                key={item.href}
                asChild
                variant="ghost"
                className={cn(
                  "justify-start",
                  pathname.startsWith(item.href) && "bg-muted hover:bg-muted"
                )}
              >
                <Link href={item.href}>
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.label}
                </Link>
              </Button>
            ))}
             {admin && <Button
                asChild
                variant="ghost"
                className="justify-start"
              >
                <Link href="/admin/dashboard">
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  Admin
                </Link>
              </Button>}
            <Button variant="ghost" onClick={logout} className="justify-start text-red-500 hover:text-red-600">
               <LogOut className="mr-2 h-4 w-4" />
                Logout
            </Button>
          </nav>
        </aside>
        <main className="md:col-span-3">{children}</main>
      </div>
    </div>
  )
}
