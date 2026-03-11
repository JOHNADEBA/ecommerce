"use client";

import { useState, useEffect } from "react";
import { useApi } from "@/lib/api/client";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import Image from "next/image";
import { Product } from "@/lib/api/types";
import { Loader2, X } from "lucide-react";

export default function EditProductPage() {
  const params = useParams();
  const productId = params.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [keptImageUrls, setKeptImageUrls] = useState<string[]>([]);
  const [newImageFiles, setNewImageFiles] = useState<File[]>([]);
  const [isFeatured, setIsFeatured] = useState(false);

  const api = useApi();
  const router = useRouter();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await api.auth.get(`/products/${productId}`);
        setProduct(data);
        setKeptImageUrls(data.images || []);
        setIsFeatured(data.isFeatured || false);
      } catch (error) {
        console.error("Failed to fetch product:", error);
        toast.error("Failed to load product");
        router.push("/admin/products");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId, api, router]);

  const handleRemoveKeptImage = (imageUrl: string) => {
    setKeptImageUrls((prev) => prev.filter((url) => url !== imageUrl));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setNewImageFiles(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);

    const formData = new FormData();
    const form = e.currentTarget;

    // Get form values
    const name = (form.elements.namedItem("name") as HTMLInputElement).value;
    const description = (
      form.elements.namedItem("description") as HTMLTextAreaElement
    ).value;
    const price = (form.elements.namedItem("price") as HTMLInputElement).value;
    const inventory = (form.elements.namedItem("inventory") as HTMLInputElement)
      .value;
    const categoryId = (
      form.elements.namedItem("categoryId") as HTMLInputElement
    ).value;

    // Append form fields as strings - they will be converted by backend DTO
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price); // Send as string, DTO will convert to number
    formData.append("inventory", inventory); // Send as string, DTO will convert to number
    formData.append("categoryId", categoryId);
    formData.append("isFeatured", isFeatured ? "true" : "false");

    // Send existing images as a JSON string - this will be parsed on backend
    // Note: The backend expects this field to be named 'existingImages'
    formData.append("existingImages", JSON.stringify(keptImageUrls));

    // Add new image files with field name 'images' (matches multer config)
    newImageFiles.forEach((file) => {
      formData.append("images", file);
    });
    
    try {
      await api.auth.patch(`/products/${productId}`, formData);
      toast.success("Product updated successfully");
      router.push("/admin/products");
    } catch (error: any) {
      console.error("Update product error:", error);
      toast.error(error.response?.data?.message || "Failed to update product");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold text-red-600">Product not found</h1>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Edit Product: {product.name}</h1>

      <form
        onSubmit={handleSubmit}
        encType="multipart/form-data"
        className="space-y-4"
      >
        <div>
          <label className="block text-sm font-medium mb-1">Product Name</label>
          <input
            name="name"
            defaultValue={product.name}
            required
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            name="description"
            defaultValue={product.description}
            required
            rows={4}
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Price ($)</label>
            <input
              name="price"
              type="number"
              step="0.01"
              min="0"
              defaultValue={product.price}
              required
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Inventory</label>
            <input
              name="inventory"
              type="number"
              min="0"
              defaultValue={product.inventory}
              required
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Category ID</label>
          <input
            name="categoryId"
            defaultValue={product.categoryId}
            required
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>

        {/* Featured Checkbox */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="isFeatured"
            checked={isFeatured}
            onChange={(e) => setIsFeatured(e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
          />
          <label htmlFor="isFeatured" className="text-sm font-medium">
            Featured Product
          </label>
        </div>

        {/* Current Images */}
        {keptImageUrls.length > 0 && (
          <div>
            <label className="block text-sm font-medium mb-2">
              Current Images
            </label>
            <div className="grid grid-cols-4 gap-2">
              {keptImageUrls.map((url, index) => (
                <div
                  key={index}
                  className="relative aspect-square border rounded-md overflow-hidden group"
                >
                  <Image
                    src={url}
                    alt={`Product image ${index + 1}`}
                    fill
                    priority
                    className="object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveKeptImage(url)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* New Images Upload */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Add New Images
          </label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileChange}
            className="w-full px-3 py-2 border rounded-md"
          />
          {newImageFiles.length > 0 && (
            <p className="text-sm text-muted-foreground mt-1">
              {newImageFiles.length} new file(s) selected
            </p>
          )}
        </div>

        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={submitting}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50"
          >
            {submitting ? "Updating..." : "Update Product"}
          </button>

          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 border rounded-md hover:bg-muted"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
