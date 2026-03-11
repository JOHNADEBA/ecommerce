import * as z from "zod";

export const checkoutSchema = z.object({
  // Contact Info
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),

  // Shipping address
  shippingFirstName: z.string().min(2, "First name is required"),
  shippingLastName: z.string().min(2, "Last name is required"),
  shippingAddress: z.string().min(5, "Address is required"),
  shippingApartment: z.string().optional(),
  shippingCity: z.string().min(2, "City is required"),
  shippingState: z.string().min(2, "State is required"),
  shippingZipCode: z.string().min(5, "Zip code is required"),
  shippingCountry: z.string().min(2, "Country is required"),

  // Billing address
  sameAsShipping: z.boolean(),
  billingFirstName: z.string().optional(),
  billingLastName: z.string().optional(),
  billingAddress: z.string().optional(),
  billingApartment: z.string().optional(),
  billingCity: z.string().optional(),
  billingState: z.string().optional(),
  billingZipCode: z.string().optional(),
  billingCountry: z.string().optional(),

  // Payment method
  paymentMethod: z.enum(["card", "paypal", "bank"]),

  // Card details (conditional)
  cardNumber: z.string().optional(),
  cardName: z.string().optional(),
  cardExpiry: z.string().optional(),
  cardCvc: z.string().optional(),

  // Preferences
  saveInfo: z.boolean(),
});

export type CheckoutFormData = z.infer<typeof checkoutSchema>;

export interface CheckoutStepProps {
  control: any;
  register: any;
  errors: any;
  watch: any;
  setValue: any;
  onNext?: () => void;
  onBack?: () => void;
}

export interface CheckoutFormProps {
  cart: Cart;
  userId: string;
}

// Import this from your types file
import { Cart } from "@/lib/api/types";
