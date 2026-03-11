"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useApi } from "@/lib/api/client";
import { useCartStore } from "@/lib/store/cart-store";
import { Cart } from "@/lib/api/types";

import { checkoutSchema, CheckoutFormData } from "./types";
import { CheckoutSteps } from "./checkout-steps";
import { ContactInfoStep } from "./contact-info-step";
import { ShippingStep } from "./shipping-step";
import { PaymentStep } from "./payment-step";
import { SuccessScreen } from "./success-screen";

interface CheckoutFormProps {
  cart: Cart;
  userId: string;
}

export function CheckoutForm({ cart, userId }: CheckoutFormProps) {
  const router = useRouter();
  const api = useApi();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { clearCart } = useCartStore();

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    trigger,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      email: "",
      phone: "",
      shippingFirstName: "",
      shippingLastName: "",
      shippingAddress: "",
      shippingApartment: "",
      shippingCity: "",
      shippingState: "",
      shippingZipCode: "",
      shippingCountry: "",
      sameAsShipping: true,
      billingFirstName: "",
      billingLastName: "",
      billingAddress: "",
      billingApartment: "",
      billingCity: "",
      billingState: "",
      billingZipCode: "",
      billingCountry: "",
      paymentMethod: "card",
      cardNumber: "",
      cardName: "",
      cardExpiry: "",
      cardCvc: "",
      saveInfo: false,
    },
  });

  // Validate current step before proceeding
  const validateStep = async (stepNumber: number): Promise<boolean> => {
    let fieldsToValidate: (keyof CheckoutFormData)[] = [];

    switch (stepNumber) {
      case 1:
        fieldsToValidate = ["email", "phone", "saveInfo"];
        break;
      case 2:
        fieldsToValidate = [
          "shippingFirstName",
          "shippingLastName",
          "shippingAddress",
          "shippingCity",
          "shippingState",
          "shippingZipCode",
          "shippingCountry",
        ];
        break;
      case 3:
        fieldsToValidate = ["paymentMethod"];
        break;
    }

    const result = await trigger(fieldsToValidate);
    return result;
  };

  const handleNext = async () => {
    const isValid = await validateStep(step);
    if (isValid) {
      setStep(step + 1);
    } else {
      toast.error("Please fill in all required fields correctly");
    }
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const onSubmit = async (data: CheckoutFormData) => {
    setIsSubmitting(true);

    try {
      // First, ensure user exists in database by syncing
      const syncedUser = await api.auth.post("/users/sync", {
        clerkId: userId,
        email: data.email,
        name: `${data.shippingFirstName} ${data.shippingLastName}`,
      });

      // Create shipping address with database user ID
      const addressData = {
        fullName: `${data.shippingFirstName} ${data.shippingLastName}`,
        addressLine: data.shippingAddress,
        apartment: data.shippingApartment || "",
        city: data.shippingCity,
        state: data.shippingState,
        postalCode: data.shippingZipCode,
        country: data.shippingCountry,
        phone: data.phone,
        isDefault: true,
      };

      const address = await api.auth.post(
        `/users/${syncedUser.id}/addresses`,
        addressData,
      );

      // Prepare order items from cart
      const orderItems = cart.items.map((item) => ({
        productId: item.product.id,
        quantity: item.quantity,
        price: item.product.price,
      }));

      // Create order with database user ID
      const orderData = {
        addressId: address.id,
        paymentIntentId: `pi_${Date.now()}_${Math.random().toString(36).substring(7)}`,
        items: orderItems,
        notes: "",
      };

      const order = await api.auth.post(
        `/orders/user/${syncedUser.id}`,
        orderData,
      );

      setIsSuccess(true);
      toast.success("Order placed successfully!");
      clearCart();

      setTimeout(() => {
        router.push(`/orders`);
      }, 2000);
    } catch (error: any) {
      console.error("❌ Checkout error:", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to place order. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const onError = () => {
    toast.error("Please fix the errors in the form");
  };

  if (isSuccess) {
    return <SuccessScreen />;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-6">
      <CheckoutSteps currentStep={step} canProgress={true} />

      {step === 1 && (
        <ContactInfoStep
          register={register}
          errors={errors}
          watch={watch}
          setValue={setValue}
          control={control}
          onNext={handleNext}
        />
      )}

      {step === 2 && (
        <ShippingStep
          register={register}
          errors={errors}
          watch={watch}
          setValue={setValue}
          control={control}
          onNext={handleNext}
          onBack={handleBack}
        />
      )}

      {step === 3 && (
        <PaymentStep
          register={register}
          errors={errors}
          watch={watch}
          setValue={setValue}
          control={control}
          onBack={handleBack}
          isSubmitting={isSubmitting}
        />
      )}
    </form>
  );
}
