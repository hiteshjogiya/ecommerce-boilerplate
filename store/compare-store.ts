'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Database } from '@/src/types/database';

type ProductRow = Database["public"]["Tables"]["products"]["Row"];

interface CompareProduct extends ProductRow {
  rating?: number;
  reviewCount?: number;
}

interface CompareStore {
  products: CompareProduct[];
  addProduct: (product: CompareProduct) => void;
  removeProduct: (id: string) => void;
  clearAll: () => void;
  isInCompare: (id: string) => boolean;
}

export const useCompareStore = create<CompareStore>()(
  persist(
    (set, get) => ({
      products: [],
      addProduct: (product) => {
        const current = get().products;
        if (current.length >= 4 || current.find((p) => p.id === product.id)) return;
        set({ products: [...current, product] });
      },
      removeProduct: (id) => set({ products: get().products.filter((p) => p.id !== id) }),
      clearAll: () => set({ products: [] }),
      isInCompare: (id) => get().products.some((p) => p.id === id),
    }),
    { name: 'compare-products' }
  )
);
