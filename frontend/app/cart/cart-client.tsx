"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApi } from "@/lib/api/client";
import { useCartStore } from "@/lib/store/cart-store";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ShoppingCart, Trash2, ChevronLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface CartClientProps {
  clerkId: string;
}

export function CartClient({ clerkId }: CartClientProps) {
  const router = useRouter();
  const api = useApi();
  const { items, setItems, updateQuantity, removeItem, clearCart } =
    useCartStore();
  const [loading, setLoading] = useState(true);
  const [updatingItems, setUpdatingItems] = useState<Set<string>>(new Set());
  const hasFetched = useRef(false); // Add this to prevent double fetch

  // Fetch cart on mount only once
  useEffect(() => {
    // Prevent double fetch
    if (hasFetched.current) return;

    let isMounted = true;
    const controller = new AbortController(); // Add abort controller

    const fetchCart = async () => {
      try {
        setLoading(true);
        const cartData = await api.auth.get(`/cart/${clerkId}`);

        if (!isMounted) return;

        if (cartData.items && cartData.items.length > 0) {
          const formattedItems = cartData.items.map((item: any) => ({
            id: item.id,
            productId: item.product.id,
            name: item.product.name,
            price: item.product.price,
            quantity: item.quantity,
            image: item.product.images[0] || "/placeholder.jpg",
            maxStock: item.product.inventory,
          }));
          setItems(formattedItems);
        } else {
          setItems([]);
        }

        hasFetched.current = true;
      } catch (error: any) {
        if (error.name === "AbortError") return;
        if (!isMounted) return;
        console.error("Failed to fetch cart:", error);
        toast.error("Failed to load cart");
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchCart();

    return () => {
      isMounted = false;
      controller.abort(); // Cancel fetch on unmount
    };
  }, [clerkId, api]);

  const handleUpdateQuantity = useCallback(
    async (itemId: string, newQuantity: number) => {
      if (newQuantity < 1) return;

      // Find the item
      const item = items.find((i) => i.id === itemId);
      if (!item) {
        console.error("❌ Item not found:", itemId);
        return;
      }

      const oldQuantity = item.quantity;

      // Optimistically update UI
      updateQuantity(itemId, newQuantity);

      setUpdatingItems((prev) => new Set(prev).add(itemId));

      try {
        await api.auth.patch(`/cart/${clerkId}/items/${itemId}`, {
          quantity: newQuantity,
        });
      } catch (error: any) {
        console.error("❌ API request failed:", error);
        // Revert on error
        updateQuantity(itemId, oldQuantity);

        const errorMessage =
          error.response?.data?.message || "Failed to update quantity";
        toast.error(errorMessage);
      } finally {
        setUpdatingItems((prev) => {
          const next = new Set(prev);
          next.delete(itemId);
          return next;
        });
      }
    },
    [clerkId, api, items, updateQuantity],
  );

  const handleRemoveItem = useCallback(
    async (itemId: string) => {
      // Optimistically remove from UI
      const item = items.find((i) => i.id === itemId);
      if (!item) return;

      // Update local state immediately
      const updatedItems = items.filter((i) => i.id !== itemId);
      setItems(updatedItems);
      setUpdatingItems((prev) => new Set(prev).add(itemId));

      try {
        await api.auth.delete(`/cart/${clerkId}/items/${itemId}`);
        toast.success("Item removed from cart", { duration: 1500 });
      } catch (error) {
        // Revert on error
        setItems(items); // Restore original items
        console.error("Failed to remove item:", error);
        toast.error("Failed to remove item");
      } finally {
        setUpdatingItems((prev) => {
          const next = new Set(prev);
          next.delete(itemId);
          return next;
        });
      }
    },
    [clerkId, api, items, setItems],
  );

  const handleClearCart = useCallback(async () => {
    const currentItems = [...items];
    clearCart();

    try {
      await api.auth.delete(`/cart/${clerkId}/clear`);
      toast.success("Cart cleared", { duration: 1500 });
    } catch (error) {
      // Revert on error
      setItems(currentItems);
      console.error("Failed to clear cart:", error);
      toast.error("Failed to clear cart");
    }
  }, [clerkId, api, items, clearCart, setItems]);

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const shipping = subtotal > 50 ? 0 : 5.99;
  const tax = subtotal * 0.1;
  const total = subtotal + shipping + tax;

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-md text-center">
        <ShoppingCart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
        <h1 className="text-2xl font-bold mb-4">Your Cart is Empty</h1>
        <p className="text-muted-foreground mb-8">
          Looks like you haven't added anything to your cart yet.
        </p>
        <Button asChild size="lg">
          <Link href="/products">Continue Shopping</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => {
            const isUpdating = updatingItems.has(item.id);

            return (
              <Card key={item.id} className="p-4">
                <div className="flex gap-4">
                  {/* Product Image */}
                  <Link
                    href={`/products/${item.productId}`}
                    className="shrink-0"
                  >
                    <div className="relative w-24 h-24 rounded-md overflow-hidden">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover"
                      />
                    </div>
                  </Link>

                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/products/${item.productId}`}
                      className="hover:text-primary transition-colors"
                    >
                      <h3 className="font-semibold truncate">{item.name}</h3>
                    </Link>
                    <p className="text-lg font-bold text-primary mt-1">
                      ${item.price.toFixed(2)}
                    </p>

                    <div className="flex items-center gap-4 mt-2">
                      {/* Quantity Controls */}
                      <div className="flex items-center border rounded-md">
                        <button
                          onClick={() =>
                            handleUpdateQuantity(item.id, item.quantity - 1)
                          }
                          disabled={item.quantity <= 1 || isUpdating}
                          className="px-2 py-1 hover:bg-muted transition-colors disabled:opacity-50"
                        >
                          -
                        </button>
                        <span className="w-10 text-center">
                          {isUpdating ? (
                            <Loader2 className="h-4 w-4 animate-spin mx-auto" />
                          ) : (
                            item.quantity
                          )}
                        </span>
                        <button
                          onClick={() =>
                            handleUpdateQuantity(item.id, item.quantity + 1)
                          }
                          disabled={
                            item.quantity >= item.maxStock || isUpdating
                          }
                          className="px-2 py-1 hover:bg-muted transition-colors disabled:opacity-50"
                        >
                          +
                        </button>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        disabled={isUpdating}
                        className="text-red-500 hover:text-red-600 transition-colors disabled:opacity-50"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>

                  {/* Item Total */}
                  <div className="text-right">
                    <p className="font-semibold">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              </Card>
            );
          })}

          {/* Cart Actions */}
          <div className="flex justify-between items-center">
            <Button variant="outline" onClick={() => router.back()}>
              <ChevronLeft className="mr-2 h-4 w-4" />
              Continue Shopping
            </Button>

            <Button
              variant="destructive"
              onClick={handleClearCart}
              disabled={updatingItems.size > 0}
            >
              Clear Cart
            </Button>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="p-6 sticky top-24">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                {shipping === 0 ? (
                  <span className="text-green-600">Free</span>
                ) : (
                  <span>${shipping.toFixed(2)}</span>
                )}
              </div>

              <div className="flex justify-between">
                <span className="text-muted-foreground">Tax (10%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>

              <Separator className="my-3" />

              <div className="flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>

              {subtotal < 50 && (
                <p className="text-sm text-green-600 mt-2">
                  Add ${(50 - subtotal).toFixed(2)} more for free shipping!
                </p>
              )}
            </div>

            <Button
              className="w-full mt-6 h-12 text-base"
              size="lg"
              onClick={() => router.push("/checkout")}
              disabled={updatingItems.size > 0}
            >
              Proceed to Checkout
            </Button>

            <p className="text-xs text-muted-foreground text-center mt-4">
              Taxes and shipping calculated at checkout
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
