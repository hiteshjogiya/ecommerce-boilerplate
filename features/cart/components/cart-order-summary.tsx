import Link from "next/link";
import { Button } from "@/components/ui/button";
import { calculateCartTotals, type CartLineItem } from "@/src/services/cart.service";

interface CartOrderSummaryProps {
  items: CartLineItem[];
  onClearCart: () => Promise<unknown>;
  isBusy?: boolean;
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);
}

export function CartOrderSummary({ items, onClearCart, isBusy = false }: CartOrderSummaryProps) {
  const totals = calculateCartTotals(items);

  return (
    <aside className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold tracking-tight text-slate-900">Order summary</h2>
      <div className="mt-5 space-y-4 text-sm text-slate-600">
        <div className="flex items-center justify-between gap-4">
          <span>Subtotal</span>
          <span className="font-medium text-slate-900">{formatCurrency(totals.subtotal)}</span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <span>Estimated tax</span>
          <span className="font-medium text-slate-900">{formatCurrency(totals.estimatedTax)}</span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <span>Shipping</span>
          <span className="font-medium text-slate-900">{totals.shipping === 0 ? "Free" : formatCurrency(totals.shipping)}</span>
        </div>
        <div className="flex items-center justify-between gap-4 border-t border-slate-200 pt-4 text-base">
          <span className="font-medium text-slate-900">Grand total</span>
          <span className="font-semibold text-slate-900">{formatCurrency(totals.total)}</span>
        </div>
      </div>
      <div className="mt-6 flex flex-col gap-3">
        <Link href="/checkout" className="inline-flex h-12 items-center justify-center rounded-full bg-slate-900 px-6 text-base font-medium text-white transition hover:bg-slate-800">
          Proceed to checkout
        </Link>
        <Button type="button" variant="ghost" size="lg" className="w-full border border-slate-200" onClick={onClearCart} disabled={isBusy || !items.length}>
          Clear cart
        </Button>
        <Link href="/products" className="inline-flex h-11 items-center justify-center rounded-full border border-slate-200 px-4 text-sm font-medium text-slate-700 transition hover:border-blue-600 hover:text-blue-600">
          Continue shopping
        </Link>
      </div>
    </aside>
  );
}
