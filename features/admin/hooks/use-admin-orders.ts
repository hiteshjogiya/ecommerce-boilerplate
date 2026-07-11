'use client';

import { useCallback, useState } from 'react';
import type { OrderRow, OrderStatus } from '@/src/services/admin-order.service';

export function useAdminOrders() {
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | undefined>();

  const PAGE_SIZE = 20;

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/admin/orders?page=${page}&search=${encodeURIComponent(searchQuery)}${
          statusFilter ? `&status=${statusFilter}` : ''
        }`,
      );

      if (!response.ok) throw new Error('Failed to fetch orders');

      const data = await response.json();
      setOrders(data.orders);
      setTotalItems(data.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading orders');
    } finally {
      setLoading(false);
    }
  }, [page, searchQuery, statusFilter]);

  const updateOrderStatus = useCallback(
    async (orderNumber: string, status: OrderStatus) => {
      try {
        const response = await fetch(`/api/admin/orders/${orderNumber}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status }),
        });

        if (!response.ok) throw new Error('Failed to update order status');

        const updated = await response.json();
        setOrders(orders.map((o) => (o.order_number === orderNumber ? updated : o)));
        return updated;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Error updating order';
        setError(message);
        throw err;
      }
    },
    [orders],
  );

  return {
    orders,
    loading,
    error,
    page,
    setPage,
    totalItems,
    pageSize: PAGE_SIZE,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    fetchOrders,
    updateOrderStatus,
  };
}
