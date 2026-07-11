'use client';

import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { AdminLayout } from '@/components/admin/admin-layout';
import { AdminBreadcrumb } from '@/components/admin/admin-sidebar';
import { useAdminProducts } from '@/features/admin/hooks/use-admin-products';
import Link from 'next/link';
import { useEffect } from 'react';
import { Edit, Trash2 } from 'lucide-react';

export default function ProductsPage() {
  const {
    products,
    loading,
    page,
    setPage,
    totalItems,
    pageSize,
    searchQuery,
    setSearchQuery,
    fetchProducts,
    deleteProduct,
    toggleActive,
  } = useAdminProducts();

  useEffect(() => {
    fetchProducts();
  }, [page, searchQuery, fetchProducts]);

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(id);
        await fetchProducts();
      } catch (err) {
        alert(err instanceof Error ? err.message : 'Failed to delete product');
      }
    }
  };

  const columns = [
    {
      key: 'title' as const,
      label: 'Title',
      sortable: true,
    },
    {
      key: 'price' as const,
      label: 'Price',
      render: (value: unknown) => `$${(value as number).toFixed(2)}`,
    },
    {
      key: 'stock' as const,
      label: 'Stock',
    },
    {
      key: 'active' as const,
      label: 'Active',
      render: (value: unknown, item: Record<string, unknown>) => (
        <button
          onClick={() => toggleActive(String(item.id), !value)}
          className={`px-2 py-1 rounded text-sm font-semibold ${
            value
              ? 'bg-green-100 text-green-800'
              : 'bg-gray-100 text-gray-800'
          }`}
        >
          {value ? 'Active' : 'Inactive'}
        </button>
      ),
    },
    {
      key: 'id' as const,
      label: 'Actions',
      render: (value: unknown) => {
        const id = String(value);
        return (
          <div className="flex gap-2">
            <Link href={`/admin/products/${id}/edit`}>
              <Button size="sm" variant="ghost">
                <Edit className="h-4 w-4" />
              </Button>
            </Link>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => handleDelete(id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <AdminBreadcrumb
          items={[
            { label: 'Dashboard', href: '/admin' },
            { label: 'Products' },
          ]}
        />

        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Products</h1>
          <Link href="/admin/products/new">
            <Button>Create Product</Button>
          </Link>
        </div>

        <DataTable
          columns={columns}
          data={products}
          loading={loading}
          totalItems={totalItems}
          currentPage={page}
          pageSize={pageSize}
          onPageChange={setPage}
          onSearch={setSearchQuery}
          searchPlaceholder="Search products..."
        />
      </div>
    </AdminLayout>
  );
}
