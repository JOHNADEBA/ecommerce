import { Product } from "@/lib/api/types";
import { ProductsFilter } from "./products-filter";
import { ProductGrid } from "@/components/products/product-grid";

interface ProductsListProps {
  products: Product[];
  showFilter?: boolean;
  title?: string;
  description?: string;
}

export function ProductsList({
  products,
  showFilter = false,
  title,
  description,
}: ProductsListProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      {(title || description) && (
        <div className="mb-8">
          {title && <h1 className="text-3xl font-bold mb-2">{title}</h1>}
          {description && (
            <p className="text-muted-foreground">{description}</p>
          )}
        </div>
      )}

      {/* Optional Filter */}
      {showFilter && <ProductsFilter />}

      {/* Products Grid */}
      <ProductGrid products={products || []} />
    </div>
  );
}
