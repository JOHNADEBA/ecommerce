"use client";

import Link from "next/link";
import { useUser, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { useCartStore } from "@/lib/store/cart-store";
import { useEffect, useState } from "react";

export function Header() {
  const { isSignedIn } = useUser();
  // Subscribe directly to items and totalItems
  const items = useCartStore((state) => state.items);
  const totalItems = useCartStore((state) => state.totalItems);
  const [itemCount, setItemCount] = useState(0);

  useEffect(() => {
    setItemCount(totalItems());
  }, [items, totalItems]);

  return (
    <header className="border-b">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="text-2xl font-bold">
          E-Store
        </Link>

        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/products" className="hover:text-primary">
            Products
          </Link>
          <Link href="/categories" className="hover:text-primary">
            Categories
          </Link>
          {isSignedIn && (
            <Link href="/orders" className="hover:text-primary">
              Orders
            </Link>
          )}
        </nav>

        <div className="flex items-center space-x-4">
          <Link href="/cart" className="relative">
            <Button variant="ghost" size="icon">
              <ShoppingCart className="h-5 w-5" />
              {itemCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                  {itemCount}
                </span>
              )}
            </Button>
          </Link>

          {!isSignedIn ? (
            <>
              <SignInButton mode="modal">
                <Button variant="ghost">Sign In</Button>
              </SignInButton>
              <SignUpButton mode="modal">
                <Button>Sign Up</Button>
              </SignUpButton>
            </>
          ) : (
            <UserButton />
          )}
        </div>
      </div>
    </header>
  );
}
