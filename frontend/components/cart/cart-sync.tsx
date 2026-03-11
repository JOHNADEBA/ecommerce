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

  // Sync local cart to backend when user logs in
  useEffect(() => {
    if (!isLoaded || !isSignedIn || !user?.id) return;
    if (initialSyncDoneRef.current) return;

    const syncCart = async () => {
      try {
        // First sync user to backend
        const syncedUser = await api.auth.post("/users/sync", {
          clerkId: user.id,
          email: user.primaryEmailAddress?.emailAddress,
          name: user.fullName,
        });
        // If there are local items, push them to backend
        if (items.length > 0) {
          // Add each local item to backend cart
          for (const item of items) {
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
      } catch (error) {
        console.error("❌ Cart sync error:", error);
      }
    };

    syncCart();
  }, [isLoaded, isSignedIn, user?.id, items, setItems, api]);

  // Clear local cart when user logs out
  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      clearCart();
      initialSyncDoneRef.current = false;
    }
  }, [isLoaded, isSignedIn, clearCart]);

  return null;
}
