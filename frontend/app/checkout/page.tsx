import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { CheckoutForm } from "@/components/checkout"
import { OrderSummary } from "@/components/checkout/order-summary";
import { getCart } from "@/lib/api/server";

export const metadata = {
  title: "Checkout | E-Store",
  description: "Complete your purchase securely.",
};

export default async function CheckoutPage() {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in?redirect_url=/checkout");
  }

  try {
    const cart = await getCart(user.id);

    if (!cart || !cart.items || cart.items.length === 0) {
      redirect("/cart");
    }

    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Checkout</h1>
          <p className="text-muted-foreground">
            Complete your purchase securely in a few steps.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <CheckoutForm cart={cart} userId={user.id} />
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <OrderSummary cart={cart} />
          </div>
        </div>

        {/* Trust Badges */}
        <div className="mt-12 pt-8 border-t">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <p className="font-semibold">🔒 Secure Payment</p>
              <p className="text-sm text-muted-foreground">SSL encrypted</p>
            </div>
            <div>
              <p className="font-semibold">🚚 Free Shipping</p>
              <p className="text-sm text-muted-foreground">
                On orders over $50
              </p>
            </div>
            <div>
              <p className="font-semibold">🔄 Easy Returns</p>
              <p className="text-sm text-muted-foreground">30-day guarantee</p>
            </div>
            <div>
              <p className="font-semibold">💳 Secure Payments</p>
              <p className="text-sm text-muted-foreground">Visa, MC, PayPal</p>
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error loading checkout:", error);

    return (
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            Unable to load checkout
          </h1>
          <p className="text-muted-foreground">
            Please try again later or contact support.
          </p>
          <a
            href="/cart"
            className="inline-block mt-4 px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Return to Cart
          </a>
        </div>
      </div>
    );
  }
}
