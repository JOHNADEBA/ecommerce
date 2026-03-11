"use client";

import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

export function SuccessScreen() {
  const router = useRouter();

  return (
    <Card className="p-8 text-center">
      <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
        <CheckCircle className="h-8 w-8 text-green-600" />
      </div>
      <h2 className="text-2xl font-bold mb-2">Order Placed Successfully!</h2>
      <p className="text-muted-foreground mb-4">
        Thank you for your purchase. You'll receive a confirmation email shortly.
      </p>
      <Button onClick={() => router.push("/orders")}>View Your Orders</Button>
    </Card>
  );
}