"use client";

import { useCallback } from "react";
import { usePathname } from "next/navigation";
import { AppError } from "@/src/lib/errors";
import { redirectToLogin, removeFromWishlist, toggleWishlist, type WishlistProductRecord, type WishlistToggleProduct } from "@/src/services/wishlist.service";
import { useCart } from "@/features/cart/hooks/use-cart";
import { useToast } from "@/components/ui/toast";
import { useCartStore } from "@/store/cart-store";

function getWishlistMessage(error: unknown, fallback: string) {
  if (error instanceof AppError) {
    return error.message;
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
}

export function useWishlistCount() {
  return useCartStore((state) => state.wishlist.length);
}

export function useWishlistItems() {
  return useCartStore((state) => state.wishlistItems);
}

export function useWishlistItemLoading(productId: string) {
  return useCartStore((state) => state.wishlistProcessingIds.includes(productId));
}

export function useWishlist() {
  const pathname = usePathname();
  const { toast } = useToast();
  const { addToCart } = useCart();
  const wishlistIds = useCartStore((state) => state.wishlist);
  const wishlistItems = useCartStore((state) => state.wishlistItems);
  const setWishlistItems = useCartStore((state) => state.setWishlistItems);
  const setWishlistError = useCartStore((state) => state.setWishlistError);
  const startWishlistMutation = useCartStore((state) => state.startWishlistMutation);
  const endWishlistMutation = useCartStore((state) => state.endWishlistMutation);
  const wishlistLoading = useCartStore((state) => state.wishlistLoading);

  const isWishlisted = useCallback((productId: string) => wishlistIds.includes(productId), [wishlistIds]);

  const ensureAuthOrRedirect = useCallback(() => {
    const currentUserId = useCartStore.getState().userId;

    if (!currentUserId) {
      redirectToLogin(pathname);
      return false;
    }

    return true;
  }, [pathname]);

  const syncLocalItems = useCallback((productId: string, wished: boolean, product?: WishlistToggleProduct) => {
    const currentItems = useCartStore.getState().wishlistItems;

    if (!wished) {
      const nextItems = currentItems.filter((item) => item.id !== productId);
      setWishlistItems(nextItems);
      return;
    }

    if (!product) {
      return;
    }

    const nextItem = {
      ...product,
      wishlist_item_id: product.id,
      wishlisted_at: new Date().toISOString(),
    } as typeof currentItems[number];

    const nextItems = [nextItem, ...currentItems.filter((item) => item.id !== productId)];
    setWishlistItems(nextItems);
  }, [setWishlistItems]);

  const toggleItem = useCallback(async (product: WishlistToggleProduct) => {
    if (!ensureAuthOrRedirect()) {
      return { success: false as const, message: "Please sign in to manage your wishlist." };
    }

    startWishlistMutation(product.id);
    setWishlistError(null);

    const wasWishlisted = wishlistIds.includes(product.id);
    syncLocalItems(product.id, !wasWishlisted, product);

    try {
      const result = await toggleWishlist(product.id);

      if (result.wished) {
        toast({ title: "Saved to wishlist", description: `${product.title} was added to your wishlist.`, variant: "success" });
      } else {
        toast({ title: "Removed from wishlist", description: `${product.title} was removed from your wishlist.`, variant: "info" });
      }

      return { success: true as const, wished: result.wished };
    } catch (error) {
      syncLocalItems(product.id, wasWishlisted, product);
      const message = getWishlistMessage(error, "We could not update your wishlist right now.");
      setWishlistError(message);
      toast({ title: "Wishlist error", description: message, variant: "error" });
      return { success: false as const, message };
    } finally {
      endWishlistMutation(product.id);
    }
  }, [ensureAuthOrRedirect, endWishlistMutation, setWishlistError, startWishlistMutation, syncLocalItems, toast, wishlistIds]);

  const removeItem = useCallback(async (product: WishlistToggleProduct) => {
    if (!ensureAuthOrRedirect()) {
      return { success: false as const, message: "Please sign in to manage your wishlist." };
    }

    startWishlistMutation(product.id);
    setWishlistError(null);
    const previousItems = wishlistItems;
    setWishlistItems(previousItems.filter((item) => item.id !== product.id));

    try {
      await removeFromWishlist(product.id);
      toast({ title: "Removed from wishlist", description: `${product.title} was removed from your wishlist.`, variant: "info" });
      return { success: true as const };
    } catch (error) {
      setWishlistItems(previousItems);
      const message = getWishlistMessage(error, "We could not remove that item.");
      setWishlistError(message);
      toast({ title: "Wishlist error", description: message, variant: "error" });
      return { success: false as const, message };
    } finally {
      endWishlistMutation(product.id);
    }
  }, [ensureAuthOrRedirect, endWishlistMutation, setWishlistError, setWishlistItems, startWishlistMutation, toast, wishlistItems]);

  const moveItemToCart = useCallback(async (product: WishlistProductRecord) => {
    if (!ensureAuthOrRedirect()) {
      return { success: false as const, message: "Please sign in to manage your wishlist." };
    }

    startWishlistMutation(product.id);
    setWishlistError(null);

    try {
      const cartResult = await addToCart(product, 1);

      if (!cartResult.success) {
        return { success: false as const, message: cartResult.message };
      }

      await removeFromWishlist(product.id);
      setWishlistItems(wishlistItems.filter((item) => item.id !== product.id));
      toast({ title: "Moved to cart", description: `${product.title} was moved to your cart.`, variant: "success" });
      return { success: true as const };
    } catch (error) {
      const message = getWishlistMessage(error, "We could not move that item to your cart.");
      setWishlistError(message);
      toast({ title: "Wishlist error", description: message, variant: "error" });
      return { success: false as const, message };
    } finally {
      endWishlistMutation(product.id);
    }
  }, [addToCart, ensureAuthOrRedirect, endWishlistMutation, setWishlistError, setWishlistItems, startWishlistMutation, toast, wishlistItems]);

  return {
    wishlistItems,
    wishlistCount: wishlistIds.length,
    wishlistLoading,
    isWishlisted,
    toggleItem,
    removeItem,
    moveItemToCart,
  };
}
