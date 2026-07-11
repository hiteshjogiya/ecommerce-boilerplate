import { notFound } from "next/navigation";
import { formatCurrency } from "@/src/constants/order";
import { getUserOrderDetailsServer } from "@/src/services/account.server";

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric" }).format(new Date(date));
}

export default async function AccountOrderDetailsPage({ params }: { params: Promise<{ orderNumber: string }> }) {
  const { orderNumber } = await params;
  const order = await getUserOrderDetailsServer(orderNumber);

  if (!order) {
    notFound();
  }

  const address = order.shipping_address as Record<string, string | null>;

  return (
    <div className="space-y-6">
      <section className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">Order {order.order_number}</h1>
        <p className="mt-1 text-sm text-slate-600">Placed on {formatDate(order.created_at)}</p>

        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 text-sm">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Status</p>
            <p className="mt-1 font-medium text-slate-900">{order.status}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 text-sm">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Shipping method</p>
            <p className="mt-1 font-medium text-slate-900">{order.shipping_method}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 text-sm">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Total</p>
            <p className="mt-1 font-medium text-slate-900">{formatCurrency(Number(order.total))}</p>
          </div>
        </div>
      </section>

      <section className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Shipping address</h2>
        <p className="mt-2 text-sm text-slate-700">
          {address.full_name}<br />
          {address.address_line_1}{address.address_line_2 ? `, ${address.address_line_2}` : ""}<br />
          {address.city}, {address.state}, {address.country} {address.postal_code}<br />
          {address.email} • {address.phone}
        </p>
      </section>

      <section className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Order items</h2>
        <div className="mt-4 space-y-3">
          {order.order_items.map((item) => (
            <div key={item.id} className="flex items-center justify-between rounded-2xl border border-slate-200 p-3 text-sm">
              <div>
                <p className="font-medium text-slate-900">{item.products?.title ?? "Product"}</p>
                <p className="text-slate-500">Quantity: {item.quantity}</p>
              </div>
              <div className="text-right">
                <p className="text-slate-500">Unit: {formatCurrency(Number(item.unit_price))}</p>
                <p className="font-semibold text-slate-900">{formatCurrency(Number(item.total_price))}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-5 space-y-2 border-t border-slate-200 pt-4 text-sm">
          <div className="flex justify-between"><span className="text-slate-600">Subtotal</span><span>{formatCurrency(Number(order.subtotal))}</span></div>
          <div className="flex justify-between"><span className="text-slate-600">Shipping</span><span>{formatCurrency(Number(order.shipping_cost))}</span></div>
          <div className="flex justify-between"><span className="text-slate-600">Tax</span><span>{formatCurrency(Number(order.tax))}</span></div>
          <div className="flex justify-between"><span className="text-slate-600">Discount</span><span>{formatCurrency(Number(order.discount))}</span></div>
          <div className="flex justify-between text-base font-semibold"><span>Total</span><span>{formatCurrency(Number(order.total))}</span></div>
        </div>
      </section>
    </div>
  );
}
