import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Heart,
  Shield,
  Truck,
  Users,
  Star,
  Globe,
  Package,
  Clock,
} from "lucide-react";

export const metadata: Metadata = {
  title: "About Us | E-Store",
  description: "Learn about our story, mission, and the team behind E-Store",
};

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">About E-Store</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Your trusted destination for quality products and exceptional shopping
          experience
        </p>
      </section>

      {/* Our Story */}
      <section className="mb-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-semibold mb-4">Our Story</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                Founded in 2024, E-Store began with a simple mission: to make
                quality products accessible to everyone. What started as a small
                passion project has grown into a thriving online marketplace
                serving thousands of satisfied customers worldwide.
              </p>
              <p>
                We believe that shopping should be enjoyable, not stressful.
                That's why we've curated a collection of the finest products,
                ensuring each item meets our strict quality standards before it
                reaches your doorstep.
              </p>
              <p>
                Today, we're proud to be one of the fastest-growing e-commerce
                platforms, known for our exceptional customer service, fast
                shipping, and hassle-free returns.
              </p>
            </div>
          </div>
          <div className="relative h-[400px] rounded-lg overflow-hidden">
            <Image
              src="/images/about-us.jpeg" // Add your image
              alt="Our story"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      </section>

      {/* Mission & Values */}
      <section className="mb-16">
        <h2 className="text-3xl font-semibold text-center mb-8">
          Our Mission & Values
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="p-6 text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Customer First</h3>
            <p className="text-muted-foreground">
              Every decision we make is guided by what's best for our customers
            </p>
          </Card>

          <Card className="p-6 text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Quality Assured</h3>
            <p className="text-muted-foreground">
              We never compromise on quality, ensuring every product meets our
              standards
            </p>
          </Card>

          <Card className="p-6 text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Globe className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Sustainable</h3>
            <p className="text-muted-foreground">
              Committed to eco-friendly practices and sustainable sourcing
            </p>
          </Card>
        </div>
      </section>

      {/* Stats */}
      <section className="mb-16 bg-muted/30 py-12 rounded-lg">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
              10K+
            </div>
            <p className="text-sm text-muted-foreground">Happy Customers</p>
          </div>
          <div>
            <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
              5K+
            </div>
            <p className="text-sm text-muted-foreground">Products</p>
          </div>
          <div>
            <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
              50+
            </div>
            <p className="text-sm text-muted-foreground">Countries</p>
          </div>
          <div>
            <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
              24/7
            </div>
            <p className="text-sm text-muted-foreground">Support</p>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="mb-16">
        <h2 className="text-3xl font-semibold text-center mb-8">
          Why Choose E-Store
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <Truck className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="font-semibold mb-1">Free Shipping</h3>
            <p className="text-sm text-muted-foreground">On orders over $50</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <Package className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="font-semibold mb-1">Easy Returns</h3>
            <p className="text-sm text-muted-foreground">
              30-day return policy
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <Shield className="h-8 w-8 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="font-semibold mb-1">Secure Payments</h3>
            <p className="text-sm text-muted-foreground">
              100% secure transactions
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <Clock className="h-8 w-8 text-orange-600 dark:text-orange-400" />
            </div>
            <h3 className="font-semibold mb-1">Fast Delivery</h3>
            <p className="text-sm text-muted-foreground">2-4 business days</p>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="mb-16">
        <h2 className="text-3xl font-semibold text-center mb-4">
          Meet Our Leadership Team
        </h2>
        <p className="text-center text-muted-foreground mb-8 max-w-2xl mx-auto">
          The experienced professionals guiding E-Store's mission to
          revolutionize online shopping
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* CEO */}
          <Card className="p-6 text-center hover:shadow-lg transition-shadow">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full mx-auto mb-4 overflow-hidden flex items-center justify-center text-white text-2xl font-bold">
              JD
            </div>
            <h3 className="font-semibold text-lg">John Doe</h3>
            <p className="text-sm text-primary font-medium mb-2">
              CEO & Founder
            </p>
            <p className="text-sm text-muted-foreground">
              Former Amazon executive with 15+ years of e-commerce experience.
              Founded E-Store to create a more customer-centric shopping
              experience.
            </p>
            <div className="flex justify-center gap-2 mt-3">
              <span className="text-xs bg-muted px-2 py-1 rounded">
                Strategy
              </span>
              <span className="text-xs bg-muted px-2 py-1 rounded">Vision</span>
            </div>
          </Card>

          {/* CTO */}
          <Card className="p-6 text-center hover:shadow-lg transition-shadow">
            <div className="w-24 h-24 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full mx-auto mb-4 overflow-hidden flex items-center justify-center text-white text-2xl font-bold">
              JS
            </div>
            <h3 className="font-semibold text-lg">Jane Smith</h3>
            <p className="text-sm text-primary font-medium mb-2">
              Chief Technology Officer
            </p>
            <p className="text-sm text-muted-foreground">
              Tech lead who built scalable systems at Shopify. Passionate about
              creating seamless, secure, and fast e-commerce platforms.
            </p>
            <div className="flex justify-center gap-2 mt-3">
              <span className="text-xs bg-muted px-2 py-1 rounded">
                Engineering
              </span>
              <span className="text-xs bg-muted px-2 py-1 rounded">AI/ML</span>
            </div>
          </Card>

          {/* Head of Operations */}
          <Card className="p-6 text-center hover:shadow-lg transition-shadow">
            <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-full mx-auto mb-4 overflow-hidden flex items-center justify-center text-white text-2xl font-bold">
              MW
            </div>
            <h3 className="font-semibold text-lg">Michael Wang</h3>
            <p className="text-sm text-primary font-medium mb-2">
              Head of Operations
            </p>
            <p className="text-sm text-muted-foreground">
              Logistics expert who optimized supply chains for global brands.
              Ensures your orders arrive faster and in perfect condition.
            </p>
            <div className="flex justify-center gap-2 mt-3">
              <span className="text-xs bg-muted px-2 py-1 rounded">
                Logistics
              </span>
              <span className="text-xs bg-muted px-2 py-1 rounded">
                Supply Chain
              </span>
            </div>
          </Card>

          {/* Customer Experience Lead */}
          <Card className="p-6 text-center hover:shadow-lg transition-shadow">
            <div className="w-24 h-24 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full mx-auto mb-4 overflow-hidden flex items-center justify-center text-white text-2xl font-bold">
              SR
            </div>
            <h3 className="font-semibold text-lg">Sarah Rodriguez</h3>
            <p className="text-sm text-primary font-medium mb-2">
              Customer Experience Lead
            </p>
            <p className="text-sm text-muted-foreground">
              Customer service veteran who's handled over 10,000 support
              tickets. Dedicated to making every interaction positive.
            </p>
            <div className="flex justify-center gap-2 mt-3">
              <span className="text-xs bg-muted px-2 py-1 rounded">
                Support
              </span>
              <span className="text-xs bg-muted px-2 py-1 rounded">
                Training
              </span>
            </div>
          </Card>

          {/* Marketing Director */}
          <Card className="p-6 text-center hover:shadow-lg transition-shadow">
            <div className="w-24 h-24 bg-gradient-to-br from-pink-400 to-pink-600 rounded-full mx-auto mb-4 overflow-hidden flex items-center justify-center text-white text-2xl font-bold">
              AK
            </div>
            <h3 className="font-semibold text-lg">Alex Kim</h3>
            <p className="text-sm text-primary font-medium mb-2">
              Marketing Director
            </p>
            <p className="text-sm text-muted-foreground">
              Creative strategist who's launched successful campaigns reaching
              millions. Tells our brand story in authentic ways.
            </p>
            <div className="flex justify-center gap-2 mt-3">
              <span className="text-xs bg-muted px-2 py-1 rounded">Brand</span>
              <span className="text-xs bg-muted px-2 py-1 rounded">Growth</span>
            </div>
          </Card>

          {/* Product Manager */}
          <Card className="p-6 text-center hover:shadow-lg transition-shadow">
            <div className="w-24 h-24 bg-gradient-to-br from-teal-400 to-teal-600 rounded-full mx-auto mb-4 overflow-hidden flex items-center justify-center text-white text-2xl font-bold">
              EL
            </div>
            <h3 className="font-semibold text-lg">Emma Lewis</h3>
            <p className="text-sm text-primary font-medium mb-2">
              Product Manager
            </p>
            <p className="text-sm text-muted-foreground">
              Curates our product selection with a keen eye for quality and
              trends. Tests every product category personally.
            </p>
            <div className="flex justify-center gap-2 mt-3">
              <span className="text-xs bg-muted px-2 py-1 rounded">
                Curation
              </span>
              <span className="text-xs bg-muted px-2 py-1 rounded">
                Quality
              </span>
            </div>
          </Card>
        </div>
      </section>

      {/* Customer Reviews - Realistic Testimonials */}
      <section className="mb-16">
        <h2 className="text-3xl font-semibold text-center mb-8">
          Real Reviews from Real Customers
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {/* Review 1 */}
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex gap-1 mb-3">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className="h-4 w-4 fill-yellow-400 text-yellow-400"
                />
              ))}
            </div>
            <p className="text-muted-foreground mb-4 italic">
              "The wireless headphones I bought are incredible! Battery lasts
              forever and the sound quality beats brands twice the price.
              Shipping was 2 days early too."
            </p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full overflow-hidden flex items-center justify-center text-blue-600 font-semibold">
                TP
              </div>
              <div>
                <p className="font-medium">Thomas Park</p>
                <div className="flex items-center gap-2">
                  <p className="text-xs text-muted-foreground">
                    Verified Buyer
                  </p>
                  <span className="text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded-full">
                    Headphones
                  </span>
                </div>
              </div>
            </div>
          </Card>

          {/* Review 2 */}
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex gap-1 mb-3">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className="h-4 w-4 fill-yellow-400 text-yellow-400"
                />
              ))}
            </div>
            <p className="text-muted-foreground mb-4 italic">
              "Had an issue with my order and customer service resolved it in
              under 10 minutes. They even gave me a discount on my next
              purchase. This is how online shopping should be!"
            </p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-full overflow-hidden flex items-center justify-center text-purple-600 font-semibold">
                MJ
              </div>
              <div>
                <p className="font-medium">Maria Jackson</p>
                <div className="flex items-center gap-2">
                  <p className="text-xs text-muted-foreground">
                    Verified Buyer
                  </p>
                  <span className="text-xs bg-purple-100 text-purple-600 px-2 py-0.5 rounded-full">
                    Customer Service
                  </span>
                </div>
              </div>
            </div>
          </Card>

          {/* Review 3 */}
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex gap-1 mb-3">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className="h-4 w-4 fill-yellow-400 text-yellow-400"
                />
              ))}
            </div>
            <p className="text-muted-foreground mb-4 italic">
              "The organic cotton t-shirts are so soft and fit perfectly. I've
              ordered 5 already! Love that they're ethically sourced too. My new
              favorite store."
            </p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-full overflow-hidden flex items-center justify-center text-green-600 font-semibold">
                DC
              </div>
              <div>
                <p className="font-medium">David Chen</p>
                <div className="flex items-center gap-2">
                  <p className="text-xs text-muted-foreground">
                    Verified Buyer
                  </p>
                  <span className="text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded-full">
                    Clothing
                  </span>
                </div>
              </div>
            </div>
          </Card>

          {/* Review 4 */}
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex gap-1 mb-3">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className="h-4 w-4 fill-yellow-400 text-yellow-400"
                />
              ))}
            </div>
            <p className="text-muted-foreground mb-4 italic">
              "Ordered a smart watch as a gift and it arrived in 2 days
              beautifully packaged. The recipient loved it! Will definitely be
              shopping here for all my gift needs."
            </p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 rounded-full overflow-hidden flex items-center justify-center text-orange-600 font-semibold">
                LW
              </div>
              <div>
                <p className="font-medium">Lisa Williams</p>
                <div className="flex items-center gap-2">
                  <p className="text-xs text-muted-foreground">
                    Verified Buyer
                  </p>
                  <span className="text-xs bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full">
                    Gifts
                  </span>
                </div>
              </div>
            </div>
          </Card>

          {/* Review 5 */}
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex gap-1 mb-3">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className="h-4 w-4 fill-yellow-400 text-yellow-400"
                />
              ))}
            </div>
            <p className="text-muted-foreground mb-4 italic">
              "The return process was so easy! I ordered the wrong size and had
              a replacement within a week. No questions asked. This is my go-to
              store now."
            </p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-full overflow-hidden flex items-center justify-center text-red-600 font-semibold">
                RM
              </div>
              <div>
                <p className="font-medium">Rachel Martinez</p>
                <div className="flex items-center gap-2">
                  <p className="text-xs text-muted-foreground">
                    Verified Buyer
                  </p>
                  <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">
                    Returns
                  </span>
                </div>
              </div>
            </div>
          </Card>

          {/* Review 6 */}
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex gap-1 mb-3">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className="h-4 w-4 fill-yellow-400 text-yellow-400"
                />
              ))}
            </div>
            <p className="text-muted-foreground mb-4 italic">
              "Been shopping here for 6 months and every order has been perfect.
              Great selection, fair prices, and fast shipping. Highly
              recommend!"
            </p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-100 rounded-full overflow-hidden flex items-center justify-center text-indigo-600 font-semibold">
                KT
              </div>
              <div>
                <p className="font-medium">Kevin Thompson</p>
                <div className="flex items-center gap-2">
                  <p className="text-xs text-muted-foreground">
                    Verified Buyer
                  </p>
                  <span className="text-xs bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full">
                    Regular
                  </span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* CTA Section - Keep this the same */}
      <section className="text-center py-12 bg-primary text-primary-foreground rounded-lg">
        <h2 className="text-3xl font-bold mb-4">Ready to Start Shopping?</h2>
        <p className="text-lg mb-6 opacity-90">
          Join thousands of satisfied customers and discover amazing products
        </p>
        <div className="flex gap-4 justify-center">
          <Button size="lg" variant="secondary" asChild>
            <Link href="/products">Shop Now</Link>
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="bg-transparent text-primary-foreground border-primary-foreground hover:bg-primary-foreground/10"
            asChild
          >
            <Link href="/contact">Contact Us</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
