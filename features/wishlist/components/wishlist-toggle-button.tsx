"use client";

import { Heart } from "lucide-react";
import { useWishlist, useWishlistItemLoading } from "@/features/wishlist/hooks/use-wishlist";
import type { WishlistToggleProduct } from "@/src/services/wishlist.service";

interface WishlistToggleButtonProps {
  product: WishlistToggleProduct;
  className?: string;
  label?: string;
}

export function WishlistToggleButton({ product, className = "", label }: WishlistToggleButtonProps) {
  const { isWishlisted, toggleItem, wishlistLoading } = useWishlist();
  const isLoading = useWishlistItemLoading(product.id);
  const wished = isWishlisted(product.id);

  return (
    <button
      type="button"
      onClick={() => toggleItem(product)}
      disabled={isLoading || wishlistLoading}
      aria-pressed={wished}
      aria-label={label ?? `${wished ? "Remove" : "Add"} ${product.title} from wishlist`}
      className={`inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/70 bg-white/90 text-slate-700 shadow-sm transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
    >
      <Heart className={`h-4 w-4 transition ${wished ? "fill-red-500 text-red-500" : ""}`} />
    </button>
  );
}
