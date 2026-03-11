import Link from "next/link";
import { Card } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

interface CategoryCardProps {
  category: {
    id: string;
    name: string;
    slug: string;
    products?: any[];
  };
}

// Comprehensive category icons mapping
const categoryIcons: Record<string, { icon: string; color: string }> = {
  "arts-crafts": { icon: "🎨", color: "bg-pink-100 text-pink-600" },
  automotive: { icon: "🚗", color: "bg-blue-100 text-blue-600" },
  "baby-kids": { icon: "👶", color: "bg-yellow-100 text-yellow-600" },
  "beauty-health": { icon: "💄", color: "bg-rose-100 text-rose-600" },
  "books-media": { icon: "📚", color: "bg-amber-100 text-amber-600" },
  "clothing-fashion": { icon: "👕", color: "bg-indigo-100 text-indigo-600" },
  "electronics-tech": { icon: "💻", color: "bg-cyan-100 text-cyan-600" },
  "food-grocery": { icon: "🍎", color: "bg-green-100 text-green-600" },
  "home-living": { icon: "🏠", color: "bg-orange-100 text-orange-600" },
  "office-supplies": { icon: "📎", color: "bg-gray-100 text-gray-600" },
  "pet-supplies": { icon: "🐾", color: "bg-emerald-100 text-emerald-600" },
  "sports-outdoors": { icon: "⚽", color: "bg-lime-100 text-lime-600" },
  "toys-games": { icon: "🧸", color: "bg-purple-100 text-purple-600" },
};

// Default for any unmapped category
const defaultIcon = { icon: "📦", color: "bg-gray-100 text-gray-600" };

export function CategoryCard({ category }: CategoryCardProps) {
  const { icon, color } = categoryIcons[category.slug] || defaultIcon;
  const productCount = category.products?.length || 0;

  return (
    <Link href={`/categories/${category.slug}`}>
      <Card className="group p-6 hover:shadow-lg transition-all hover:border-primary cursor-pointer h-full flex flex-col items-center text-center relative overflow-hidden">
        {/* Decorative background element */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity bg-primary" />

        {/* Icon with colored background */}
        <div
          className={`w-20 h-20 rounded-full ${color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
        >
          <span className="text-4xl">{icon}</span>
        </div>

        {/* Category Name */}
        <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
          {category.name}
        </h3>

        {/* Product Count */}
        <p className="text-sm text-muted-foreground mb-4">
          {productCount} {productCount === 1 ? "Product" : "Products"}
        </p>

        {/* Browse Link */}
        <span className="text-sm text-primary opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 absolute bottom-6">
          Browse Category
          <ArrowRight className="h-3 w-3" />
        </span>
      </Card>
    </Link>
  );
}
