"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Cart } from "@/lib/api/types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ChevronDown, ChevronUp, Package } from "lucide-react";

interface OrderSummaryProps {
  cart: Cart;
}

export function OrderSummary({ cart }: OrderSummaryProps) {
  const [showItems, setShowItems] = useState(false);

  // Calculate totals
  const subtotal =
    cart.items?.reduce(
      (sum, item) => sum + (item.product?.price || 0) * (item.quantity || 0),
      0,
    ) || 0;

  const shipping = subtotal > 50 ? 0 : 5.99;
  const tax = subtotal * 0.1; // 10% tax
  const total = subtotal + shipping + tax;

  if (!cart.items || cart.items.length === 0) {
    return (
      <Card className="p-6 sticky top-24">
        <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
        <div className="text-center py-8">
          <Package className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
          <p className="text-muted-foreground">Your cart is empty</p>
          <Button asChild className="mt-4">
            <Link href="/products">Continue Shopping</Link>
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 sticky top-24">
      <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

      {/* Items Summary */}
      <div className="mb-4">
        <button
          onClick={() => setShowItems(!showItems)}
          className="flex items-center justify-between w-full text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <span>
            {cart.items.length} {cart.items.length === 1 ? "item" : "items"} in
            cart
          </span>
          {showItems ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </button>

        {showItems && (
          <div className="mt-4 space-y-3 max-h-60 overflow-y-auto pr-2">
            {cart.items.map((item) => (
              <div key={item.id} className="flex gap-3">
                <Link
                  href={`/products/${item.product?.slug || ""}`}
                  className="shrink-0"
                >
                  <div className="relative w-12 h-12 rounded-md overflow-hidden bg-muted">
                    {item.product?.images?.[0] ? (
                      <Image
                        src={item.product.images[0]}
                        alt={item.product.name || "Product"}
                        fill
                        priority
                        className="object-cover"
                      />
                    ) : (
                      <Package className="h-6 w-6 m-3 text-muted-foreground" />
                    )}
                  </div>
                </Link>
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/products/${item.product?.slug || ""}`}
                    className="text-sm hover:text-primary transition-colors line-clamp-1"
                  >
                    {item.product?.name || "Product"}
                  </Link>
                  <p className="text-xs text-muted-foreground">
                    Qty: {item.quantity}
                  </p>
                </div>
                <span className="text-sm font-medium">
                  $
                  {((item.product?.price || 0) * (item.quantity || 0)).toFixed(
                    2,
                  )}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <Separator className="my-4" />

      {/* Price Breakdown */}
      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-muted-foreground">Shipping</span>
          {shipping === 0 ? (
            <span className="text-green-600 font-medium">Free</span>
          ) : (
            <span>${shipping.toFixed(2)}</span>
          )}
        </div>

        <div className="flex justify-between">
          <span className="text-muted-foreground">Estimated Tax</span>
          <span>${tax.toFixed(2)}</span>
        </div>
      </div>

      <Separator className="my-4" />

      {/* Total */}
      <div className="flex justify-between font-semibold text-lg mb-6">
        <span>Total</span>
        <span className="text-primary">${total.toFixed(2)}</span>
      </div>

      {/* Free Shipping Progress */}
      {subtotal < 50 && (
        <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 mb-4">
          <p className="text-xs text-blue-800 dark:text-blue-400">
            ✨ Add ${(50 - subtotal).toFixed(2)} more for{" "}
            <span className="font-semibold">FREE shipping</span>!
          </p>
          <div className="w-full bg-blue-200 dark:bg-blue-800 h-1.5 rounded-full mt-2">
            <div
              className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${Math.min((subtotal / 50) * 100, 100)}%` }}
            />
          </div>
        </div>
      )}

      {/* Return to Cart Link */}
      <Button variant="link" asChild className="w-full text-sm">
        <Link href="/cart">← Return to Cart</Link>
      </Button>

      {/* Trust Badge */}
      <p className="text-xs text-center text-muted-foreground mt-4">
        🔒 Secure checkout powered by Stripe
      </p>
    </Card>
  );
}
