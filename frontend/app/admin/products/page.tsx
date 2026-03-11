"use client";

import { useProducts } from "@/lib/api/hooks";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash } from "lucide-react";
import { toast } from "sonner";
import { useApi } from "@/lib/api/client";

export default function AdminProductsPage() {
  const { data, isLoading, error, refetch } = useProducts({ limit: 100 });
  const api = useApi();

  const handleDelete = async (productId: string, productName: string) => {
    if (!confirm(`Are you sure you want to delete "${productName}"?`)) return;

    try {
      await api.auth.delete(`/products/${productId}`);
      toast.success("Product deleted successfully");
      refetch();
    } catch (error) {
      toast.error("Failed to delete product");
    }
  };

  if (isLoading) return <div className="text-center py-8">Loading...</div>;
  if (error)
    return (
      <div className="text-center py-8 text-red-500">
        Error loading products
      </div>
    );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Products</h1>
        <Link href="/admin/products/create">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Button>
        </Link>
      </div>

      <div className="grid gap-4">
        {data?.data.map((product) => (
          <div
            key={product.id}
            className="border rounded-lg p-4 flex items-center gap-4"
          >
            <div className="w-16 h-16 relative rounded overflow-hidden">
              <Image
                src={product.images[0] || "/placeholder.jpg"}
                alt={product.name}
                fill
                priority
                className="object-cover"
              />
            </div>

            <div className="flex-1">
              <h3 className="font-semibold">{product.name}</h3>
              <p className="text-sm text-muted-foreground">${product.price}</p>
            </div>

            <div className="flex gap-2">
              <Link href={`/admin/products/${product.id}/edit`}>
                <Button variant="outline" size="sm">
                  <Pencil className="h-4 w-4" />
                </Button>
              </Link>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDelete(product.id, product.name)}
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
