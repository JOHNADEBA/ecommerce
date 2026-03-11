import { getProducts } from "@/lib/api/server";
import { ProductsFilter } from "@/components/products/products-filter";
import { ProductGrid } from "@/components/products/product-grid";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

interface ProductsPageProps {
  searchParams: Promise<{
    category?: string;
    minPrice?: string;
    maxPrice?: string;
    search?: string;
    page?: string;
    isFeatured?: string;
  }>;
}

export default async function ProductsPage({
  searchParams,
}: ProductsPageProps) {
  const params = await searchParams;

  // Build filters with proper types
  const filters: any = { limit: 50 };

  if (params.page) filters.page = parseInt(params.page);
  if (params.category) filters.category = params.category;
  if (params.search) filters.search = params.search;
  if (params.isFeatured) filters.isFeatured = params.isFeatured === "true";

  // Convert price strings to numbers
  if (params.minPrice) {
    const min = parseFloat(params.minPrice);
    if (!isNaN(min) && min >= 0) {
      filters.minPrice = min;
    }
  }

  if (params.maxPrice) {
    const max = parseFloat(params.maxPrice);
    if (!isNaN(max) && max >= 0) {
      filters.maxPrice = max;
    }
  }

  try {
    const { data: products, meta } = await getProducts(filters);

    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2">All Products</h1>
        <p className="text-muted-foreground mb-8">
          Browse our collection of amazing products
        </p>

        <ProductsFilter />

        <Suspense
          fallback={
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          }
        >
          <ProductGrid products={products || []} />
        </Suspense>

        {/* Pagination */}
        {meta && meta.totalPages > 1 && (
          <div className="mt-8 flex justify-center gap-2">
            {Array.from({ length: meta.totalPages }, (_, i) => i + 1).map(
              (page) => {
                // Build pagination URL with existing filters
                const urlParams = new URLSearchParams();
                urlParams.set("page", page.toString());
                if (params.category) urlParams.set("category", params.category);
                if (params.search) urlParams.set("search", params.search);
                if (params.minPrice) urlParams.set("minPrice", params.minPrice);
                if (params.maxPrice) urlParams.set("maxPrice", params.maxPrice);
                if (params.isFeatured)
                  urlParams.set("isFeatured", params.isFeatured);

                return (
                  <a
                    key={page}
                    href={`/products?${urlParams.toString()}`}
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
    console.error("ProductsPage error:", error);

    const apiUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            Unable to load products
          </h1>
          <p className="text-muted-foreground">
            Please check if the backend server is running at:{" "}
            {apiUrl.replace("/api", "")}
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Error: {error instanceof Error ? error.message : "Unknown error"}
          </p>
        </div>
      </div>
    );
  }
}
