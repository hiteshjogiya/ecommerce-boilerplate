'use client';

import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { AdminLayout } from '@/components/admin/admin-layout';
import { AdminBreadcrumb } from '@/components/admin/admin-sidebar';
import { useAdminOrders } from '@/features/admin/hooks/use-admin-orders';
import Link from 'next/link';
import { useEffect } from 'react';
import { Eye } from 'lucide-react';
import type { OrderStatus } from '@/src/services/admin-order.service';

const ORDER_STATUSES: OrderStatus[] = [
  'pending',
  'confirmed',
  'processing',
  'shipped',
  'delivered',
  'cancelled',
];

const STATUS_COLORS: Record<OrderStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  processing: 'bg-purple-100 text-purple-800',
  shipped: 'bg-indigo-100 text-indigo-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

export default function OrdersPage() {
  const {
    orders,
    loading,
    page,
    setPage,
    totalItems,
    pageSize,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    fetchOrders,
  } = useAdminOrders();

  useEffect(() => {
    fetchOrders();
  }, [page, searchQuery, statusFilter, fetchOrders]);

  const columns = [
    {
      key: 'order_number' as const,
      label: 'Order #',
      sortable: true,
    },
    {
      key: 'total' as const,
      label: 'Total',
      render: (value: unknown) => `$${(value as number).toFixed(2)}`,
    },
    {
      key: 'status' as const,
      label: 'Status',
      render: (value: unknown) => {
        const status = value as OrderStatus;
        return (
          <span
            className={`px-2 py-1 rounded text-sm font-semibold ${STATUS_COLORS[status]}`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
        );
      },
    },
    {
      key: 'created_at' as const,
      label: 'Date',
      render: (value: unknown) => new Date(value as string).toLocaleDateString(),
    },
    {
      key: 'id' as const,
      label: 'Actions',
      render: (value: unknown, item: Record<string, unknown>) => (
        <Link href={`/admin/orders/${String(item.order_number)}`}>
          <Button size="sm" variant="ghost">
            <Eye className="h-4 w-4" />
          </Button>
        </Link>
      ),
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <AdminBreadcrumb
          items={[
            { label: 'Dashboard', href: '/admin' },
            { label: 'Orders' },
          ]}
        />

        <h1 className="text-3xl font-bold">Orders</h1>

        {/* Status Filter */}
        <div className="flex gap-2 flex-wrap">
          <Button
            variant={statusFilter === undefined ? 'primary' : 'ghost'}
            onClick={() => setStatusFilter(undefined)}
          >
            All
          </Button>
          {ORDER_STATUSES.map((status) => (
            <Button
              key={status}
              variant={statusFilter === status ? 'primary' : 'ghost'}
              onClick={() => setStatusFilter(status)}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Button>
          ))}
        </div>

        <DataTable
          columns={columns}
          data={orders}
          loading={loading}
          totalItems={totalItems}
          currentPage={page}
          pageSize={pageSize}
          onPageChange={setPage}
          onSearch={setSearchQuery}
          searchPlaceholder="Search by order number..."
        />
      </div>
    </AdminLayout>
  );
}
