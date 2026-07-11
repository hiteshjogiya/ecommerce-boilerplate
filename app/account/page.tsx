import Link from "next/link";
import { AccountEmptyState } from "@/features/account/components/account-empty-state";
import { formatCurrency } from "@/src/constants/order";
import { getDashboardSummaryServer } from "@/src/services/account.server";

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(new Date(date));
}

export default async function AccountDashboardPage() {
  const summary = await getDashboardSummaryServer();

  if (!summary) {
    return null;
  }

  return (
    <div className="space-y-6">
      <section className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm uppercase tracking-[0.2em] text-blue-600">Dashboard</p>
        <h1 className="mt-2 text-2xl font-semibold text-slate-900">Welcome back, {summary.fullName}</h1>
        <p className="mt-1 text-sm text-slate-600">Manage your account, addresses, and orders from one place.</p>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Total orders</p>
            <p className="mt-1 text-2xl font-semibold text-slate-900">{summary.totalOrders}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Wishlist items</p>
            <p className="mt-1 text-2xl font-semibold text-slate-900">{summary.wishlistCount}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Default address</p>
            <p className="mt-1 text-sm font-medium text-slate-900">{summary.defaultAddress ? `${summary.defaultAddress.city}, ${summary.defaultAddress.country}` : "Not set"}</p>
          </div>
        </div>
      </section>

      <section className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-xl font-semibold text-slate-900">Recent orders</h2>
          <Link href="/account/orders" className="text-sm font-medium text-blue-600 hover:text-blue-700">View all</Link>
        </div>

        {summary.recentOrders.length === 0 ? (
          <div className="mt-4">
            <AccountEmptyState title="No orders yet" description="You have not placed any orders yet." actionHref="/products" actionLabel="Start shopping" />
          </div>
        ) : (
          <div className="mt-4 space-y-3">
            {summary.recentOrders.map((order) => (
              <Link key={order.id} href={`/account/orders/${order.order_number}`} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 p-3 hover:border-blue-600">
                <div>
                  <p className="font-medium text-slate-900">{order.order_number}</p>
                  <p className="text-xs text-slate-500">{formatDate(order.created_at)} • {order.status}</p>
                </div>
                <p className="text-sm font-semibold text-slate-900">{formatCurrency(Number(order.total))}</p>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
