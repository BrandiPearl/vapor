"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Product } from "./types";

export type CartLine = {
  product: Product;
  quantity: number;
};

const MAX_QTY = 99;

type CartState = {
  items: CartLine[];
  hasHydrated: boolean;
  setHasHydrated: (value: boolean) => void;
  addItem: (product: Product, quantity?: number) => number;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getQuantity: (productId: string) => number;
  isInCart: (productId: string) => boolean;
  totalItems: () => number;
  subtotal: () => number;
};

function clampQty(n: number) {
  if (!Number.isFinite(n)) return 1;
  return Math.min(MAX_QTY, Math.max(0, Math.floor(n)));
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      hasHydrated: false,
      setHasHydrated: (value) => set({ hasHydrated: value }),

      addItem: (product, quantity = 1) => {
        const addBy = Math.max(1, clampQty(quantity));
        let nextQty = addBy;

        set((state) => {
          const existing = state.items.find((i) => i.product.id === product.id);
          if (existing) {
            nextQty = clampQty(existing.quantity + addBy) || 1;
            return {
              items: state.items.map((i) =>
                i.product.id === product.id
                  ? { ...i, product, quantity: nextQty }
                  : i,
              ),
            };
          }
          nextQty = addBy;
          return {
            items: [...state.items, { product, quantity: nextQty }],
          };
        });

        return nextQty;
      },

      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((i) => i.product.id !== productId),
        })),

      updateQuantity: (productId, quantity) => {
        const next = clampQty(quantity);
        set((state) => ({
          items:
            next <= 0
              ? state.items.filter((i) => i.product.id !== productId)
              : state.items.map((i) =>
                  i.product.id === productId ? { ...i, quantity: next } : i,
                ),
        }));
      },

      clearCart: () => set({ items: [] }),

      getQuantity: (productId) =>
        get().items.find((i) => i.product.id === productId)?.quantity ?? 0,

      isInCart: (productId) =>
        get().items.some((i) => i.product.id === productId),

      totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),

      subtotal: () =>
        get().items.reduce(
          (sum, i) => sum + i.product.price * i.quantity,
          0,
        ),
    }),
    {
      name: "aussie-cloud-vape-cart",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);

/** Stable selector for badge counts (avoids calling methods in render incorrectly). */
export function selectCartCount(state: CartState) {
  return state.items.reduce((sum, i) => sum + i.quantity, 0);
}

export function selectCartSubtotal(state: CartState) {
  return state.items.reduce(
    (sum, i) => sum + i.product.price * i.quantity,
    0,
  );
}
