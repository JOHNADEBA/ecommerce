"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback, useRef } from "react";
import { OrdersList } from "@/components/orders/orders-list";
import { useApi } from "@/lib/api/client";
import { Order } from "@/lib/api/types";
import { Loader2 } from "lucide-react";

export default function OrdersPage() {
  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();
  const api = useApi();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const hasFetched = useRef(false);

  const fetchOrders = useCallback(async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      
      // First, get the database user ID by syncing or fetching
      let dbUserId: string;
      
      try {
        // Try to get user by clerk ID
        const userData = await api.auth.get(`/users/clerk/${user.id}`);
        dbUserId = userData.id;
      } catch (error) {
        // If not found, sync the user
        const syncedUser = await api.auth.post("/users/sync", {
          clerkId: user.id,
          email: user.primaryEmailAddress?.emailAddress,
          name: user.fullName,
        });
        dbUserId = syncedUser.id;
      }

      // Now fetch orders with database user ID
      const response = await api.auth.get(`/orders/user/${dbUserId}`);

      // Handle different response structures
      let ordersData: Order[] = [];
      if (Array.isArray(response)) {
        ordersData = response;
      } else if (response && typeof response === "object") {
        if (response.data && Array.isArray(response.data)) {
          ordersData = response.data;
        } else if (response.orders && Array.isArray(response.orders)) {
          ordersData = response.orders;
        } else if (response.id && response.items) {
          ordersData = [response];
        }
      }

      setOrders(ordersData);
      setError(null);
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError("Failed to load orders");
    } finally {
      setLoading(false);
    }
  }, [user?.id, api]);

  useEffect(() => {
    if (!isLoaded) return;

    if (!isSignedIn || !user) {
      router.push("/sign-in?redirect_url=/orders");
      return;
    }

    // Only fetch once
    if (!hasFetched.current) {
      hasFetched.current = true;
      fetchOrders();
    }
  }, [isLoaded, isSignedIn, user, router, fetchOrders]);

  if (!isLoaded || loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="flex justify-center items-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-red-600 mb-4">{error}</h1>
          <p className="text-muted-foreground">
            Please try again later or contact support.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">My Orders</h1>
        <p className="text-muted-foreground">
          View and track all your orders in one place.
        </p>
      </div>
      <OrdersList orders={orders} />
    </div>
  );
}