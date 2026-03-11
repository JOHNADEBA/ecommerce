"use client";

import Image from "next/image";
import Link from "next/link";
import { Order } from "@/lib/api/types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Package,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw,
  MapPin,
  CreditCard,
  ArrowLeft,
} from "lucide-react";

interface OrderDetailsProps {
  order: Order;
}

const statusConfig: Record<
  string,
  { color: string; icon: any; label: string }
> = {
  PENDING: {
    color: "bg-yellow-100 text-yellow-800 border-yellow-200",
    icon: Clock,
    label: "Pending",
  },
  PROCESSING: {
    color: "bg-blue-100 text-blue-800 border-blue-200",
    icon: RefreshCw,
    label: "Processing",
  },
  SHIPPED: {
    color: "bg-purple-100 text-purple-800 border-purple-200",
    icon: Truck,
    label: "Shipped",
  },
  DELIVERED: {
    color: "bg-green-100 text-green-800 border-green-200",
    icon: CheckCircle,
    label: "Delivered",
  },
  CANCELLED: {
    color: "bg-red-100 text-red-800 border-red-200",
    icon: XCircle,
    label: "Cancelled",
  },
};

export function OrderDetails({ order }: OrderDetailsProps) {
  const status = statusConfig[order.status] || statusConfig.PENDING;
  const StatusIcon = status.icon;

  const orderDate = new Date(order.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Button variant="ghost" size="sm" asChild className="gap-2">
        <Link href="/orders">
          <ArrowLeft className="h-4 w-4" />
          Back to Orders
        </Link>
      </Button>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">
            Order #{order.id.slice(-8)}
          </h1>
          <p className="text-muted-foreground">Placed on {orderDate}</p>
        </div>
        <Badge
          variant="outline"
          className={`${status.color} border text-base px-4 py-2`}
        >
          <StatusIcon className="h-4 w-4 mr-2" />
          {status.label}
        </Badge>
      </div>

      {/* Progress Tracker */}
      <Card className="p-6">
        <h2 className="font-semibold mb-4">Order Progress</h2>
        <div className="relative">
          <div className="absolute left-0 top-2 w-full h-0.5 bg-muted" />
          <div
            className="absolute left-0 top-2 h-0.5 bg-primary transition-all"
            style={{
              width:
                order.status === "DELIVERED"
                  ? "100%"
                  : order.status === "SHIPPED"
                    ? "66%"
                    : order.status === "PROCESSING"
                      ? "33%"
                      : "0%",
            }}
          />
          <div className="relative flex justify-between">
            <div className="text-center">
              <div
                className={`w-4 h-4 rounded-full mb-2 mx-auto ${
                  ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED"].includes(
                    order.status,
                  )
                    ? "bg-primary"
                    : "bg-muted"
                }`}
              />
              <span className="text-xs">Pending</span>
            </div>
            <div className="text-center">
              <div
                className={`w-4 h-4 rounded-full mb-2 mx-auto ${
                  ["PROCESSING", "SHIPPED", "DELIVERED"].includes(order.status)
                    ? "bg-primary"
                    : "bg-muted"
                }`}
              />
              <span className="text-xs">Processing</span>
            </div>
            <div className="text-center">
              <div
                className={`w-4 h-4 rounded-full mb-2 mx-auto ${
                  ["SHIPPED", "DELIVERED"].includes(order.status)
                    ? "bg-primary"
                    : "bg-muted"
                }`}
              />
              <span className="text-xs">Shipped</span>
            </div>
            <div className="text-center">
              <div
                className={`w-4 h-4 rounded-full mb-2 mx-auto ${
                  order.status === "DELIVERED" ? "bg-primary" : "bg-muted"
                }`}
              />
              <span className="text-xs">Delivered</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Order Items */}
      <Card className="p-6">
        <h2 className="font-semibold mb-4">Order Items</h2>
        <div className="space-y-4">
          {order.items.map((item) => (
            <div key={item.id} className="flex gap-4">
              <Link
                href={`/products/${item.product.slug}`}
                className="shrink-0"
              >
                <div className="relative w-20 h-20 rounded-md overflow-hidden">
                  <Image
                    src={item.product.images[0] || "/placeholder.jpg"}
                    alt={item.product.name}
                    fill
                    priority
                    className="object-cover"
                  />
                </div>
              </Link>
              <div className="flex-1">
                <Link
                  href={`/products/${item.product.slug}`}
                  className="hover:text-primary transition-colors"
                >
                  <h3 className="font-semibold">{item.product.name}</h3>
                </Link>
                <p className="text-sm text-muted-foreground">
                  ${item.price.toFixed(2)} × {item.quantity}
                </p>
              </div>
              <div className="text-right">
                <p className="font-semibold">
                  ${(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Shipping Address */}
        <Card className="p-6">
          <h2 className="font-semibold mb-4 flex items-center gap-2">
            <MapPin className="h-4 w-4 text-primary" />
            Shipping Address
          </h2>
          <address className="not-italic text-sm text-muted-foreground">
            {order.address.fullName}
            <br />
            {order.address.addressLine}
            <br />
            {order.address.city}, {order.address.state}{" "}
            {order.address.postalCode}
            <br />
            {order.address.country}
          </address>
        </Card>

        {/* Payment Info */}
        <Card className="p-6">
          <h2 className="font-semibold mb-4 flex items-center gap-2">
            <CreditCard className="h-4 w-4 text-primary" />
            Payment Information
          </h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Payment Method</span>
              <span>Credit Card</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Transaction ID</span>
              <span className="font-mono">
                {order.paymentIntentId.slice(-12)}
              </span>
            </div>
            <Separator className="my-2" />
            <div className="flex justify-between font-semibold">
              <span>Total Paid</span>
              <span className="text-primary">${order.total.toFixed(2)}</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Actions */}
      <div className="flex gap-4">
        <Button className="flex-1" size="lg">
          Track Package
        </Button>
        <Button variant="outline" size="lg" className="flex-1">
          Need Help?
        </Button>
      </div>
    </div>
  );
}
