"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Home, Search, ShoppingBag, ArrowLeft } from "lucide-react";

export default function NotFound() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="container mx-auto px-4 py-16 max-w-3xl">
      {/* 404 Illustration */}
      <div className="text-center mb-8">
        <div className="relative inline-block">
          <h1 className="text-9xl font-bold text-primary/20">404</h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-6xl">🔍</span>
          </div>
        </div>
      </div>

      {/* Error Message */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4">Page Not Found</h2>
        <p className="text-xl text-muted-foreground max-w-lg mx-auto">
          The page you're looking for doesn't exist or has been moved.
        </p>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="max-w-md mx-auto mb-12">
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="Search for products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1"
          />
          <Button type="submit">
            <Search className="h-4 w-4" />
          </Button>
        </div>
      </form>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <Link
          href="/"
          className="flex items-center gap-4 p-4 border rounded-lg hover:border-primary hover:bg-primary/5 transition-all"
        >
          <Home className="h-6 w-6 text-primary" />
          <div>
            <div className="font-medium">Go Home</div>
            <div className="text-sm text-muted-foreground">
              Return to homepage
            </div>
          </div>
        </Link>

        <Link
          href="/products"
          className="flex items-center gap-4 p-4 border rounded-lg hover:border-primary hover:bg-primary/5 transition-all"
        >
          <ShoppingBag className="h-6 w-6 text-primary" />
          <div>
            <div className="font-medium">Browse Products</div>
            <div className="text-sm text-muted-foreground">
              Shop our catalog
            </div>
          </div>
        </Link>
      </div>

      {/* Helpful Links */}
      <div className="text-center">
        <p className="text-muted-foreground mb-4">
          Need help? Check out our{" "}
          <Link href="/faq" className="text-primary hover:underline">
            FAQ
          </Link>{" "}
          or{" "}
          <Link href="/contact" className="text-primary hover:underline">
            contact us
          </Link>
        </p>

        <Button
          variant="ghost"
          onClick={() => window.history.back()}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Go Back
        </Button>
      </div>
    </div>
  );
}
