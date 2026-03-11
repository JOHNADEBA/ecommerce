import { RotateCcw, RefreshCw, Shield, Clock, CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Returns & Refunds | E-Store",
  description: "Learn about our 30-day return policy, how to initiate a return, and our refund process.",
};

export default function ReturnsPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
          <RotateCcw className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-4xl font-bold mb-4">Returns & Refunds</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Our hassle-free return policy makes shopping with us risk-free.
        </p>
      </div>

      {/* Return Policy Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="text-center p-6 border rounded-lg">
          <Clock className="h-8 w-8 mx-auto text-primary mb-3" />
          <h3 className="font-semibold mb-2">30-Day Returns</h3>
          <p className="text-sm text-muted-foreground">
            Return any item within 30 days of delivery
          </p>
        </div>
        <div className="text-center p-6 border rounded-lg border-primary">
          <RefreshCw className="h-8 w-8 mx-auto text-primary mb-3" />
          <h3 className="font-semibold mb-2">Free Exchanges</h3>
          <p className="text-sm text-muted-foreground">
            Exchange items for different sizes/colors
          </p>
        </div>
        <div className="text-center p-6 border rounded-lg">
          <Shield className="h-8 w-8 mx-auto text-primary mb-3" />
          <h3 className="font-semibold mb-2">Full Refunds</h3>
          <p className="text-sm text-muted-foreground">
            Money back guaranteed on eligible items
          </p>
        </div>
      </div>

      {/* Return Policy Details */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Return Policy Details</h2>
        
        <div className="space-y-6">
          <div className="border rounded-lg p-6">
            <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Eligible Items
            </h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>• Unused items in original packaging</li>
              <li>• Items must be in sellable condition</li>
              <li>• Returns within 30 days of delivery</li>
              <li>• Final sale items are non-returnable</li>
            </ul>
          </div>

          <div className="border rounded-lg p-6">
            <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
              <XCircle className="h-5 w-5 text-red-600" />
              Non-Returnable Items
            </h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>• Gift cards</li>
              <li>• Downloadable software products</li>
              <li>• Personal care items</li>
              <li>• Items marked as "Final Sale"</li>
            </ul>
          </div>
        </div>
      </section>

      {/* How to Return */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">How to Return an Item</h2>
        
        <div className="space-y-4">
          <div className="flex gap-4 items-start">
            <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center flex-shrink-0">
              1
            </div>
            <div>
              <h3 className="font-semibold">Log into Your Account</h3>
              <p className="text-muted-foreground">
                Go to your order history and select the items you wish to return
              </p>
            </div>
          </div>

          <div className="flex gap-4 items-start">
            <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center flex-shrink-0">
              2
            </div>
            <div>
              <h3 className="font-semibold">Print Return Label</h3>
              <p className="text-muted-foreground">
                We'll email you a prepaid return shipping label
              </p>
            </div>
          </div>

          <div className="flex gap-4 items-start">
            <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center flex-shrink-0">
              3
            </div>
            <div>
              <h3 className="font-semibold">Pack and Ship</h3>
              <p className="text-muted-foreground">
                Pack items securely and drop off at any shipping location
              </p>
            </div>
          </div>

          <div className="flex gap-4 items-start">
            <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center flex-shrink-0">
              4
            </div>
            <div>
              <h3 className="font-semibold">Get Refund</h3>
              <p className="text-muted-foreground">
                Refund processed within 5-7 business days after receipt
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Refund Timeline */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Refund Timeline</h2>
        <div className="bg-muted/50 rounded-lg p-6">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Payment Method</th>
                <th className="text-left py-2">Processing Time</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="py-3">Credit/Debit Card</td>
                <td>5-7 business days</td>
              </tr>
              <tr className="border-b">
                <td className="py-3">PayPal</td>
                <td>3-5 business days</td>
              </tr>
              <tr className="border-b">
                <td className="py-3">Apple Pay / Google Pay</td>
                <td>5-7 business days</td>
              </tr>
              <tr>
                <td className="py-3">Store Credit</td>
                <td>Immediate</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Contact */}
      <div className="text-center border-t pt-8">
        <p className="text-muted-foreground">
          Need help with a return?{" "}
          <Link href="/contact" className="text-primary hover:underline">
            Contact our support team
          </Link>
        </p>
      </div>
    </div>
  );
}