"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingBag, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWishlist, useWishlistItemLoading } from "@/features/wishlist/hooks/use-wishlist";
import type { WishlistProductRecord } from "@/src/services/wishlist.service";

interface WishlistItemRowProps {
  item: WishlistProductRecord;
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

export function WishlistItemRow({ item }: WishlistItemRowProps) {
  const { removeItem, moveItemToCart } = useWishlist();
  const isLoading = useWishlistItemLoading(item.id);
  const categoryName = item.categories?.name ?? "Uncategorized";
  const categorySlug = item.categories?.slug ?? "";
  const stockLabel = getStockLabel(Number(item.stock));

  return (
    <article className="grid gap-4 rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-[120px_minmax(0,1fr)]">
      <div className="relative h-32 overflow-hidden rounded-2xl bg-slate-100 md:h-full">
        <Image src={item.thumbnail ?? "/window.svg"} alt={item.title} fill sizes="(max-width: 768px) 100vw, 120px" className="object-cover" />
      </div>
      <div className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <Link href={`/products/${item.slug}`} className="text-lg font-semibold text-slate-900 hover:text-blue-600">
                {item.title}
              </Link>
              {categorySlug ? (
                <Link href={`/categories/${categorySlug}`} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700 hover:text-blue-600">
                  {categoryName}
                </Link>
              ) : (
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">{categoryName}</span>
              )}
              <span className={`rounded-full px-3 py-1 text-xs font-medium ${Number(item.stock) > 0 && item.active ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`}>
                {stockLabel}
              </span>
            </div>
            <p className="max-w-2xl text-sm leading-7 text-slate-600">{item.description}</p>
          </div>
          <div className="text-left sm:text-right">
            <p className="text-lg font-semibold text-slate-900">{formatCurrency(Number(item.price))}</p>
            {item.compare_price ? <p className="text-sm text-slate-400 line-through">{formatCurrency(Number(item.compare_price))}</p> : null}
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-slate-200 pt-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm text-slate-500">Saved on {new Date(item.wishlisted_at).toLocaleDateString()}</div>
          <div className="flex flex-wrap items-center gap-3">
            <Link href={`/products/${item.slug}`} className="inline-flex h-11 items-center rounded-full border border-slate-200 px-4 text-sm font-medium text-slate-700 transition hover:border-blue-600 hover:text-blue-600">
              View product
            </Link>
            <Button type="button" variant="secondary" onClick={() => moveItemToCart(item)} disabled={isLoading || !item.active || Number(item.stock) <= 0}>
              <ShoppingBag className="mr-2 h-4 w-4" />
              {isLoading ? "Moving..." : "Move to cart"}
            </Button>
            <Button type="button" variant="ghost" className="border border-slate-200 text-rose-600 hover:bg-rose-50 hover:text-rose-700" onClick={() => removeItem(item)} disabled={isLoading}>
              <Trash2 className="mr-2 h-4 w-4" />
              {isLoading ? "Removing..." : "Remove"}
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
}
