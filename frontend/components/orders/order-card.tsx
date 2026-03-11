"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Order } from "@/lib/api/types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ChevronDown,
  ChevronUp,
  Package,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw,
} from "lucide-react";

interface OrderCardProps {
  order: Order;
}

const statusConfig: Record<
  string,
  { color: string; icon: any; label: string }
> = {
  PENDING: {
    color:
      "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-950/30 dark:text-yellow-400",
    icon: Clock,
    label: "Pending",
  },
  PROCESSING: {
    color:
      "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-950/30 dark:text-blue-400",
    icon: RefreshCw,
    label: "Processing",
  },
  SHIPPED: {
    color:
      "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-950/30 dark:text-purple-400",
    icon: Truck,
    label: "Shipped",
  },
  DELIVERED: {
    color:
      "bg-green-100 text-green-800 border-green-200 dark:bg-green-950/30 dark:text-green-400",
    icon: CheckCircle,
    label: "Delivered",
  },
  CANCELLED: {
    color:
      "bg-red-100 text-red-800 border-red-200 dark:bg-red-950/30 dark:text-red-400",
    icon: XCircle,
    label: "Cancelled",
  },
};

export function OrderCard({ order }: OrderCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const status = statusConfig[order.status] || statusConfig.PENDING;
  const StatusIcon = status.icon;

  const orderDate = order.createdAt
    ? new Date(order.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Date unavailable";

  const orderItems = Array.isArray(order.items) ? order.items : [];

  return (
    <Card className="overflow-hidden">
      {/* Order Header */}
      <div className="p-4 border-b bg-muted/30">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <span className="font-mono text-sm text-muted-foreground">
                Order #{order.id?.slice(-8) || "N/A"}
              </span>
              <Badge variant="outline" className={`${status.color} border`}>
                <StatusIcon className="h-3 w-3 mr-1" />
                {status.label}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              Placed on {orderDate}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Total</p>
              <p className="text-lg font-bold text-primary">
                ${order.total?.toFixed(2) || "0.00"}
              </p>
            </div>
            {orderItems.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
                className="gap-1"
              >
                {isExpanded ? (
                  <>
                    Hide Items <ChevronUp className="h-4 w-4" />
                  </>
                ) : (
                  <>
                    View Items ({orderItems.length}){" "}
                    <ChevronDown className="h-4 w-4" />
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Order Items */}
      {isExpanded && orderItems.length > 0 && (
        <div className="p-4 space-y-4">
          <h4 className="font-semibold mb-2">Order Items</h4>
          {orderItems.map((item) => (
            <div
              key={item.id}
              className="flex gap-4 py-2 border-b last:border-0"
            >
              {/* Product Image */}
              <Link
                href={`/products/${item.product?.slug || ""}`}
                className="shrink-0"
              >
                <div className="relative w-16 h-16 rounded-md overflow-hidden bg-muted">
                  {item.product?.images?.[0] ? (
                    <Image
                      src={item.product.images[0]}
                      alt={item.product.name || "Product"}
                      fill
                      priority
                      className="object-cover"
                    />
                  ) : (
                    <Package className="h-8 w-8 m-4 text-muted-foreground" />
                  )}
                </div>
              </Link>

              {/* Product Details */}
              <div className="flex-1 min-w-0">
                <Link
                  href={`/products/${item.product?.slug || ""}`}
                  className="hover:text-primary transition-colors"
                >
                  <h5 className="font-medium truncate">
                    {item.product?.name || "Product"}
                  </h5>
                </Link>
                <p className="text-sm text-muted-foreground">
                  ${item.price?.toFixed(2) || "0.00"} × {item.quantity || 0}
                </p>
              </div>

              {/* Item Total */}
              <div className="text-right">
                <p className="font-semibold">
                  ${((item.price || 0) * (item.quantity || 0)).toFixed(2)}
                </p>
              </div>
            </div>
          ))}

          {/* Shipping Address */}
          {order.address && (
            <div className="border-t pt-4">
              <h4 className="font-semibold mb-2">Shipping Address</h4>
              <p className="text-sm text-muted-foreground">
                {order.address.fullName}
                <br />
                {order.address.addressLine}
                <br />
                {order.address.city}, {order.address.state}{" "}
                {order.address.postalCode}
                <br />
                {order.address.country}
              </p>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}
