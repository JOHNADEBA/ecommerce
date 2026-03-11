"use client";

import { CheckoutStepProps } from "./types";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export function ShippingStep({
  register,
  errors,
  watch,
  onNext,
  onBack,
}: CheckoutStepProps) {
  const sameAsShipping = watch("sameAsShipping");

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="shippingFirstName">First Name</Label>
            <Input
              id="shippingFirstName"
              placeholder="John"
              {...register("shippingFirstName")}
              className={errors.shippingFirstName ? "border-red-500" : ""}
            />
            {errors.shippingFirstName && (
              <p className="text-sm text-red-500">
                {errors.shippingFirstName.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="shippingLastName">Last Name</Label>
            <Input
              id="shippingLastName"
              placeholder="Doe"
              {...register("shippingLastName")}
              className={errors.shippingLastName ? "border-red-500" : ""}
            />
            {errors.shippingLastName && (
              <p className="text-sm text-red-500">
                {errors.shippingLastName.message}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="shippingAddress">Address</Label>
          <Input
            id="shippingAddress"
            placeholder="123 Main St"
            {...register("shippingAddress")}
            className={errors.shippingAddress ? "border-red-500" : ""}
          />
          {errors.shippingAddress && (
            <p className="text-sm text-red-500">
              {errors.shippingAddress.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="shippingApartment">
            Apartment, suite, etc. (optional)
          </Label>
          <Input
            id="shippingApartment"
            placeholder="Apt 4B"
            {...register("shippingApartment")}
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label htmlFor="shippingCity">City</Label>
            <Input
              id="shippingCity"
              placeholder="San Francisco"
              {...register("shippingCity")}
              className={errors.shippingCity ? "border-red-500" : ""}
            />
            {errors.shippingCity && (
              <p className="text-sm text-red-500">
                {errors.shippingCity.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="shippingState">State</Label>
            <Input
              id="shippingState"
              placeholder="CA"
              {...register("shippingState")}
              className={errors.shippingState ? "border-red-500" : ""}
            />
            {errors.shippingState && (
              <p className="text-sm text-red-500">
                {errors.shippingState.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="shippingZipCode">ZIP Code</Label>
            <Input
              id="shippingZipCode"
              placeholder="94105"
              {...register("shippingZipCode")}
              className={errors.shippingZipCode ? "border-red-500" : ""}
            />
            {errors.shippingZipCode && (
              <p className="text-sm text-red-500">
                {errors.shippingZipCode.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="shippingCountry">Country</Label>
            <Input
              id="shippingCountry"
              placeholder="USA"
              {...register("shippingCountry")}
              className={errors.shippingCountry ? "border-red-500" : ""}
            />
            {errors.shippingCountry && (
              <p className="text-sm text-red-500">
                {errors.shippingCountry.message}
              </p>
            )}
          </div>
        </div>

        {/* Billing Address */}
        <div className="mt-6">
          <div className="flex items-center space-x-2 mb-4">
            <input
              type="checkbox"
              id="sameAsShipping"
              {...register("sameAsShipping")}
              className="h-4 w-4 rounded border-gray-300"
            />
            <Label htmlFor="sameAsShipping" className="text-sm font-medium">
              Billing address is the same as shipping
            </Label>
          </div>

          {!sameAsShipping && (
            <div className="space-y-4 border-t pt-4">
              <h3 className="font-medium">Billing Address</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="billingFirstName">First Name</Label>
                  <Input
                    id="billingFirstName"
                    placeholder="John"
                    {...register("billingFirstName")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="billingLastName">Last Name</Label>
                  <Input
                    id="billingLastName"
                    placeholder="Doe"
                    {...register("billingLastName")}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="billingAddress">Address</Label>
                <Input
                  id="billingAddress"
                  placeholder="123 Main St"
                  {...register("billingAddress")}
                />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Input placeholder="City" {...register("billingCity")} />
                <Input placeholder="State" {...register("billingState")} />
                <Input placeholder="ZIP Code" {...register("billingZipCode")} />
                <Input placeholder="Country" {...register("billingCountry")} />
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 flex justify-between">
        <Button type="button" variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button type="button" onClick={onNext}>
          Continue to Payment
        </Button>
      </div>
    </Card>
  );
}
