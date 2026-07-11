"use client";

import { useState } from "react";
import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { QuantitySelector } from "@/features/products/components/quantity-selector";
import { useCart, useCartItemLoading } from "@/features/cart/hooks/use-cart";
import { WishlistToggleButton } from "@/features/wishlist/components/wishlist-toggle-button";
import type { ProductDetailRecord } from "@/src/lib/product-detail";

interface AddToCartSectionProps {
  product: ProductDetailRecord;
}

function clampQuantity(value: number, maxQuantity: number) {
  return Math.min(Math.max(value, 1), maxQuantity);
}

export function AddToCartSection({ product }: AddToCartSectionProps) {
  const maxQuantity = Math.max(1, Number(product.stock) || 1);
  const [quantity, setQuantity] = useState(1);
  const { addToCart, isProcessing } = useCart();
  const isItemLoading = useCartItemLoading(product.id);
  const isDisabled = isProcessing || isItemLoading || Number(product.stock) <= 0 || !product.active;
  const safeQuantity = clampQuantity(quantity, maxQuantity);

  const handleAddToCart = async () => {
    const result = await addToCart(product, safeQuantity);

    if (result.success) {
      setQuantity(1);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-600">Quantity</p>
          <p className="text-xs text-slate-500">Maximum {maxQuantity}</p>
        </div>
      </div>
      <QuantitySelector maxQuantity={maxQuantity} value={safeQuantity} onChange={setQuantity} disabled={isDisabled} />
      <div className="flex flex-col gap-3 sm:flex-row">
        <Button size="lg" className="flex-1" onClick={handleAddToCart} disabled={isDisabled}>
          <ShoppingBag className="mr-2 h-4 w-4" />
          {isItemLoading ? "Adding..." : Number(product.stock) > 0 ? "Add to cart" : "Out of stock"}
        </Button>
        <WishlistToggleButton
          product={product}
          className="h-12 w-12 border border-slate-200 bg-white text-slate-700 shadow-none"
          label={`Toggle wishlist for ${product.title}`}
        />
        <Button size="lg" variant="ghost" className="border border-slate-200" disabled>
          Buy now
        </Button>
      </div>
    </div>
  );
}
