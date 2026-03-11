import { Truck, Clock, Globe, Package, CreditCard, Shield } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Shipping Information | E-Store",
  description: "Learn about our shipping methods, delivery times, costs, and international shipping options.",
};

export default function ShippingPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
          <Truck className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-4xl font-bold mb-4">Shipping Information</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Everything you need to know about our shipping methods, delivery times, and costs.
        </p>
      </div>

      {/* Shipping Methods */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
          <Package className="h-6 w-6 text-primary" />
          Shipping Methods
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="border rounded-lg p-6">
            <h3 className="font-semibold text-lg mb-2">Standard Shipping</h3>
            <p className="text-3xl font-bold text-primary mb-2">$5.99</p>
            <p className="text-muted-foreground mb-4">Free on orders over $50</p>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                <span>3-5 business days</span>
              </li>
              <li className="flex items-center gap-2">
                <Package className="h-4 w-4 text-primary" />
                <span>Tracking included</span>
              </li>
            </ul>
          </div>

          <div className="border rounded-lg p-6 border-primary">
            <h3 className="font-semibold text-lg mb-2">Express Shipping</h3>
            <p className="text-3xl font-bold text-primary mb-2">$12.99</p>
            <p className="text-muted-foreground mb-4">Priority handling</p>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                <span>2-3 business days</span>
              </li>
              <li className="flex items-center gap-2">
                <Package className="h-4 w-4 text-primary" />
                <span>Tracking + Insurance</span>
              </li>
            </ul>
          </div>

          <div className="border rounded-lg p-6">
            <h3 className="font-semibold text-lg mb-2">Overnight Shipping</h3>
            <p className="text-3xl font-bold text-primary mb-2">$24.99</p>
            <p className="text-muted-foreground mb-4">Next day delivery</p>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                <span>1-2 business days</span>
              </li>
              <li className="flex items-center gap-2">
                <Package className="h-4 w-4 text-primary" />
                <span>Guaranteed delivery</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* International Shipping */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
          <Globe className="h-6 w-6 text-primary" />
          International Shipping
        </h2>
        <div className="bg-muted/50 rounded-lg p-6">
          <p className="mb-4">
            We ship to most countries worldwide. International shipping rates and delivery times vary by location.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium mb-2">Shipping Zones</h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Canada & Mexico: 5-8 business days</li>
                <li>• Europe: 7-10 business days</li>
                <li>• Asia Pacific: 10-14 business days</li>
                <li>• Rest of World: 10-20 business days</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium mb-2">Important Notes</h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Customs fees may apply</li>
                <li>• Tracking available for all orders</li>
                <li>• Insurance included</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Processing Time */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
          <Clock className="h-6 w-6 text-primary" />
          Order Processing
        </h2>
        <div className="border rounded-lg p-6">
          <p className="mb-4">
            Orders are processed within 1-2 business days after payment confirmation. You'll receive a confirmation email with tracking information once your order ships.
          </p>
          <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <p className="text-sm text-blue-800 dark:text-blue-400">
              <strong>Note:</strong> Orders placed after 2 PM EST on Friday will be processed on the following Monday.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Link */}
      <div className="text-center border-t pt-8">
        <p className="text-muted-foreground">
          Have more questions about shipping? Check our{" "}
          <Link href="/faq" className="text-primary hover:underline">
            FAQ page
          </Link>{" "}
          or{" "}
          <Link href="/contact" className="text-primary hover:underline">
            contact support
          </Link>.
        </p>
      </div>
    </div>
  );
}