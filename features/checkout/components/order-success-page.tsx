import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/src/constants/order";
import type { OrderWithItems } from "@/src/services/order.server";

interface OrderSuccessPageProps {
  order: OrderWithItems | null;
  orderNumber: string | null;
}

export function OrderSuccessPage({ order, orderNumber }: OrderSuccessPageProps) {
  if (!order || !orderNumber) {
    return (
      <main className="flex-1 bg-slate-50">
        <section className="mx-auto max-w-4xl px-4 py-10 lg:px-8">
          <div className="rounded-[28px] border border-slate-200 bg-white p-8 shadow-sm">
            <h1 className="text-2xl font-semibold text-slate-900">Order not found</h1>
            <p className="mt-2 text-sm text-slate-600">We could not find that order confirmation. Please check your recent orders in your profile.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/account/orders"><Button type="button" variant="secondary">View orders</Button></Link>
              <Link href="/products"><Button type="button" variant="ghost" className="border border-slate-200">Continue shopping</Button></Link>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="flex-1 bg-slate-50">
      <section className="mx-auto max-w-4xl px-4 py-10 lg:px-8">
        <div className="rounded-[28px] border border-emerald-200 bg-white p-8 shadow-sm">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700">
            <CheckCircle2 className="h-4 w-4" />
            Order confirmed
          </div>
          <h1 className="mt-4 text-3xl font-semibold text-slate-900">Thank you for your purchase</h1>
          <p className="mt-2 text-sm text-slate-600">Your order has been created successfully. We will email shipping updates soon.</p>

          <div className="mt-6 grid gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:grid-cols-2">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Order number</p>
              <p className="mt-1 font-semibold text-slate-900">{order.order_number}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Status</p>
              <p className="mt-1 font-semibold text-slate-900">{order.status}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Shipping method</p>
              <p className="mt-1 font-semibold text-slate-900">{order.shipping_method}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Order total</p>
              <p className="mt-1 font-semibold text-slate-900">{formatCurrency(Number(order.total))}</p>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            <h2 className="text-lg font-semibold text-slate-900">Order summary</h2>
            {order.order_items.map((item) => (
              <div key={item.id} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-3 text-sm">
                <div>
                  <p className="font-medium text-slate-900">{item.products?.title ?? "Product"}</p>
                  <p className="text-slate-500">Qty {item.quantity}</p>
                </div>
                <p className="font-semibold text-slate-900">{formatCurrency(Number(item.total_price))}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/products"><Button type="button" variant="secondary">Continue shopping</Button></Link>
            <Link href="/account/orders"><Button type="button" variant="ghost" className="border border-slate-200">View orders</Button></Link>
          </div>
        </div>
      </section>
    </main>
  );
}
