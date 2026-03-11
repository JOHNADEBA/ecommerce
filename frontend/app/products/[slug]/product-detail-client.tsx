"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { useCartStore } from "@/lib/store/cart-store";
import { useAddToCart } from "@/lib/api/hooks";
import { Product } from "@/lib/api/types";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  ShoppingCart,
  ChevronLeft,
  ChevronRight,
  Star,
  Truck,
  Shield,
  RotateCcw,
  Check,
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useApi } from "@/lib/api/client";

interface ProductDetailClientProps {
  product: Product;
  formattedDate: string;
}

export function ProductDetailClient({
  product,
  formattedDate,
}: ProductDetailClientProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [cartItem, setCartItem] = useState<{ quantity: number } | null>(null);
  const { user, isSignedIn } = useUser();
  const {
    items,
    addItem: addToLocalCart,
    updateQuantity: updateStoreQuantity,
  } = useCartStore();
  const addToCartMutation = useAddToCart();
  const api = useApi();

  const allImages =
    product.images.length > 0 ? product.images : ["/placeholder.jpg"];

  // Check if product is already in cart and get its quantity
  useEffect(() => {
    const existingItem = items.find((item) => item.productId === product.id);
    if (existingItem) {
      setCartItem({ quantity: existingItem.quantity });
      setQuantity(existingItem.quantity); // Set initial quantity to cart quantity
    } else {
      setCartItem(null);
      setQuantity(1); // Reset to 1 if not in cart
    }
  }, [items, product.id]);

  const handlePrevImage = () => {
    setSelectedImage((prev) => (prev === 0 ? allImages.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setSelectedImage((prev) => (prev === allImages.length - 1 ? 0 : prev + 1));
  };

  const handleAddToCart = async () => {
    if (isSignedIn && user?.id) {
      addToCartMutation.mutate(
        {
          userId: user.id,
          data: {
            productId: product.id,
            quantity,
          },
        },
        {
          onSuccess: () => {
            // Update local store
            addToLocalCart({
              productId: product.id,
              name: product.name,
              price: product.price,
              quantity,
              image: product.images[0] || "/placeholder.jpg",
              maxStock: product.inventory,
            });

            toast.success(`${quantity} × ${product.name} added to cart`, {
              description: "Check your cart to complete checkout",
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
      // For guest users, add to local store
      addToLocalCart({
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity,
        image: product.images[0] || "/placeholder.jpg",
        maxStock: product.inventory,
      });

      toast.info(`${quantity} × ${product.name} added to local cart`, {
        description: "Sign in to save it permanently",
        action: {
          label: "Sign In",
          onClick: () => (window.location.href = "/sign-in"),
        },
      });
    }
  };

  const handleUpdateCart = async () => {
    if (!cartItem) {
      handleAddToCart();
      return;
    }

    if (isSignedIn && user?.id) {
      // Find the cart item ID
      const existingItem = items.find((item) => item.productId === product.id);
      if (!existingItem) return;

      try {
        // Use PATCH to update to the exact quantity
        await api.auth.patch(`/cart/${user.id}/items/${existingItem.id}`, {
          quantity: quantity,
        });

        // Update local store
        updateStoreQuantity(existingItem.id, quantity);

        toast.success(`Cart updated to ${quantity} items`, {
          description: "Your cart has been updated",
        });
      } catch (error: any) {
        console.error("Failed to update cart:", error);
        toast.error(error.response?.data?.message || "Failed to update cart");
      }
    } else {
      // For guest users, update local store directly
      const existingItem = items.find((item) => item.productId === product.id);
      if (existingItem) {
        updateStoreQuantity(existingItem.id, quantity);

        toast.info(`Cart updated to ${quantity} items`, {
          description: "Sign in to save it permanently",
        });
      }
    }
  };

  const incrementQuantity = () => {
    if (quantity < product.inventory) {
      setQuantity((prev) => prev + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const isInCart = cartItem !== null;

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link href="/" className="hover:text-primary transition-colors">
          Home
        </Link>
        <span>/</span>
        <Link href="/products" className="hover:text-primary transition-colors">
          Products
        </Link>
        <span>/</span>
        <Link
          href={`/categories/${product.category.slug}`}
          className="hover:text-primary transition-colors"
        >
          {product.category.name}
        </Link>
        <span>/</span>
        <span className="text-foreground font-medium truncate">
          {product.name}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Image Gallery */}
        <div className="space-y-4">
          {/* Main Image */}
          <div className="relative aspect-square rounded-lg overflow-hidden border bg-muted">
            <Image
              src={allImages[selectedImage]}
              alt={product.name}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
            />

            {/* Image Navigation Arrows */}
            {allImages.length > 1 && (
              <>
                <button
                  onClick={handlePrevImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background rounded-full p-2 shadow-md transition-all"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={handleNextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background rounded-full p-2 shadow-md transition-all"
                  aria-label="Next image"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </>
            )}

            {/* Stock Badge */}
            {product.inventory <= 5 && product.inventory > 0 && (
              <Badge variant="destructive" className="absolute top-2 left-2">
                Only {product.inventory} left
              </Badge>
            )}
            {product.inventory === 0 && (
              <Badge variant="destructive" className="absolute top-2 left-2">
                Out of Stock
              </Badge>
            )}

            {/* In Cart Badge */}
            {isInCart && (
              <Badge
                variant="secondary"
                className="absolute top-2 right-2 bg-green-500 text-white"
              >
                <Check className="h-3 w-3 mr-1" /> {cartItem.quantity} in cart
              </Badge>
            )}
          </div>

          {/* Thumbnail Gallery */}
          {allImages.length > 1 && (
            <div className="grid grid-cols-5 gap-2">
              {allImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative aspect-square rounded-md overflow-hidden border-2 transition-all ${
                    selectedImage === index
                      ? "border-primary"
                      : "border-transparent hover:border-primary/50"
                  }`}
                >
                  <Image
                    src={image}
                    alt={`${product.name} - Image ${index + 1}`}
                    fill
                    priority
                    className="object-cover"
                    sizes="(max-width: 768px) 20vw, 10vw"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          {/* Category & Title */}
          <div>
            <Link
              href={`/categories/${product.category.slug}`}
              className="inline-block text-sm text-primary hover:underline mb-2"
            >
              {product.category.name}
            </Link>
            <h1 className="text-3xl lg:text-4xl font-bold">{product.name}</h1>
          </div>

          {/* Rating (Placeholder) */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className="h-5 w-5 fill-yellow-400 text-yellow-400"
                />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">0 reviews</span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold text-primary">
              ${product.price.toFixed(2)}
            </span>
            {product.inventory > 0 && (
              <span className="text-sm text-muted-foreground">
                {product.inventory} in stock
              </span>
            )}
          </div>

          <Separator />

          {/* Description */}
          <div>
            <h2 className="font-semibold text-lg mb-2">Description</h2>
            <p className="text-muted-foreground leading-relaxed">
              {product.description}
            </p>
          </div>

          <Separator />

          {/* Quantity Selector */}
          <div>
            <label className="block text-sm font-medium mb-2">Quantity</label>
            <div className="flex items-center gap-2">
              <div className="flex items-center border rounded-md">
                <button
                  onClick={decrementQuantity}
                  disabled={quantity <= 1}
                  className="px-3 py-2 hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Decrease quantity"
                >
                  -
                </button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <button
                  onClick={incrementQuantity}
                  disabled={quantity >= product.inventory}
                  className="px-3 py-2 hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
              <span className="text-sm text-muted-foreground">
                Max: {product.inventory}
              </span>
            </div>
          </div>

          {/* Add to Cart / Update Cart Button */}
          <Button
            onClick={isInCart ? handleUpdateCart : handleAddToCart}
            className="w-full h-14 text-lg font-semibold"
            size="lg"
            disabled={product.inventory === 0 || addToCartMutation.isPending}
          >
            <ShoppingCart className="mr-2 h-5 w-5" />
            {product.inventory === 0
              ? "Out of Stock"
              : addToCartMutation.isPending
                ? "Updating..."
                : isInCart
                  ? `Update Cart (${cartItem.quantity} in cart)`
                  : "Add to Cart"}
          </Button>

          {/* Trust Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Truck className="h-5 w-5" />
              <span>Free shipping over $50</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Shield className="h-5 w-5" />
              <span>2 year warranty</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <RotateCcw className="h-5 w-5" />
              <span>30-day returns</span>
            </div>
          </div>

          {/* Additional Info Card */}
          <Card className="p-4 bg-muted/50">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">SKU</span>
                <p className="font-mono">{product.id.slice(-8)}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Category</span>
                <p>{product.category.name}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Availability</span>
                <p
                  className={
                    product.inventory > 0 ? "text-green-600" : "text-red-600"
                  }
                >
                  {product.inventory > 0 ? "In Stock" : "Out of Stock"}
                </p>
              </div>
              <div>
                <span className="text-muted-foreground">Added</span>
                <p>{formattedDate}</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
