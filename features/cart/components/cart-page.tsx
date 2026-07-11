"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyCartState } from "@/features/cart/components/empty-cart-state";
import { CartLineItemRow } from "@/features/cart/components/cart-line-item-row";
import { CartOrderSummary } from "@/features/cart/components/cart-order-summary";
import { useCart } from "@/features/cart/hooks/use-cart";

export function CartPage() {
  const { items, clearCart, isBusy } = useCart();

  if (!items.length) {
    return (
      <main className="flex-1 bg-slate-50">
        <section className="mx-auto max-w-7xl px-4 py-8 lg:px-8 lg:py-10">
          <div className="rounded-4xl border border-slate-200 bg-white p-8 shadow-sm lg:p-10">
            <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
              <ShoppingBag className="h-4 w-4" />
              Cart
            </div>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">Shopping cart</h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">Review the items you want to purchase, update quantities, and continue to checkout when you are ready.</p>
            <div className="mt-8">
              <EmptyCartState />
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="flex-1 bg-slate-50">
      <section className="mx-auto max-w-7xl px-4 py-8 lg:px-8 lg:py-10">
        <div className="rounded-4xl border border-slate-200 bg-white p-8 shadow-sm lg:p-10">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
                <ShoppingBag className="h-4 w-4" />
                Cart
              </div>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">Shopping cart</h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">Update quantities, review line totals, and keep your cart synchronized across refreshes and devices.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/products" className="inline-flex h-11 items-center rounded-full border border-slate-200 px-4 text-sm font-medium text-slate-700 transition hover:border-blue-600 hover:text-blue-600">
                Continue shopping
              </Link>
              <Button type="button" variant="ghost" className="border border-slate-200" onClick={clearCart} disabled={isBusy}>
                Clear cart
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-4 pb-16 lg:grid-cols-[minmax(0,1fr)_360px] lg:px-8">
        <div className="space-y-4">
          {items.map((item) => (
            <CartLineItemRow key={item.productId} item={item} />
          ))}
        </div>
        <CartOrderSummary items={items} onClearCart={clearCart} isBusy={isBusy} />
      </section>
    </main>
  );
}
