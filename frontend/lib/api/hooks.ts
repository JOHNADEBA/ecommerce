import { useApi } from "./client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Product,
  ProductsResponse,
  Cart,
  CartItem,
  Order,
  OrderItem,
  Address,
  User,
} from "./types";

// ============ Products Hooks ============

export const useProducts = (params?: Record<string, any>) => {
  const api = useApi();

  return useQuery<ProductsResponse>({
    queryKey: ["products", params],
    queryFn: () => api.public.get(`/products?${new URLSearchParams(params)}`),
  });
};

export const useProduct = (slug: string) => {
  const api = useApi();

  return useQuery<Product>({
    queryKey: ["product", slug],
    queryFn: () => api.public.get(`/products/${slug}`),
    enabled: !!slug,
  });
};

// ============ Cart Hooks ============

export const useCart = (userId: string) => {
  const api = useApi();

  return useQuery<Cart>({
    queryKey: ["cart", userId],
    queryFn: () => api.auth.get(`/cart/${userId}`),
    enabled: !!userId,
  });
};

interface AddToCartData {
  productId: string;
  quantity: number;
}

export const useAddToCart = () => {
  const api = useApi();
  const queryClient = useQueryClient();

  return useMutation<Cart, Error, { userId: string; data: AddToCartData }>({
    mutationFn: ({ userId, data }) =>
      api.auth.post(`/cart/${userId}/items`, data),
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({ queryKey: ["cart", userId] });
    },
  });
};

interface UpdateCartItemData {
  quantity?: number;
}

export const useUpdateCartItem = () => {
  const api = useApi();
  const queryClient = useQueryClient();

  return useMutation<
    Cart,
    Error,
    { userId: string; itemId: string; data: UpdateCartItemData }
  >({
    mutationFn: ({ userId, itemId, data }) =>
      api.auth.patch(`/cart/${userId}/items/${itemId}`, data),
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({ queryKey: ["cart", userId] });
    },
  });
};

export const useRemoveFromCart = () => {
  const api = useApi();
  const queryClient = useQueryClient();

  return useMutation<Cart, Error, { userId: string; itemId: string }>({
    mutationFn: ({ userId, itemId }) =>
      api.auth.delete(`/cart/${userId}/items/${itemId}`),
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({ queryKey: ["cart", userId] });
    },
  });
};

export const useClearCart = () => {
  const api = useApi();
  const queryClient = useQueryClient();

  return useMutation<Cart, Error, { userId: string }>({
    mutationFn: ({ userId }) => api.auth.delete(`/cart/${userId}/clear`),
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({ queryKey: ["cart", userId] });
    },
  });
};

// ============ Orders Hooks ============

export const useOrders = (userId: string) => {
  const api = useApi();

  return useQuery<Order[]>({
    queryKey: ["orders", userId],
    queryFn: () => api.auth.get(`/orders/user/${userId}`),
    enabled: !!userId,
  });
};

export const useOrder = (orderId: string, userId: string) => {
  const api = useApi();

  return useQuery<Order>({
    queryKey: ["order", orderId],
    queryFn: () => api.auth.get(`/orders/${orderId}?userId=${userId}`),
    enabled: !!orderId && !!userId,
  });
};

interface CreateOrderData {
  addressId: string;
  paymentIntentId: string;
  items: Array<{
    productId: string;
    quantity: number;
    price: number;
  }>;
  notes?: string;
}

export const useCreateOrder = () => {
  const api = useApi();
  const queryClient = useQueryClient();

  return useMutation<Order, Error, { userId: string; data: CreateOrderData }>({
    mutationFn: ({ userId, data }) =>
      api.auth.post(`/orders/user/${userId}`, data),
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({ queryKey: ["orders", userId] });
      queryClient.invalidateQueries({ queryKey: ["cart", userId] });
    },
  });
};

// ============ Addresses Hooks ============

export const useAddresses = (userId: string) => {
  const api = useApi();

  return useQuery<Address[]>({
    queryKey: ["addresses", userId],
    queryFn: () => api.auth.get(`/users/${userId}/addresses`),
    enabled: !!userId,
  });
};

export const useAddress = (userId: string, addressId: string) => {
  const api = useApi();

  return useQuery<Address>({
    queryKey: ["address", addressId],
    queryFn: () => api.auth.get(`/users/${userId}/addresses/${addressId}`),
    enabled: !!userId && !!addressId,
  });
};

interface CreateAddressData {
  fullName: string;
  addressLine: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone?: string;
  isDefault?: boolean;
}

export const useCreateAddress = () => {
  const api = useApi();
  const queryClient = useQueryClient();

  return useMutation<
    Address,
    Error,
    { userId: string; data: CreateAddressData }
  >({
    mutationFn: ({ userId, data }) =>
      api.auth.post(`/users/${userId}/addresses`, data),
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({ queryKey: ["addresses", userId] });
    },
  });
};

interface UpdateAddressData extends Partial<CreateAddressData> {}

export const useUpdateAddress = () => {
  const api = useApi();
  const queryClient = useQueryClient();

  return useMutation<
    Address,
    Error,
    { userId: string; addressId: string; data: UpdateAddressData }
  >({
    mutationFn: ({ userId, addressId, data }) =>
      api.auth.patch(`/users/${userId}/addresses/${addressId}`, data),
    onSuccess: (_, { userId, addressId }) => {
      queryClient.invalidateQueries({ queryKey: ["addresses", userId] });
      queryClient.invalidateQueries({ queryKey: ["address", addressId] });
    },
  });
};

export const useDeleteAddress = () => {
  const api = useApi();
  const queryClient = useQueryClient();

  return useMutation<void, Error, { userId: string; addressId: string }>({
    mutationFn: ({ userId, addressId }) =>
      api.auth.delete(`/users/${userId}/addresses/${addressId}`),
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({ queryKey: ["addresses", userId] });
    },
  });
};

export const useSetDefaultAddress = () => {
  const api = useApi();
  const queryClient = useQueryClient();

  return useMutation<Address, Error, { userId: string; addressId: string }>({
    mutationFn: ({ userId, addressId }) =>
      api.auth.patch(`/users/${userId}/addresses/${addressId}/default`, {}),
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({ queryKey: ["addresses", userId] });
    },
  });
};

// ============ Users Hooks ============

export const useCurrentUser = () => {
  const api = useApi();

  return useQuery<User>({
    queryKey: ["currentUser"],
    queryFn: () => api.auth.get("/users/me"),
    retry: false,
  });
};

export const useUpdateCurrentUser = () => {
  const api = useApi();
  const queryClient = useQueryClient();

  return useMutation<User, Error, { data: Partial<User> }>({
    mutationFn: ({ data }) => api.auth.patch("/users/me", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    },
  });
};
