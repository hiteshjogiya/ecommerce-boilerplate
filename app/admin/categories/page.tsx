'use client';

import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { AdminLayout } from '@/components/admin/admin-layout';
import { AdminBreadcrumb } from '@/components/admin/admin-sidebar';
import { useAdminCategories } from '@/features/admin/hooks/use-admin-categories';
import Link from 'next/link';
import { useEffect } from 'react';
import { Edit, Trash2 } from 'lucide-react';

export default function CategoriesPage() {
  const {
    categories,
    loading,
    error,
    page,
    setPage,
    totalItems,
    pageSize,
    searchQuery,
    setSearchQuery,
    fetchCategories,
    deleteCategory,
  } = useAdminCategories();

  useEffect(() => {
    fetchCategories();
  }, [page, searchQuery, fetchCategories]);

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this category?')) {
      try {
        await deleteCategory(id);
        await fetchCategories();
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to delete category';
        alert(message);
      }
    }
  };

  const columns = [
    {
      key: 'name' as const,
      label: 'Name',
      sortable: true,
    },
    {
      key: 'slug' as const,
      label: 'Slug',
    },
    {
      key: 'id' as const,
      label: 'Actions',
      render: (value: unknown) => {
        const id = String(value);
        return (
          <div className="flex gap-2">
            <Link href={`/admin/categories/${id}/edit`}>
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
            { label: 'Categories' },
          ]}
        />

        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Categories</h1>
          <Link href="/admin/categories/new">
            <Button>Create Category</Button>
          </Link>
        </div>

        {error && (
          <div className="p-4 bg-red-50 text-red-700 rounded">
            {error}
          </div>
        )}

        <DataTable
          columns={columns}
          data={categories}
          loading={loading}
          totalItems={totalItems}
          currentPage={page}
          pageSize={pageSize}
          onPageChange={setPage}
          onSearch={setSearchQuery}
          searchPlaceholder="Search categories..."
        />
      </div>
    </AdminLayout>
  );
}
