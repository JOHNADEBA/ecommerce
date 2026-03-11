import { FaqSection } from "@/components/faq/faq-section";
import { FaqCategories } from "@/components/faq/faq-categories";
import { FaqSearch } from "@/components/faq/faq-search";
import { HelpCircle, MessageCircle, Mail } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "FAQ | E-Store",
  description:
    "Find answers to frequently asked questions about orders, shipping, returns, payments, and more.",
};

export default function FAQPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
          <HelpCircle className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-4xl font-bold mb-4">Frequently Asked Questions</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Find answers to common questions about our products, shipping,
          returns, and more.
        </p>
      </div>

      {/* Search Bar */}
      <FaqSearch />

      {/* FAQ Categories */}
      <FaqCategories />

      {/* FAQ Sections */}
      <div className="space-y-12 mt-12">
        <FaqSection
          title="Orders & Tracking"
          description="Questions about placing orders and tracking shipments"
          questions={[
            {
              q: "How do I place an order?",
              a: "To place an order, simply browse our products, add items to your cart, and proceed to checkout. You'll need to provide shipping information and payment details to complete your purchase.",
            },
            {
              q: "How can I track my order?",
              a: "Once your order ships, you'll receive a tracking number via email. You can also track your order by logging into your account and viewing your order history.",
            },
            {
              q: "Can I modify or cancel my order after placing it?",
              a: "Orders can be modified or canceled within 1 hour of placing them. Please contact our customer support immediately if you need to make changes.",
            },
            {
              q: "What should I do if my order is delayed?",
              a: "If your order is significantly delayed, please check the tracking information first. If you need assistance, contact our support team with your order number.",
            },
          ]}
        />

        <FaqSection
          title="Shipping & Delivery"
          description="Information about shipping methods, costs, and delivery times"
          questions={[
            {
              q: "What shipping methods do you offer?",
              a: "We offer standard shipping (3-5 business days), express shipping (2-3 business days), and overnight shipping (1-2 business days) for eligible areas.",
            },
            {
              q: "Do you offer free shipping?",
              a: "Yes! We offer free standard shipping on all orders over $50 within the continental United States.",
            },
            {
              q: "Do you ship internationally?",
              a: "Yes, we ship to most countries worldwide. International shipping rates and delivery times vary by location and will be calculated at checkout.",
            },
            {
              q: "How are shipping costs calculated?",
              a: "Shipping costs are calculated based on your location, the weight of your items, and the shipping method you select. You'll see the total at checkout.",
            },
          ]}
        />

        <FaqSection
          title="Returns & Refunds"
          description="Our return policy and refund process"
          questions={[
            {
              q: "What is your return policy?",
              a: "We offer a 30-day return policy for most items. Products must be unused and in their original packaging. Some items may have different return conditions.",
            },
            {
              q: "How do I initiate a return?",
              a: "To start a return, log into your account, go to your orders, and select the items you wish to return. You'll receive a return label via email.",
            },
            {
              q: "How long do refunds take?",
              a: "Once we receive your return, refunds are processed within 5-7 business days. The time for the refund to appear in your account depends on your payment method.",
            },
            {
              q: "Can I exchange an item instead of returning it?",
              a: "Yes, exchanges are available for most items. During the return process, you can select the option to exchange for a different size or color.",
            },
          ]}
        />

        <FaqSection
          title="Payments & Pricing"
          description="Questions about payment methods, discounts, and pricing"
          questions={[
            {
              q: "What payment methods do you accept?",
              a: "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, Apple Pay, Google Pay, and Shop Pay.",
            },
            {
              q: "Is it safe to use my credit card on your site?",
              a: "Absolutely! We use industry-standard encryption and secure payment processors to ensure your payment information is always protected.",
            },
            {
              q: "Do you offer price matching?",
              a: "Yes, we offer price matching on identical items from select competitors. Contact our support team with a link to the lower price for verification.",
            },
            {
              q: "How do I use a discount code?",
              a: "Enter your discount code at checkout in the 'Promo code' field. The discount will be applied to your order total before taxes and shipping.",
            },
          ]}
        />

        <FaqSection
          title="Account & Security"
          description="Managing your account and keeping your information secure"
          questions={[
            {
              q: "How do I create an account?",
              a: "Click on the 'Sign Up' button in the top right corner. You can create an account using your email address or through Google or Facebook.",
            },
            {
              q: "I forgot my password. What should I do?",
              a: "Click on 'Forgot Password' on the login page. You'll receive an email with instructions to reset your password.",
            },
            {
              q: "How do I update my account information?",
              a: "Log into your account and navigate to 'Account Settings'. From there, you can update your personal information, email, and password.",
            },
            {
              q: "Is my personal information secure?",
              a: "We take security seriously. Your data is encrypted and we never share your personal information with third parties without your consent.",
            },
          ]}
        />
      </div>

      {/* Still Have Questions */}
      <div className="mt-16 text-center bg-muted/50 rounded-2xl p-8">
        <h2 className="text-2xl font-semibold mb-4">Still Have Questions?</h2>
        <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
          Can't find the answer you're looking for? Please contact our support
          team.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/contact"
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-primary/90 transition-colors"
          >
            <MessageCircle className="mr-2 h-4 w-4" />
            Contact Support
          </Link>
          <a
            href="mailto:support@estore.com"
            className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md hover:bg-muted transition-colors"
          >
            <Mail className="mr-2 h-4 w-4" />
            support@estore.com
          </a>
        </div>
      </div>
    </div>
  );
}
