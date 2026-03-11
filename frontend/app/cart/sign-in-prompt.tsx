"use client";

import { SignInButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useCartStore } from "@/lib/store/cart-store";
import { useRouter } from "next/navigation";

export function SignInPrompt() {
  const { items } = useCartStore();
  const router = useRouter();

  return (
    <div className="container mx-auto px-4 py-16 max-w-md text-center">
      <Card className="p-8">
        <ShoppingCart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
        <h1 className="text-2xl font-bold mb-4">Sign in to View Cart</h1>
        <p className="text-muted-foreground mb-2">
          You have {items.length} item(s) in your cart.
        </p>
        <p className="text-muted-foreground mb-8">
          Please sign in to save your items and complete checkout.
        </p>
        <SignInButton mode="modal">
          <Button size="lg" className="w-full">
            Sign In
          </Button>
        </SignInButton>
        <Button
          variant="link"
          className="mt-4"
          onClick={() => router.push("/products")}
        >
          Continue Shopping
        </Button>
      </Card>
    </div>
  );
}
