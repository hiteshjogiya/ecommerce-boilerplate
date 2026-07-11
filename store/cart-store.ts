import { create } from "zustand";
import type { CartLineItem } from "@/src/services/cart.service";
import type { ProductDetailRecord } from "@/src/lib/product-detail";

export interface WishlistItem extends ProductDetailRecord {
  wishlist_item_id: string;
  wishlisted_at: string;
}

interface CartStore {
  items: CartLineItem[];
  wishlist: string[];
  wishlistItems: WishlistItem[];
  userId: string | null;
  isDrawerOpen: boolean;
  isBusy: boolean;
  processingItemIds: string[];
  error: string | null;
  wishlistLoading: boolean;
  wishlistProcessingIds: string[];
  wishlistError: string | null;
  setItems: (items: CartLineItem[]) => void;
  setUserId: (userId: string | null) => void;
  setDrawerOpen: (isOpen: boolean) => void;
  openDrawer: () => void;
  closeDrawer: () => void;
  toggleDrawer: () => void;
  setBusy: (isBusy: boolean) => void;
  setError: (error: string | null) => void;
  startItemMutation: (productId: string) => void;
  endItemMutation: (productId: string) => void;
  toggleWishlist: (id: string) => void;
  setWishlistItems: (items: WishlistItem[]) => void;
  setWishlistLoading: (isLoading: boolean) => void;
  setWishlistError: (error: string | null) => void;
  startWishlistMutation: (productId: string) => void;
  endWishlistMutation: (productId: string) => void;
}

export const useCartStore = create<CartStore>((set) => ({
  items: [],
  wishlist: [],
  wishlistItems: [],
  userId: null,
  isDrawerOpen: false,
  isBusy: false,
  processingItemIds: [],
  error: null,
  wishlistLoading: false,
  wishlistProcessingIds: [],
  wishlistError: null,
  setItems: (items) => set({ items }),
  setUserId: (userId) => set({ userId }),
  setDrawerOpen: (isDrawerOpen) => set({ isDrawerOpen }),
  openDrawer: () => set({ isDrawerOpen: true }),
  closeDrawer: () => set({ isDrawerOpen: false }),
  toggleDrawer: () => set((state) => ({ isDrawerOpen: !state.isDrawerOpen })),
  setBusy: (isBusy) => set({ isBusy }),
  setError: (error) => set({ error }),
  setWishlistItems: (wishlistItems) => set({ wishlistItems, wishlist: wishlistItems.map((item) => item.id) }),
  setWishlistLoading: (wishlistLoading) => set({ wishlistLoading }),
  setWishlistError: (wishlistError) => set({ wishlistError }),
  startItemMutation: (productId) =>
    set((state) => ({
      isBusy: true,
      processingItemIds: state.processingItemIds.includes(productId) ? state.processingItemIds : [...state.processingItemIds, productId],
    })),
  endItemMutation: (productId) =>
    set((state) => ({
      isBusy: state.processingItemIds.filter((itemId) => itemId !== productId).length > 0,
      processingItemIds: state.processingItemIds.filter((itemId) => itemId !== productId),
    })),
  toggleWishlist: (id) =>
    set((state) => ({
      wishlist: state.wishlist.includes(id) ? state.wishlist.filter((itemId) => itemId !== id) : [...state.wishlist, id],
    })),
  startWishlistMutation: (productId) =>
    set((state) => ({
      wishlistLoading: true,
      wishlistProcessingIds: state.wishlistProcessingIds.includes(productId) ? state.wishlistProcessingIds : [...state.wishlistProcessingIds, productId],
    })),
  endWishlistMutation: (productId) =>
    set((state) => ({
      wishlistLoading: state.wishlistProcessingIds.filter((itemId) => itemId !== productId).length > 0,
      wishlistProcessingIds: state.wishlistProcessingIds.filter((itemId) => itemId !== productId),
    })),
}));
