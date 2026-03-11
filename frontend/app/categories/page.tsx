import { getCategories } from "@/lib/api/server";
import { CategoryCard } from "@/components/categories/category-card";
import { Suspense } from "react";
import { Category } from "@/lib/api/types";

export const metadata = {
  title: "Categories | E-Store",
  description:
    "Browse our product categories to find exactly what you're looking for.",
};

export default async function CategoriesPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Shop by Category</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Browse our curated collection of categories to find the perfect
          products for your needs.
        </p>
      </div>

      {/* Categories Grid */}
      <Suspense fallback={<CategoriesLoading />}>
        <CategoriesGrid />
      </Suspense>
    </div>
  );
}

async function CategoriesGrid() {
  try {
    const categories = await getCategories();

    if (!categories || categories.length === 0) {
      return (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No categories found.</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {categories.map((category: Category) => (
          <CategoryCard key={category.id} category={category} />
        ))}
      </div>
    );
  } catch (error) {
    console.error("Error loading categories:", error);
    return (
      <div className="text-center py-12">
        <p className="text-red-500">
          Failed to load categories. Please try again later.
        </p>
      </div>
    );
  }
}

function CategoriesLoading() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="border rounded-lg p-6 space-y-4">
          <div className="w-12 h-12 bg-muted rounded-full animate-pulse mx-auto" />
          <div className="h-6 bg-muted rounded animate-pulse w-2/3 mx-auto" />
          <div className="h-4 bg-muted rounded animate-pulse w-1/2 mx-auto" />
        </div>
      ))}
    </div>
  );
}
