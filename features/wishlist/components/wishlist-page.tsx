"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { WishlistEmptyState } from "@/features/wishlist/components/wishlist-empty-state";
import { WishlistItemRow } from "@/features/wishlist/components/wishlist-item-row";
import { useWishlistItems } from "@/features/wishlist/hooks/use-wishlist";
import { useCartStore } from "@/store/cart-store";

export function WishlistPage() {
  const items = useWishlistItems();
  const loading = useCartStore((state) => state.wishlistLoading);
  const error = useCartStore((state) => state.wishlistError);

  if (loading) {
    return (
      <main className="flex-1 bg-slate-50">
        <section className="mx-auto max-w-7xl px-4 py-8 lg:px-8 lg:py-10">
          <div className="animate-pulse rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm lg:p-10">
            <div className="h-4 w-32 rounded-full bg-slate-200" />
            <div className="mt-4 h-10 w-72 rounded-2xl bg-slate-200" />
            <div className="mt-3 h-4 w-full max-w-2xl rounded-full bg-slate-200" />
            <div className="mt-8 h-64 rounded-[28px] bg-slate-100" />
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="flex-1 bg-slate-50">
      <section className="mx-auto max-w-7xl px-4 py-8 lg:px-8 lg:py-10">
        <div className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm lg:p-10">
          <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
            <Heart className="h-4 w-4" />
            Wishlist
          </div>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">Saved items</h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">Track products you love, compare them later, and move them into your cart when you’re ready.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/products" className="inline-flex h-11 items-center rounded-full border border-slate-200 px-4 text-sm font-medium text-slate-700 transition hover:border-blue-600 hover:text-blue-600">
              Continue shopping
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16 lg:px-8">
        {error ? (
          <div className="mb-6 rounded-[24px] border border-rose-200 bg-rose-50 px-5 py-4 text-sm text-rose-700">{error}</div>
        ) : null}

        {items.length ? (
          <div className="space-y-4">
            {items.map((item) => (
              <WishlistItemRow key={item.wishlist_item_id} item={item} />
            ))}
          </div>
        ) : (
          <WishlistEmptyState />
        )}
      </section>
    </main>
  );
}
