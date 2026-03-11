import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="font-semibold text-lg mb-4">E-Store</h3>
            <p className="text-sm text-muted-foreground">
              Your one-stop shop for everything. Quality products at great
              prices.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/products"
                  className="text-muted-foreground hover:text-primary"
                >
                  Products
                </Link>
              </li>
              <li>
                <Link
                  href="/categories"
                  className="text-muted-foreground hover:text-primary"
                >
                  Categories
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-muted-foreground hover:text-primary"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-muted-foreground hover:text-primary"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Customer Service</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/faq"
                  className="text-muted-foreground hover:text-primary"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="/shipping"
                  className="text-muted-foreground hover:text-primary"
                >
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link
                  href="/returns"
                  className="text-muted-foreground hover:text-primary"
                >
                  Returns
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-muted-foreground hover:text-primary"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Get in Touch</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Email: support@estore.com</li>
              <li>Phone: +1 (555) 123-4567</li>
              <li>Mon - Fri: 9am - 6pm</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t mt-8 pt-6 text-center text-sm text-muted-foreground">
          <p>
            &copy; {new Date().getFullYear()} E-Store. All rights reserved.
            Designed and developed by John Adeba
          </p>
        </div>
      </div>
    </footer>
  );
}
