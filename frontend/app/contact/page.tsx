import { ContactForm } from "@/components/contact/contact-form";
import { ContactInfo } from "@/components/contact/contact-info";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

export const metadata = {
  title: "Contact Us | E-Store",
  description:
    "Get in touch with our support team. We're here to help with any questions about your orders, products, or general inquiries.",
};

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Have questions? We'd love to hear from you. Send us a message and
          we'll respond as soon as possible.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contact Information Cards */}
        <div className="lg:col-span-1 space-y-4">
          <ContactInfo
            icon={<MapPin className="h-6 w-6" />}
            title="Visit Us"
            details={[
              "123 E-Store Street",
              "San Francisco, CA 94105",
              "United States",
            ]}
          />

          <ContactInfo
            icon={<Phone className="h-6 w-6" />}
            title="Call Us"
            details={["+1 (555) 123-4567", "+1 (555) 987-6543"]}
            highlight="24/7 Support"
          />

          <ContactInfo
            icon={<Mail className="h-6 w-6" />}
            title="Email Us"
            details={["support@estore.com", "sales@estore.com"]}
            highlight="Response within 24h"
          />

          <ContactInfo
            icon={<Clock className="h-6 w-6" />}
            title="Business Hours"
            details={[
              "Monday - Friday: 9am - 6pm",
              "Saturday: 10am - 4pm",
              "Sunday: Closed",
            ]}
          />
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-2">
          <ContactForm />
        </div>
      </div>

      {/* Map Section */}
      <div className="mt-16">
        <h2 className="text-2xl font-semibold mb-6 text-center">Find Us</h2>
        <div className="aspect-video w-full bg-muted rounded-lg overflow-hidden">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d100949.2442974685!2d-122.43759321965251!3d37.75776278205483!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80859a6d00690021%3A0x4a501367f076adff!2sSan%20Francisco%2C%20CA!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Store Location"
            className="w-full h-full"
          />
        </div>
      </div>

      {/* FAQ Section */}
      <div className="mt-16 text-center">
        <h2 className="text-2xl font-semibold mb-4">
          Frequently Asked Questions
        </h2>
        <p className="text-muted-foreground mb-6">
          Check out our FAQ page for quick answers to common questions.
        </p>
        <a
          href="/faq"
          className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-primary/90 transition-colors"
        >
          Visit FAQ
        </a>
      </div>
    </div>
  );
}
