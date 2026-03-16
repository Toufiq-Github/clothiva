'use client';

import Link from 'next/link';
import { User, ShoppingBag, Search, Menu } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';

import { Button } from '@/components/ui/button';
import { CartSheet } from '@/components/app/cart-sheet';
import { useCart } from '@/hooks/use-cart';
import { Input } from '@/components/ui/input';
import { ThemeToggle } from '@/components/app/theme-toggle';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/products?category=women', label: 'Women' },
  { href: '/products?category=men', label: 'Men' },
  { href: '/products?category=kids', label: 'Kids' },
  { href: '/products', label: 'All Products' },
];

export function AppHeader() {
  const { items } = useCart();
  const { user, logout } = useAuth();
  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto flex h-16 items-center px-4">
        {/* Mobile Menu Toggle */}
        <div className="flex md:hidden mr-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <SheetHeader>
                <SheetTitle className="text-left font-headline text-2xl">Clothiva</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-4 mt-8">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-lg font-medium text-foreground/70 transition-colors hover:text-primary"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>

        <Link href="/" className="mr-6 flex items-center">
          <span className="font-headline text-2xl font-bold">Clothiva</span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-foreground/70 transition-colors hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex flex-1 items-center justify-end gap-1 md:gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon" suppressHydrationWarning>
                <Search className="h-5 w-5" />
                <span className="sr-only">Search</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="p-0 top-[20%]">
              <DialogHeader className="sr-only">
                <DialogTitle>Search products</DialogTitle>
                <DialogDescription>
                  Type in the input field to search for products.
                </DialogDescription>
              </DialogHeader>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search products..."
                  className="h-16 w-full border-0 bg-transparent pl-12 pr-4 text-base focus-visible:ring-0 focus-visible:ring-offset-0"
                  suppressHydrationWarning
                />
              </div>
            </DialogContent>
          </Dialog>
          
          <ThemeToggle />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" suppressHydrationWarning>
                <User className="h-5 w-5" />
                <span className="sr-only">User Menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {user ? (
                <>
                  <DropdownMenuLabel>Hi, {user.name}!</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/account">My Account</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={logout}>Logout</DropdownMenuItem>
                </>
              ) : (
                <>
                  <DropdownMenuItem asChild>
                    <Link href="/login">Login</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/register">Create Account</Link>
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
          
          <CartSheet>
            <Button variant="ghost" size="icon" className="relative" suppressHydrationWarning>
              <ShoppingBag className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  {totalItems}
                </span>
              )}
              <span className="sr-only">Shopping Cart</span>
            </Button>
          </CartSheet>
        </div>
      </div>
    </header>
  );
}
