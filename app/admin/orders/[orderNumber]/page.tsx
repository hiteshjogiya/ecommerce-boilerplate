'use client';

import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/admin-layout';
import { AdminBreadcrumb } from '@/components/admin/admin-sidebar';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
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

interface OrderItem {
  id: string;
  quantity: number;
  unit_price?: number;
  total_price?: number;
  products?: { title: string } | null;
}

interface OrderDetail {
  order_number: string;
  status: OrderStatus;
  total: number;
  created_at: string;
  order_items?: OrderItem[];
  user_id?: string;
  user_profiles?: {
    full_name?: string;
    phone?: string;
  };
  shipping_address?: {
    street?: string;
    city?: string;
    state?: string;
    postal_code?: string;
    country?: string;
  };
}

export default function OrderDetailsPage({ params }: { params: Promise<{ orderNumber: string }> }) {
  const [number, setNumber] = useState<string>();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    (async () => {
      const { orderNumber: num } = await params;
      setNumber(num);
      setLoading(true);
      try {
        const response = await fetch(`/api/admin/orders/${num}`);
        const data = await response.json() as OrderDetail;
        setOrder(data);
      } finally {
        setLoading(false);
      }
    })();
  }, [params]);

  const handleStatusChange = async (newStatus: OrderStatus) => {
    if (!number || !order || order.status === newStatus) return;

    setUpdatingStatus(true);
    try {
      const response = await fetch(`/api/admin/orders/${number}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) throw new Error('Failed to update order');

      const updated = await response.json();
      setOrder(updated);
    } catch {
      alert('Failed to update order status');
    } finally {
      setUpdatingStatus(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
        </div>
      </AdminLayout>
    );
  }

  if (!order) {
    return (
      <AdminLayout>
        <div className="text-center">
          <p className="text-gray-500">Order not found</p>
          <Link href="/admin/orders">
            <Button className="mt-4">Back to Orders</Button>
          </Link>
        </div>
      </AdminLayout>
    );
  }

  const orderItems = order.order_items ?? [];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <AdminBreadcrumb
          items={[
            { label: 'Dashboard', href: '/admin' },
            { label: 'Orders', href: '/admin/orders' },
            { label: `Order #${order.order_number}` },
          ]}
        />

        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Order #{order.order_number}</h1>
          <Link href="/admin/orders">
            <Button variant="ghost">Back to Orders</Button>
          </Link>
        </div>

        {/* Order Info */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded border">
            <p className="text-sm text-gray-600">Status</p>
            <p
              className={`text-lg font-bold mt-1 inline-block px-2 py-1 rounded ${
                STATUS_COLORS[order.status]
              }`}
            >
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </p>
          </div>
          <div className="bg-white p-4 rounded border">
            <p className="text-sm text-gray-600">Total</p>
            <p className="text-lg font-bold mt-1">${order.total.toFixed(2)}</p>
          </div>
          <div className="bg-white p-4 rounded border">
            <p className="text-sm text-gray-600">Items</p>
            <p className="text-lg font-bold mt-1">{orderItems.length}</p>
          </div>
          <div className="bg-white p-4 rounded border">
            <p className="text-sm text-gray-600">Date</p>
            <p className="text-lg font-bold mt-1">
              {new Date(order.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Status Update */}
        <div className="bg-white p-6 rounded border">
          <h2 className="text-lg font-bold mb-4">Update Status</h2>
          <div className="flex gap-2 flex-wrap">
            {ORDER_STATUSES.map((status) => (
              <Button
                key={status}
                variant={order.status === status ? 'primary' : 'ghost'}
                onClick={() => handleStatusChange(status)}
                disabled={updatingStatus}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </Button>
            ))}
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-white p-6 rounded border">
          <h2 className="text-lg font-bold mb-4">Items</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b">
                <tr>
                  <th className="text-left py-2">Product</th>
                  <th className="text-left py-2">Qty</th>
                  <th className="text-left py-2">Price</th>
                  <th className="text-left py-2">Total</th>
                </tr>
              </thead>
              <tbody>
                {orderItems.map((item) => (
                  <tr key={item.id} className="border-b hover:bg-gray-50">
                    <td className="py-3">{item.products?.title || 'Deleted Product'}</td>
                    <td>{item.quantity}</td>
                    <td>${(item.unit_price ?? 0).toFixed(2)}</td>
                    <td>${(item.total_price ?? (item.quantity * (item.unit_price ?? 0))).toFixed(2)}</td>
                  </tr>
                ))}
                {orderItems.length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-6 text-center text-sm text-gray-500">
                      No items found for this order.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Customer Info */}
        {order.user_profiles && (
          <div className="bg-white p-6 rounded border">
            <h2 className="text-lg font-bold mb-4">Customer Info</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Name</p>
                <p className="font-semibold">{order.user_profiles.full_name || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Phone</p>
                <p className="font-semibold">{order.user_profiles.phone || '-'}</p>
              </div>
            </div>
          </div>
        )}

        {/* Shipping Address */}
        {order.shipping_address && (
          <div className="bg-white p-6 rounded border">
            <h2 className="text-lg font-bold mb-4">Shipping Address</h2>
            <p className="text-sm">{order.shipping_address.street}</p>
            <p className="text-sm">
              {order.shipping_address.city}, {order.shipping_address.state}{' '}
              {order.shipping_address.postal_code}
            </p>
            <p className="text-sm">{order.shipping_address.country}</p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
