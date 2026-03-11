"use client";

import { useState } from "react";
import { useApi } from "@/lib/api/client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useUser } from "@clerk/nextjs";

export default function CreateProductPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [isFeatured, setIsFeatured] = useState(false);
  const api = useApi();
  const router = useRouter();
  const { isSignedIn } = useUser();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!isSignedIn) {
      toast.error("Please sign in to create products");
      return;
    }

    setLoading(true);

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

    // Append form fields
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("inventory", inventory);
    formData.append("categoryId", categoryId);

    // Append isFeatured as boolean string
    formData.append("isFeatured", String(isFeatured));

    // Append files
    files.forEach((file) => {
      formData.append("images", file);
    });

    try {
      await api.auth.post("/products", formData);

      toast.success("Product created successfully");
      router.push("/admin/products");
    } catch (error: any) {
      console.error("Create product error:", error);
      toast.error(error.response?.data?.message || "Failed to create product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Create New Product</h1>

      <form
        onSubmit={handleSubmit}
        encType="multipart/form-data"
        className="space-y-4"
      >
        <div>
          <label className="block text-sm font-medium mb-1">Product Name</label>
          <input
            name="name"
            placeholder="Enter product name"
            required
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            name="description"
            placeholder="Enter product description"
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
              required
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Category ID</label>
          <input
            name="categoryId"
            placeholder="Enter category ID"
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

        <div>
          <label className="block text-sm font-medium mb-1">
            Product Images
          </label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => setFiles(Array.from(e.target.files || []))}
            className="w-full px-3 py-2 border rounded-md"
          />
          {files.length > 0 && (
            <p className="text-sm text-muted-foreground mt-1">
              {files.length} file(s) selected
            </p>
          )}
        </div>

        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Product"}
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
