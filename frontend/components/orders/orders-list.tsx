"use client";

import { useState } from "react";
import { Order } from "@/lib/api/types";
import { OrderCard } from "./order-card";
import { Button } from "@/components/ui/button";
import { Package, Filter } from "lucide-react";

interface OrdersListProps {
  orders: Order[];
}

export function OrdersList({ orders }: OrdersListProps) {
  const [filter, setFilter] = useState<string>("all");

  // Ensure orders is an array
  const ordersArray = Array.isArray(orders) ? orders : [];

  const filteredOrders =
    filter === "all"
      ? ordersArray
      : ordersArray.filter((order) => order.status === filter);

  // Calculate status counts safely
  const statusCounts = ordersArray.reduce(
    (acc, order) => {
      if (order && order.status) {
        acc[order.status] = (acc[order.status] || 0) + 1;
      }
      return acc;
    },
    {} as Record<string, number>,
  );

  if (!ordersArray || ordersArray.length === 0) {
    return (
      <div className="text-center py-16">
        <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-xl font-semibold mb-2">No Orders Yet</h3>
        <p className="text-muted-foreground mb-6">
          You haven't placed any orders yet. Start shopping to see your orders
          here!
        </p>
        <Button asChild>
          <a href="/products">Browse Products</a>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filter Bar */}
      {ordersArray.length > 0 && (
        <div className="flex items-center gap-4 overflow-x-auto pb-2">
          <Filter className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          <button
            onClick={() => setFilter("all")}
            className={`px-3 py-1 rounded-full text-sm whitespace-nowrap transition-colors ${
              filter === "all"
                ? "bg-primary text-primary-foreground"
                : "bg-muted hover:bg-muted/80"
            }`}
          >
            All Orders ({ordersArray.length})
          </button>
          {Object.entries(statusCounts).map(([status, count]) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-3 py-1 rounded-full text-sm whitespace-nowrap transition-colors ${
                filter === status
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted hover:bg-muted/80"
              }`}
            >
              {status} ({count})
            </button>
          ))}
        </div>
      )}

      {/* Orders Grid */}
      <div className="space-y-4">
        {filteredOrders.map((order) => (
          <OrderCard key={order.id} order={order} />
        ))}
      </div>

      {/* Empty State for Filter */}
      {filteredOrders.length === 0 && filter !== "all" && (
        <div className="text-center py-12 border rounded-lg">
          <p className="text-muted-foreground">
            No {filter.toLowerCase()} orders found.
          </p>
        </div>
      )}
    </div>
  );
}
