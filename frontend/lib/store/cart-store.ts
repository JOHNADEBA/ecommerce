import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  maxStock: number;
}

interface CartStore {
  items: CartItem[];
  localOnly: boolean;
  addItem: (item: Omit<CartItem, "id">) => void;
  removeItem: (id: string) => void; // Can be itemId or productId
  updateQuantity: (id: string, quantity: number) => void; // id can be itemId or productId
  clearCart: () => void;
  setItems: (items: CartItem[]) => void;
  totalItems: () => number;
  subtotal: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      localOnly: true,

      addItem: (newItem) => {
        const items = get().items;
        const existingItem = items.find(
          (item) => item.productId === newItem.productId,
        );

        if (existingItem) {
          const updatedItems = items.map((item) =>
            item.productId === newItem.productId
              ? {
                  ...item,
                  quantity: Math.min(
                    item.quantity + newItem.quantity,
                    item.maxStock,
                  ),
                }
              : item,
          );
          // Only update if quantity actually changed
          if (JSON.stringify(items) !== JSON.stringify(updatedItems)) {
            set({ items: updatedItems, localOnly: true });
          }
        } else {
          set({
            items: [...items, { ...newItem, id: crypto.randomUUID() }],
            localOnly: true,
          });
        }
      },

      removeItem: (id) => {
        const items = get().items;
        // Try to remove by item id first, then by product id
        const updatedItems = items.filter(
          (item) => item.id !== id && item.productId !== id,
        );
        if (items.length !== updatedItems.length) {
          set({ items: updatedItems });
        }
      },

      updateQuantity: (id, quantity) => {
        set((state) => {
          const items = state.items;

          // Try to find by item id first, then by product id
          const updatedItems = items.map((item) => {
            if (item.id === id || item.productId === id) {
              return {
                ...item,
                quantity: Math.min(quantity, item.maxStock),
              };
            }
            return item;
          });

          // Only update if quantity actually changed
          if (JSON.stringify(items) !== JSON.stringify(updatedItems)) {
            return { items: updatedItems, localOnly: true };
          }
          return state;
        });
      },

      clearCart: () => {
        set({ items: [], localOnly: true });
      },

      setItems: (items) => {
        const currentItems = get().items;
        // Only update if items actually changed
        if (JSON.stringify(currentItems) !== JSON.stringify(items)) {
          set({ items, localOnly: false });
        }
      },

      totalItems: () =>
        get().items.reduce((sum, item) => sum + item.quantity, 0),

      subtotal: () =>
        get().items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    }),
    {
      name: "cart-storage",
    },
  ),
);
