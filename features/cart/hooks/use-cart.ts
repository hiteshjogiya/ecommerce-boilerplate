"use client";

import { useCallback } from "react";
import { buildCartLineItem, calculateCartTotals, clampCartQuantity, syncRemoteCartItems, upsertCartLineItem, writeGuestCartItems, type CartLineItem } from "@/src/services/cart.service";
import { useToast } from "@/components/ui/toast";
import { useCartStore } from "@/store/cart-store";
import type { ProductDetailRecord } from "@/src/lib/product-detail";

function getCartErrorMessage(error: unknown, fallback: string) {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
}

async function persistCartSnapshot(nextItems: CartLineItem[], userId: string | null) {
  if (userId) {
    await syncRemoteCartItems(userId, nextItems);
    // Keep a local backup to avoid cart loss if remote sync is temporarily unavailable.
    writeGuestCartItems(nextItems);
    return;
  }

  writeGuestCartItems(nextItems);
}

async function mutateCartItem(
  productId: string,
  nextItems: CartLineItem[],
  options: {
    successTitle?: string;
    successDescription?: string;
    fallbackMessage: string;
    showSuccessToast?: boolean;
    toastVariant?: "success" | "error" | "info";
    toast?: (message: { title: string; description?: string; variant: "success" | "error" | "info" }) => void;
  },
) {
  const store = useCartStore.getState();
  const previousItems = store.items;

  store.startItemMutation(productId);
  store.setError(null);
  store.setItems(nextItems);

  try {
    await persistCartSnapshot(nextItems, store.userId);
    if (options.showSuccessToast !== false) {
      options.toast?.({
        title: options.successTitle ?? "Cart updated",
        description: options.successDescription,
        variant: options.toastVariant ?? "success",
      });
    }

    return { success: true as const };
  } catch (error) {
    store.setItems(previousItems);
    const message = getCartErrorMessage(error, options.fallbackMessage);
    store.setError(message);
    options.toast?.({ title: "Cart error", description: message, variant: "error" });
    return { success: false as const, message };
  } finally {
    store.endItemMutation(productId);
  }
}

export function useCartTotals() {
  const items = useCartStore((state) => state.items);
  return calculateCartTotals(items);
}

export function useCart() {
  const { toast } = useToast();
  const items = useCartStore((state) => state.items);
  const userId = useCartStore((state) => state.userId);
  const isDrawerOpen = useCartStore((state) => state.isDrawerOpen);
  const isBusy = useCartStore((state) => state.isBusy);
  const processingItemIds = useCartStore((state) => state.processingItemIds);
  const openDrawer = useCartStore((state) => state.openDrawer);
  const closeDrawer = useCartStore((state) => state.closeDrawer);
  const toggleDrawer = useCartStore((state) => state.toggleDrawer);
  const setItems = useCartStore((state) => state.setItems);
  const setError = useCartStore((state) => state.setError);

  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
  const isProcessing = isBusy || processingItemIds.length > 0;

  const addToCart = useCallback(
    async (product: ProductDetailRecord, quantity = 1) => {
      if (!product.active || Number(product.stock) <= 0) {
        const message = "This item is currently unavailable.";
        toast({ title: "Cart error", description: message, variant: "error" });
        return { success: false as const, message };
      }

      const currentState = useCartStore.getState();
      const currentItem = currentState.items.find((item) => item.productId === product.id);
      const maxQuantity = Number(product.stock) || 1;
      const nextQuantity = clampCartQuantity((currentItem?.quantity ?? 0) + quantity, maxQuantity);
      const nextItem = buildCartLineItem(product, nextQuantity);
      const nextItems = upsertCartLineItem(currentState.items, nextItem);

      return mutateCartItem(product.id, nextItems, {
        successTitle: "Added to cart",
        successDescription: `${product.title} was added to your cart.`,
        fallbackMessage: "We could not add that item to your cart.",
        toast,
      });
    },
    [toast],
  );

  const updateQuantity = useCallback(async (item: CartLineItem, quantity: number) => {
      const currentState = useCartStore.getState();
      const existing = currentState.items.find((cartItem) => cartItem.productId === item.productId);

      if (!existing) {
        return { success: false as const, message: "Item not found." };
      }

      const nextQuantity = clampCartQuantity(quantity, existing.stock || item.stock || 1);
      const nextItem = buildCartLineItem(
        {
          id: item.productId,
          slug: item.slug ?? undefined,
          title: item.name,
          description: item.description,
          price: item.price,
          compare_price: item.originalPrice ?? null,
          stock: existing.stock || item.stock,
          thumbnail: item.image,
          active: item.active,
        },
        nextQuantity,
      );

      const nextItems = upsertCartLineItem(currentState.items, nextItem);
      return mutateCartItem(item.productId, nextItems, {
        successTitle: "Cart updated",
        successDescription: `${item.name} quantity updated.`,
        fallbackMessage: "We could not update that item.",
        showSuccessToast: false,
        toast,
      });
  }, [toast]);

  const removeItem = useCallback(async (productId: string) => {
    const currentState = useCartStore.getState();
    const nextItems = currentState.items.filter((item) => item.productId !== productId);
    return mutateCartItem(productId, nextItems, {
      successTitle: "Item removed",
      fallbackMessage: "We could not remove that item.",
      showSuccessToast: false,
      toast,
    });
  }, [toast]);

  const clearCart = useCallback(async () => {
    const nextItems: CartLineItem[] = [];

    return mutateCartItem("__cart__", nextItems, {
      successTitle: "Cart cleared",
      fallbackMessage: "We could not clear your cart.",
      showSuccessToast: false,
      toast,
    });
  }, [toast]);

  return {
    items,
    userId,
    isDrawerOpen,
    isBusy,
    isProcessing,
    processingItemIds,
    totalQuantity,
    openDrawer,
    closeDrawer,
    toggleDrawer,
    setItems,
    setError,
    addToCart,
    updateQuantity,
    removeItem,
    clearCart,
    toast,
  };
}

export function useCartItemLoading(productId: string) {
  return useCartStore((state) => state.processingItemIds.includes(productId));
}
