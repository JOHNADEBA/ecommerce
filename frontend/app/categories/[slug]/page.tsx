import { getCategory, getProducts } from "@/lib/api/server"; // Remove getCategoryProducts
import { notFound } from "next/navigation";
import { ProductGrid } from "@/components/products/product-grid";
import { ProductsFilter } from "@/components/products/products-filter";
import { Suspense } from "react";
import { Loader2, Package } from "lucide-react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

interface CategoryPageProps {
  params: Promise<{
    slug: string;
  }>;
  searchParams: Promise<{
    minPrice?: string;
    maxPrice?: string;
    sort?: string;
    page?: string;
  }>;
}

export async function generateMetadata({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = await getCategory(slug);

  if (!category) {
    return {
      title: "Category Not Found | E-Store",
    };
  }

  return {
    title: `${category.name} | E-Store Categories`,
    description: `Browse our collection of ${category.name}. Find the best products at great prices.`,
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: CategoryPageProps) {
  const { slug } = await params;
  const filters = await searchParams;

  const category = await getCategory(slug);

  if (!category) {
    notFound();
  }

  // Build product filters
  const productFilters: any = {
    category: slug,
    limit: 12,
  };

  if (filters.page) productFilters.page = parseInt(filters.page);
  if (filters.minPrice) productFilters.minPrice = parseFloat(filters.minPrice);
  if (filters.maxPrice) productFilters.maxPrice = parseFloat(filters.maxPrice);
  if (filters.sort) productFilters.sort = filters.sort;

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link href="/" className="hover:text-primary transition-colors">
          Home
        </Link>
        <span>/</span>
        <Link
          href="/categories"
          className="hover:text-primary transition-colors"
        >
          Categories
        </Link>
        <span>/</span>
        <span className="text-foreground font-medium">{category.name}</span>
      </div>

      {/* Category Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Link
            href="/categories"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Categories
          </Link>
        </div>

        <h1 className="text-4xl font-bold mb-2">{category.name}</h1>
      </div>

      {/* Filters */}
      <div className="mb-8">
        <ProductsFilter />
      </div>

      {/* Products Grid */}
      <Suspense
        fallback={
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        }
      >
        <CategoryProducts categorySlug={slug} filters={productFilters} />
      </Suspense>
    </div>
  );
}

async function CategoryProducts({
  categorySlug,
  filters,
}: {
  categorySlug: string;
  filters: any;
}) {
  try {
    // Use getProducts directly with the category filter
    const { data: products, meta } = await getProducts(filters);

    if (!products || products.length === 0) {
      return (
        <div className="text-center py-16">
          <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold mb-2">No Products Found</h3>
          <p className="text-muted-foreground">
            No products found in this category. Check back later!
          </p>
        </div>
      );
    }

    return (
      <div>
        <ProductGrid products={products} />

        {/* Pagination */}
        {meta && meta.totalPages > 1 && (
          <div className="mt-8 flex justify-center gap-2">
            {Array.from({ length: meta.totalPages }, (_, i) => i + 1).map(
              (page) => {
                const urlParams = new URLSearchParams();
                urlParams.set("page", page.toString());
                if (filters.minPrice)
                  urlParams.set("minPrice", filters.minPrice);
                if (filters.maxPrice)
                  urlParams.set("maxPrice", filters.maxPrice);
                if (filters.sort) urlParams.set("sort", filters.sort);

                return (
                  <a
                    key={page}
                    href={`/categories/${categorySlug}?${urlParams.toString()}`}
                    className={`px-3 py-1 border rounded ${
                      page === meta.page
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted"
                    }`}
                  >
                    {page}
                  </a>
                );
              },
            )}
          </div>
        )}
      </div>
    );
  } catch (error) {
    console.error("Error loading category products:", error);
    return (
      <div className="text-center py-12">
        <p className="text-red-500">
          Failed to load products. Please try again later.
        </p>
      </div>
    );
  }
}
