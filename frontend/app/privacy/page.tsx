import { Shield, Lock, Eye, Database, Mail, Cookie } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Privacy Policy | E-Store",
  description: "Learn about how we collect, use, and protect your personal information.",
};

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
          <Shield className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Your privacy is important to us. Learn how we collect, use, and protect your information.
        </p>
        <p className="text-sm text-muted-foreground mt-4">Last Updated: March 10, 2026</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="text-center p-6 border rounded-lg">
          <Lock className="h-8 w-8 mx-auto text-primary mb-3" />
          <h3 className="font-semibold mb-2">Data Security</h3>
          <p className="text-sm text-muted-foreground">
            Your data is encrypted and secure
          </p>
        </div>
        <div className="text-center p-6 border rounded-lg">
          <Eye className="h-8 w-8 mx-auto text-primary mb-3" />
          <h3 className="font-semibold mb-2">No Tracking</h3>
          <p className="text-sm text-muted-foreground">
            We don't sell your personal data
          </p>
        </div>
        <div className="text-center p-6 border rounded-lg">
          <Database className="h-8 w-8 mx-auto text-primary mb-3" />
          <h3 className="font-semibold mb-2">Data Control</h3>
          <p className="text-sm text-muted-foreground">
            You can request data deletion
          </p>
        </div>
      </div>

      {/* Policy Sections */}
      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-semibold mb-4">1. Information We Collect</h2>
          <div className="space-y-4 text-muted-foreground">
            <p>
              We collect information you provide directly to us, such as when you create an account, make a purchase, or contact customer support. This may include:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Name, email address, phone number, and shipping address</li>
              <li>Payment information (processed securely by our payment partners)</li>
              <li>Order history and preferences</li>
              <li>Communications with our support team</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">2. How We Use Your Information</h2>
          <div className="space-y-4 text-muted-foreground">
            <p>We use the information we collect to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Process your orders and payments</li>
              <li>Communicate about your orders and account</li>
              <li>Improve our products and services</li>
              <li>Send promotional offers (with your consent)</li>
              <li>Prevent fraud and enhance security</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">3. Information Sharing</h2>
          <div className="space-y-4 text-muted-foreground">
            <p>We do not sell your personal information. We may share your information with:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Service providers (shipping, payment processing, customer support)</li>
              <li>Law enforcement when required by law</li>
              <li>Business partners with your consent</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">4. Cookies and Tracking</h2>
          <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg mb-4">
            <Cookie className="h-6 w-6 text-primary flex-shrink-0" />
            <p className="text-muted-foreground">
              We use cookies to enhance your browsing experience, analyze site traffic, and personalize content. You can control cookies through your browser settings.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">5. Data Security</h2>
          <div className="space-y-4 text-muted-foreground">
            <p>
              We implement industry-standard security measures to protect your personal information. All transactions are encrypted using SSL technology.
            </p>
            <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
              <p className="text-sm text-green-800 dark:text-green-400">
                <strong>✓ Secure Checkout:</strong> Your payment information is never stored on our servers.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">6. Your Rights</h2>
          <div className="space-y-4 text-muted-foreground">
            <p>You have the right to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Access your personal information</li>
              <li>Correct inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Opt-out of marketing communications</li>
              <li>Export your data</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">7. Children's Privacy</h2>
          <p className="text-muted-foreground">
            Our services are not directed to children under 13. We do not knowingly collect personal information from children under 13.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">8. Changes to This Policy</h2>
          <p className="text-muted-foreground">
            We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page with an updated effective date.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">9. Contact Us</h2>
          <div className="bg-muted/50 rounded-lg p-6">
            <p className="mb-4">If you have questions about this privacy policy, please contact us:</p>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary" />
                <a href="mailto:privacy@estore.com" className="text-primary hover:underline">
                  privacy@estore.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-primary">📞</span>
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-primary">📍</span>
                <span>123 E-Store Street, San Francisco, CA 94105</span>
              </li>
            </ul>
          </div>
        </section>
      </div>

      {/* Consent */}
      <div className="mt-12 text-center border-t pt-8">
        <p className="text-muted-foreground">
          By using our services, you agree to the terms of this privacy policy.
        </p>
      </div>
    </div>
  );
}