"use client";

import { useEffect, useRef } from "react";
import { useUser } from "@clerk/nextjs";
import { useCartStore } from "@/lib/store/cart-store";
import { useApi } from "@/lib/api/client";
import { toast } from "sonner";

export function CartSync() {
  const { user, isLoaded, isSignedIn } = useUser();
  const { items, setItems, clearCart, localOnly } = useCartStore();
  const api = useApi();
  const initialSyncDoneRef = useRef(false);
  const syncAttemptedRef = useRef(false);

  // Sync local cart to backend when user logs in
  useEffect(() => {
    if (!isLoaded || !isSignedIn || !user?.id) return;

    // Don't retry if we already attempted sync
    if (syncAttemptedRef.current) return;
    if (initialSyncDoneRef.current) return;

    const syncCart = async () => {
      try {
        syncAttemptedRef.current = true;

        // First sync user to backend
        const syncedUser = await api.auth.post("/users/sync", {
          clerkId: user.id,
          email: user.primaryEmailAddress?.emailAddress,
          name: user.fullName,
        });

        // Get current items from store at sync time
        const currentItems = items;

        // If there are local items, push them to backend
        if (currentItems.length > 0 && localOnly) {
          // Add each local item to backend cart
          for (const item of currentItems) {
            try {
              await api.auth.post(`/cart/${user.id}/items`, {
                productId: item.productId,
                quantity: item.quantity,
              });
            } catch (itemError) {
              console.error(`❌ Failed to add ${item.name}:`, itemError);
            }
          }

          // Fetch the updated cart from backend
          const cartData = await api.auth.get(`/cart/${user.id}`);

          if (cartData.items && cartData.items.length > 0) {
            const backendItems = cartData.items.map((item: any) => ({
              id: item.id,
              productId: item.product.id,
              name: item.product.name,
              price: item.product.price,
              quantity: item.quantity,
              image: item.product.images[0] || "/placeholder.jpg",
              maxStock: item.product.inventory,
            }));

            setItems(backendItems);
            toast.success("Cart synced to your account!");
          }
        } else {
          // Just fetch the backend cart
          const cartData = await api.auth.get(`/cart/${user.id}`);

          if (cartData.items && cartData.items.length > 0) {
            const backendItems = cartData.items.map((item: any) => ({
              id: item.id,
              productId: item.product.id,
              name: item.product.name,
              price: item.product.price,
              quantity: item.quantity,
              image: item.product.images[0] || "/placeholder.jpg",
              maxStock: item.product.inventory,
            }));

            setItems(backendItems);
          }
        }

        initialSyncDoneRef.current = true;
      } catch (error: any) {
        console.error("❌ Cart sync error:", error);

        // If it's a 401, mark as attempted but not successful
        // This prevents infinite retry loops
        if (error.response?.status === 401) {
          initialSyncDoneRef.current = true;
        }
      }
    };

    syncCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded, isSignedIn, user?.id]);

  // Clear local cart when user logs out
  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      clearCart();
      initialSyncDoneRef.current = false;
      syncAttemptedRef.current = false;
    }
  }, [isLoaded, isSignedIn, clearCart]);

  return null;
}
