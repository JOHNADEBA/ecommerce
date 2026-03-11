import "server-only";
import { auth } from "@clerk/nextjs/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

// Helper to get auth headers for protected routes
async function getAuthHeaders(): Promise<HeadersInit | undefined> {
  try {
    const { getToken } = await auth();
    const token = await getToken();
    if (token) {
      return {
        Authorization: `Bearer ${token}`,
      } as HeadersInit;
    }
    return undefined;
  } catch (error) {
    console.error("Error getting auth token:", error);
    return undefined;
  }
}

export async function getProducts(params?: Record<string, any>) {
  const queryString = params ? `?${new URLSearchParams(params)}` : "";
  const url = `${API_URL}/products${queryString}`;

  try {
    const res = await fetch(url, {
      next: { revalidate: 60, tags: ["products"] },
    });

    if (!res.ok) {
      throw new Error(`API Error: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Network error:", error);
    throw error;
  }
}

export async function getCategories() {
  const url = `${API_URL}/categories`;

  try {
    const res = await fetch(url, {
      next: { revalidate: 3600, tags: ["categories"] },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch categories: ${res.status}`);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

export async function getCategory(slug: string) {
  const url = `${API_URL}/categories/${slug}`;

  try {
    const res = await fetch(url, {
      next: { revalidate: 3600, tags: [`category-${slug}`] },
    });

    if (!res.ok) {
      if (res.status === 404) {
        return null;
      }
      throw new Error(`Failed to fetch category: ${res.status}`);
    }

    return res.json();
  } catch (error) {
    console.error("Error fetching category:", error);
    return null;
  }
}

export async function getFeaturedProducts(limit: number = 8) {
  return getProducts({ isFeatured: true, limit });
}

export async function getProduct(slug: string) {
  const url = `${API_URL}/products/${slug}`;

  try {
    const res = await fetch(url, {
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      if (res.status === 404) {
        return null;
      }
      throw new Error(`Failed to fetch product: ${res.status}`);
    }

    return res.json();
  } catch (error) {
    console.error("Error fetching product:", error);
    throw error;
  }
}

export async function getCart(userId: string) {
  const url = `${API_URL}/cart/${userId}`;
  const headers = await getAuthHeaders();

  const fetchOptions: RequestInit = {
    next: { revalidate: 0 }, // Don't cache cart data
  };

  // Only add headers if they exist
  if (headers) {
    fetchOptions.headers = headers;
  }

  try {
    const res = await fetch(url, fetchOptions);

    if (!res.ok) {
      if (res.status === 404) {
        // Return empty cart if not found
        return {
          id: null,
          userId,
          items: [],
          subtotal: 0,
          totalItems: 0,
        };
      }
      throw new Error(`Failed to fetch cart: ${res.status}`);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching cart:", error);
    // Return empty cart on error
    return {
      id: null,
      userId,
      items: [],
      subtotal: 0,
      totalItems: 0,
    };
  }
}

export async function getOrders(userId: string) {
  const url = `${API_URL}/orders/user/${userId}`;
  const headers = await getAuthHeaders();

  const fetchOptions: RequestInit = {
    next: { revalidate: 30, tags: [`orders-${userId}`] },
  };

  if (headers) {
    fetchOptions.headers = headers;
  }

  try {
    const res = await fetch(url, fetchOptions);

    if (!res.ok) {
      throw new Error(`Failed to fetch orders: ${res.status}`);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching orders:", error);
    return [];
  }
}

export async function getOrder(orderId: string, userId: string) {
  const url = `${API_URL}/orders/${orderId}?userId=${userId}`;
  const headers = await getAuthHeaders();

  const fetchOptions: RequestInit = {
    next: { revalidate: 30, tags: [`order-${orderId}`] },
  };

  if (headers) {
    fetchOptions.headers = headers;
  }

  try {
    const res = await fetch(url, fetchOptions);

    if (!res.ok) {
      if (res.status === 404) {
        return null;
      }
      throw new Error(`Failed to fetch order: ${res.status}`);
    }

    return res.json();
  } catch (error) {
    console.error("Error fetching order:", error);
    return null;
  }
}
