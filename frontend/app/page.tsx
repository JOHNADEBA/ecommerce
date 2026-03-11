import { getFeaturedProducts } from "@/lib/api/server";
import { ProductGrid } from "@/components/products/product-grid";

export default async function HomePage() {
  try {
    // Fetch only featured products
    const { data: products } = await getFeaturedProducts(8);

    return (
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="mb-12 text-center">
          <h1 className="text-4xl font-bold mb-4">Welcome to E-Store</h1>
          <p className="text-xl text-muted-foreground">
            Discover amazing products at great prices
          </p>
        </section>

        {/* Featured Products only*/}
        <section>
          <h2 className="text-2xl font-semibold mb-6">Featured Products</h2>
          {products && products.length > 0 ? (
            <ProductGrid products={products} />
          ) : (
            <p className="text-center text-muted-foreground py-12">
              No featured products available.
            </p>
          )}
        </section>
      </div>
    );
  } catch (error) {
    console.error("HomePage error:", error);

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
        </div>
      </div>
    );
  }
}
