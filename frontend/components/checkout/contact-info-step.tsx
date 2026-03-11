"use client";

import { CheckoutStepProps } from "./types";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export function ContactInfoStep({
  register,
  errors,
  onNext,
}: CheckoutStepProps) {
  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="john@example.com"
              {...register("email")}
              className={errors.email ? "border-red-500" : ""}
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+1 234 567 8900"
              {...register("phone")}
              className={errors.phone ? "border-red-500" : ""}
            />
            {errors.phone && (
              <p className="text-sm text-red-500">{errors.phone.message}</p>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="saveInfo"
            {...register("saveInfo")}
            className="h-4 w-4 rounded border-gray-300"
          />
          <Label htmlFor="saveInfo" className="text-sm">
            Email me with news and offers
          </Label>
        </div>
      </div>
      <div className="mt-6 flex justify-end">
        <Button type="button" onClick={onNext}>
          Continue to Shipping
        </Button>
      </div>
    </Card>
  );
}
