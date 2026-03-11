"use client";

import { useState } from "react";
import Link from "next/link";
import { useUser, SignInButton, SignUpButton, useClerk } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import {
  ShoppingCart,
  Menu,
  Package,
  Grid,
  HelpCircle,
  Mail,
  Truck,
  RotateCcw,
  Shield,
  Star,
  LogOut,
  User,
} from "lucide-react";
import { useCartStore } from "@/lib/store/cart-store";
import { useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const { isSignedIn, user } = useUser();
  const { signOut } = useClerk();
  const items = useCartStore((state) => state.items);
  const totalItems = useCartStore((state) => state.totalItems);
  const [itemCount, setItemCount] = useState(0);

  useEffect(() => {
    setItemCount(totalItems());
  }, [items, totalItems]);

  const closeMenu = () => setIsOpen(false);

  const handleSignOut = async () => {
    await signOut();
    closeMenu();
  };

  const NavLinks = [
    { href: "/products", label: "Products", icon: Package },
    { href: "/categories", label: "Categories", icon: Grid },
    ...(isSignedIn ? [{ href: "/orders", label: "Orders", icon: Star }] : []),
    { href: "/faq", label: "FAQ", icon: HelpCircle },
    { href: "/contact", label: "Contact", icon: Mail },
  ];

  const FooterLinks = [
    { href: "/shipping", label: "Shipping", icon: Truck },
    { href: "/returns", label: "Returns", icon: RotateCcw },
    { href: "/privacy", label: "Privacy", icon: Shield },
  ];

  return (
    <header className="border-b bg-background sticky top-0 z-50">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo - OG-STORE */}
        <Link href="/" className="text-2xl font-bold tracking-tight">
          <span className="text-primary">OG</span>
          <span className="text-foreground">-STORE</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {NavLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right side icons */}
        <div className="flex items-center space-x-4">
          {/* Cart */}
          <Link href="/cart" className="relative">
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingCart className="h-5 w-5" />
              {itemCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                  {itemCount}
                </span>
              )}
            </Button>
          </Link>

          {/* Auth buttons - Desktop */}
          <div className="hidden md:block">
            {!isSignedIn ? (
              <div className="flex items-center space-x-2">
                <SignInButton mode="modal">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <Button size="sm">Sign Up</Button>
                </SignUpButton>
              </div>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href="/profile">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/orders">Orders</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Mobile Menu Sheet */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent side="right" className="w-full sm:w-96 p-0">
          <VisuallyHidden>
            <SheetTitle>Navigation Menu</SheetTitle>
            <SheetDescription>
              Browse through our store categories and account options
            </SheetDescription>
          </VisuallyHidden>

          <div className="flex flex-col h-full">
            {/* Simple header with just logo - Sheet already has its own X button */}
            <div className="p-6 border-b">
              <Link
                href="/"
                className="text-xl font-bold tracking-tight"
                onClick={closeMenu}
              >
                <span className="text-primary">OG</span>
                <span className="text-foreground">-STORE</span>
              </Link>
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 overflow-y-auto py-4">
              <div className="px-3 space-y-1">
                {NavLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={closeMenu}
                      className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg hover:bg-muted transition-colors"
                    >
                      <Icon className="h-5 w-5 text-muted-foreground" />
                      <span>{link.label}</span>
                    </Link>
                  );
                })}
              </div>
            </nav>

            {/* Footer Links */}
            <div className="border-t p-6">
              <p className="text-xs font-medium text-muted-foreground mb-3">
                Customer Service
              </p>
              <div className="grid grid-cols-3 gap-2">
                {FooterLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={closeMenu}
                      className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-muted transition-colors"
                    >
                      <Icon className="h-4 w-4 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">
                        {link.label}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Mobile Sign Out Button - Only show when signed in */}
            {isSignedIn && (
              <div className="border-t p-4">
                <Button
                  variant="destructive"
                  className="w-full"
                  onClick={handleSignOut}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            )}

            {/* Mobile Sign In - Only show when not signed in */}
            {!isSignedIn && (
              <div className="border-t p-4">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground text-center mb-2">
                    Welcome to OG-STORE
                  </p>
                  <div className="flex gap-2">
                    <SignInButton mode="modal">
                      <Button className="flex-1" onClick={closeMenu}>
                        Sign In
                      </Button>
                    </SignInButton>
                    <SignUpButton mode="modal">
                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={closeMenu}
                      >
                        Sign Up
                      </Button>
                    </SignUpButton>
                  </div>
                </div>
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </header>
  );
}
