"use client";

import Image from "next/image";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { QuantitySelector } from "@/features/products/components/quantity-selector";
import { useCart, useCartItemLoading } from "@/features/cart/hooks/use-cart";
import type { CartLineItem } from "@/src/services/cart.service";

interface CartLineItemRowProps {
  item: CartLineItem;
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);
}

function getStockLabel(stock: number) {
  if (stock > 10) {
    return "In stock";
  }

  if (stock > 0) {
    return `Only ${stock} left`;
  }

  return "Unavailable";
}

export function CartLineItemRow({ item }: CartLineItemRowProps) {
  const { updateQuantity, removeItem } = useCart();
  const isLoading = useCartItemLoading(item.productId);
  const maxQuantity = Math.max(1, item.stock || 1);

  const handleQuantityChange = async (quantity: number) => {
    await updateQuantity(item, quantity);
  };

  return (
    <article className="grid gap-4 rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-[120px_minmax(0,1fr)]">
      <div className="relative h-32 overflow-hidden rounded-2xl bg-slate-100 md:h-full">
        {item.slug && item.active ? (
          <Link href={`/products/${item.slug}`} className="absolute inset-0 z-10" aria-label={`View ${item.name}`} />
        ) : null}
        <Image src={item.image} alt={item.name} fill sizes="(max-width: 768px) 100vw, 120px" className="object-cover" />
      </div>
      <div className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              {item.slug && item.active ? (
                <Link href={`/products/${item.slug}`} className="text-lg font-semibold text-slate-900 hover:text-blue-600">
                  {item.name}
                </Link>
              ) : (
                <h3 className="text-lg font-semibold text-slate-900">{item.name}</h3>
              )}
              <span className={`rounded-full px-3 py-1 text-xs font-medium ${item.active && item.stock > 0 ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`}>
                {getStockLabel(item.stock)}
              </span>
            </div>
            <p className="max-w-2xl text-sm leading-7 text-slate-600">{item.description}</p>
          </div>
          <div className="text-left sm:text-right">
            <p className="text-lg font-semibold text-slate-900">{formatCurrency(item.price)}</p>
            {item.originalPrice ? <p className="text-sm text-slate-400 line-through">{formatCurrency(item.originalPrice)}</p> : null}
          </div>
        </div>

        <div className="flex flex-col gap-4 border-t border-slate-200 pt-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-slate-600">Quantity</p>
            <QuantitySelector maxQuantity={maxQuantity} value={item.quantity} onChange={handleQuantityChange} showSelectedLabel={false} disabled={isLoading} />
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm text-slate-500">Line total</p>
              <p className="text-lg font-semibold text-slate-900">{formatCurrency(item.price * item.quantity)}</p>
            </div>
            <Button type="button" variant="ghost" className="border border-slate-200 text-rose-600 hover:bg-rose-50 hover:text-rose-700" onClick={() => removeItem(item.productId)} disabled={isLoading}>
              <Trash2 className="mr-2 h-4 w-4" />
              Remove
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
}
