import Link from "next/link";
import { AccountEmptyState } from "@/features/account/components/account-empty-state";
import { formatCurrency } from "@/src/constants/order";
import { getUserOrdersServer } from "@/src/services/account.server";

type SearchParams = Record<string, string | string[] | undefined>;

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(new Date(date));
}

export default async function AccountOrdersPage({ searchParams }: { searchParams?: Promise<SearchParams> }) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const pageValue = typeof resolvedSearchParams?.page === "string" ? Number(resolvedSearchParams.page) : 1;
  const page = Number.isFinite(pageValue) && pageValue > 0 ? pageValue : 1;
  const pageSize = 10;
  const { orders, total } = await getUserOrdersServer(page, pageSize);
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
      <h1 className="text-2xl font-semibold text-slate-900">Orders</h1>
      <p className="mt-1 text-sm text-slate-600">Sorted by newest first.</p>

      {orders.length === 0 ? (
        <div className="mt-5">
          <AccountEmptyState title="No orders yet" description="Place your first order to see it here." actionHref="/products" actionLabel="Shop now" />
        </div>
      ) : (
        <div className="mt-5 overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead>
              <tr className="text-left text-slate-500">
                <th className="px-3 py-2 font-medium">Order</th>
                <th className="px-3 py-2 font-medium">Date</th>
                <th className="px-3 py-2 font-medium">Status</th>
                <th className="px-3 py-2 font-medium">Total</th>
                <th className="px-3 py-2 font-medium">Items</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {orders.map((order) => (
                <tr key={order.id}>
                  <td className="px-3 py-3">
                    <Link href={`/account/orders/${order.order_number}`} className="font-medium text-blue-600 hover:text-blue-700">{order.order_number}</Link>
                  </td>
                  <td className="px-3 py-3 text-slate-600">{formatDate(order.created_at)}</td>
                  <td className="px-3 py-3 text-slate-700">{order.status}</td>
                  <td className="px-3 py-3 font-medium text-slate-900">{formatCurrency(Number(order.total))}</td>
                  <td className="px-3 py-3 text-slate-600">{Array.isArray(order.order_items) ? order.order_items.length : 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-5 flex items-center justify-between text-sm">
        <p className="text-slate-600">Page {page} of {totalPages}</p>
        <div className="flex gap-2">
          <Link
            href={`/account/orders?page=${Math.max(1, page - 1)}`}
            aria-disabled={page <= 1}
            className={`inline-flex h-9 items-center rounded-full border px-3 ${page <= 1 ? "pointer-events-none border-slate-200 text-slate-400" : "border-slate-300 text-slate-700 hover:border-blue-600 hover:text-blue-600"}`}
          >
            Previous
          </Link>
          <Link
            href={`/account/orders?page=${Math.min(totalPages, page + 1)}`}
            aria-disabled={page >= totalPages}
            className={`inline-flex h-9 items-center rounded-full border px-3 ${page >= totalPages ? "pointer-events-none border-slate-200 text-slate-400" : "border-slate-300 text-slate-700 hover:border-blue-600 hover:text-blue-600"}`}
          >
            Next
          </Link>
        </div>
      </div>
    </div>
  );
}
