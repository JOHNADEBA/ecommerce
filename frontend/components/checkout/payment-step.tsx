"use client";

import { Controller } from "react-hook-form";
import { CheckoutStepProps } from "./types";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CreditCard, Landmark, Wallet, Loader2 } from "lucide-react";

interface PaymentStepProps extends CheckoutStepProps {
  isSubmitting: boolean;
}

export function PaymentStep({
  control,
  register,
  watch,
  onBack,
  isSubmitting,
}: PaymentStepProps) {
  const paymentMethod = watch("paymentMethod");

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Payment Method</h2>

      <div className="space-y-6">
        <Controller
          name="paymentMethod"
          control={control}
          render={({ field }) => (
            <RadioGroup
              value={field.value}
              onValueChange={field.onChange}
              className="grid grid-cols-1 md:grid-cols-3 gap-4"
            >
              <div>
                <RadioGroupItem
                  value="card"
                  id="card"
                  className="peer sr-only"
                />
                <Label
                  htmlFor="card"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  <CreditCard className="h-6 w-6 mb-2" />
                  <span className="text-sm font-medium">Credit Card</span>
                </Label>
              </div>
              <div>
                <RadioGroupItem
                  value="paypal"
                  id="paypal"
                  className="peer sr-only"
                />
                <Label
                  htmlFor="paypal"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  <Wallet className="h-6 w-6 mb-2" />
                  <span className="text-sm font-medium">PayPal</span>
                </Label>
              </div>
              <div>
                <RadioGroupItem
                  value="bank"
                  id="bank"
                  className="peer sr-only"
                />
                <Label
                  htmlFor="bank"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  <Landmark className="h-6 w-6 mb-2" />
                  <span className="text-sm font-medium">Bank Transfer</span>
                </Label>
              </div>
            </RadioGroup>
          )}
        />

        {paymentMethod === "card" && (
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="cardNumber">Card Number</Label>
              <Input
                id="cardNumber"
                placeholder="1234 5678 9012 3456"
                {...register("cardNumber")}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cardName">Name on Card</Label>
                <Input
                  id="cardName"
                  placeholder="John Doe"
                  {...register("cardName")}
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2">
                  <Label htmlFor="cardExpiry">Expiry</Label>
                  <Input
                    id="cardExpiry"
                    placeholder="MM/YY"
                    {...register("cardExpiry")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cardCvc">CVC</Label>
                  <Input
                    id="cardCvc"
                    placeholder="123"
                    {...register("cardCvc")}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {paymentMethod === "paypal" && (
          <div className="pt-4 text-center">
            <p className="text-muted-foreground">
              You'll be redirected to PayPal to complete your payment.
            </p>
          </div>
        )}

        {paymentMethod === "bank" && (
          <div className="pt-4 text-center">
            <p className="text-muted-foreground">
              Bank transfer instructions will be sent to your email.
            </p>
          </div>
        )}
      </div>

      <div className="mt-6 flex justify-between">
        <Button type="button" variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-green-600 hover:bg-green-700"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            "Place Order"
          )}
        </Button>
      </div>
    </Card>
  );
}
