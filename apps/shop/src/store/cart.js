// stores/cartStore.js
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],

      addToCart: (product) => {
        const existing = get().items.find((item) => item._id === product._id);
        if (!existing) {
          set({ items: [...get().items, { ...product, quantity: 1 }] });
        } else {
          set({
            items: get().items.map((item) =>
              item._id === product._id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            ),
          });
        }
      },

      removeFromCart: (id) => {
        set({ items: get().items.filter((item) => item._id !== id) });
      },

      clearCart: () => set({ items: [] }),

      getTotalItems: () =>
        get().items.reduce((total, item) => total + item.quantity, 0),

      getTotalAmount: () =>
        get().items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        ),
    }),
    { name: "cart-storage" }
  )
);
