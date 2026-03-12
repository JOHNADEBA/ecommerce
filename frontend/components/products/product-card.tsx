"use client";

import Image from "next/image";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { useCartStore } from "@/lib/store/cart-store";
import { useAddToCart } from "@/lib/api/hooks";
import { Product } from "@/lib/api/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "../ui/badge";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { user, isSignedIn } = useUser();
  const { addItem: addToLocalCart } = useCartStore();
  const addToCartMutation = useAddToCart();

  const handleAddToCart = async () => {
    if (isSignedIn && user?.id) {
      // For logged-in users, use the mutation but also update local store immediately
      addToCartMutation.mutate(
        {
          userId: user.id,
          data: {
            productId: product.id,
            quantity: 1,
          },
        },
        {
          onSuccess: () => {
            // Update local store immediately for header to update
            addToLocalCart({
              productId: product.id,
              name: product.name,
              price: product.price,
              quantity: 1,
              image: product.images[0] || "/placeholder.jpg",
              maxStock: product.inventory,
            });

            toast.success(`${product.name} added to cart`, {
              description: "Check your cart to complete checkout",
              icon: <ShoppingCart className="h-4 w-4" />,
            });
          },
          onError: () => {
            toast.error("Failed to add to cart", {
              description: "Please try again",
            });
          },
        },
      );
    } else {
      // For guest users, add to local store immediately
      addToLocalCart({
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        image: product.images[0] || "/placeholder.jpg",
        maxStock: product.inventory,
      });

      toast.info(`${product.name} added to local cart`, {
        description: "Sign in to save it permanently",
        action: {
          label: "Sign In",
          onClick: () => (window.location.href = "/sign-in"),
        },
      });
    }
  };

  return (
    <Card className="overflow-hidden h-full flex flex-col group p-0 gap-0">
      {/* Image at the top - perfectly flush */}
      <Link
        href={`/products/${product.slug}`}
        className="block overflow-hidden w-full"
      >
        <div className="aspect-square relative w-full">
          <Image
            src={product.images[0] || "/placeholder.svg"}
            alt={product.name}
            fill
            priority
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          />
        </div>
      </Link>

      {/* Content section - padding only on sides and bottom */}
      <div className="flex-1 flex flex-col px-5 pb-5 mt-2">
        {/* Title */}
        <Link href={`/products/${product.slug}`} className="block mb-2">
          <h3 className="font-semibold hover:text-primary line-clamp-1 text-base">
            {product.name}
          </h3>
        </Link>

        {/* Description */}
        <div className="mb-3">
          <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Price and stock */}
        <div className="mb-4 flex items-center justify-between">
          <span className="text-xl font-bold text-primary">
            ${product.price.toFixed(2)}
          </span>
          <span className="text-xs bg-muted px-2 py-1 rounded-full">
            {product.inventory} left
          </span>
        </div>

        {/* Button */}
        <Button
          onClick={handleAddToCart}
          className="w-full h-12 text-base font-semibold"
          size="lg"
          disabled={product.inventory === 0 || addToCartMutation.isPending}
        >
          <ShoppingCart className="mr-2 h-5 w-5" />
          {product.inventory === 0 ? "Out of Stock" : "Add to Cart"}
        </Button>
      </div>
    </Card>
  );
}
