export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  slug: string;
  inventory: number;
  categoryId: string;
  category: Category;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductsResponse {
  data: Product[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface CartItem {
  id: string;
  cartId: string;
  productId: string;
  quantity: number;
  product: Product;
  createdAt: string;
  updatedAt: string;
}

export interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
  subtotal?: number;
  totalItems?: number;
  updatedAt: string;
}

export interface Order {
  id: string;
  userId: string;
  total: number;
  status: "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  paymentIntentId: string;
  addressId: string;
  address: Address;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  product: Product;
  quantity: number;
  price: number;
}

export interface Address {
  id: string;
  userId: string;
  fullName: string;
  addressLine: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone?: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  clerkId: string;
  email: string;
  name?: string;
  role: "USER" | "ADMIN";
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
}
