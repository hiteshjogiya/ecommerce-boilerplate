"use client";

import { useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/features/cart/hooks/use-cart";

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);
}

export function CartDrawer() {
  const { items, isDrawerOpen, closeDrawer, totalQuantity } = useCart();
  const subtotal = useMemo(() => items.reduce((sum, item) => sum + item.price * item.quantity, 0), [items]);
  const previewItems = items.slice(0, 4);

  useEffect(() => {
    if (!isDrawerOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeDrawer();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [closeDrawer, isDrawerOpen]);

  if (!isDrawerOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-100">
      <button type="button" aria-label="Close cart drawer" className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm" onClick={closeDrawer} />
      <aside className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col overflow-hidden border-l border-slate-200 bg-white shadow-[0_32px_80px_rgba(15,23,42,0.24)] sm:rounded-l-4xl sm:inset-y-4 sm:right-4 sm:h-[calc(100vh-2rem)] sm:max-h-225">
        <div className="flex items-center justify-between border-b border-slate-200 bg-linear-to-r from-slate-50 to-white px-5 py-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">Mini cart</p>
            <h2 className="mt-1 text-xl font-semibold text-slate-900">{totalQuantity} items</h2>
          </div>
          <button type="button" onClick={closeDrawer} className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800" aria-label="Close cart drawer">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto bg-slate-50/70 px-5 py-4">
          {previewItems.length ? (
            <div className="space-y-4">
              {previewItems.map((item) => (
                <div key={item.productId} className="flex gap-3 rounded-3xl border border-slate-200 bg-white p-3 shadow-sm">
                  <div className="relative h-20 w-20 flex-none overflow-hidden rounded-2xl bg-slate-100 ring-1 ring-slate-100">
                    <Image src={item.image} alt={item.name} fill sizes="80px" className="object-cover" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-sm font-semibold text-slate-900">{item.name}</h3>
                    <p className="mt-1 text-sm text-slate-600">Qty {item.quantity}</p>
                    <p className="mt-1 text-sm font-medium text-slate-900">{formatCurrency(item.price * item.quantity)}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex h-full items-center justify-center text-center">
              <div>
                <p className="text-base font-semibold text-slate-900">Your cart is empty</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">Add products from the catalog or a product detail page.</p>
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-slate-200 bg-white p-5">
          <div className="flex items-center justify-between text-sm text-slate-600">
            <span>Subtotal</span>
            <span className="font-semibold text-slate-900">{formatCurrency(subtotal)}</span>
          </div>
          <div className="mt-4 flex flex-col gap-3">
            <Link href="/cart" onClick={closeDrawer} className="inline-flex h-11 items-center justify-center rounded-full bg-blue-600 px-4 text-sm font-medium text-white transition hover:bg-blue-700">
              View cart
            </Link>
            <Button type="button" variant="secondary" className="w-full" disabled>
              Checkout coming soon
            </Button>
            <Button type="button" variant="ghost" className="w-full border border-slate-200" onClick={closeDrawer}>
              Continue shopping
            </Button>
          </div>
        </div>
      </aside>
    </div>
  );
}
