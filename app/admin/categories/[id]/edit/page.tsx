'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AdminLayout } from '@/components/admin/admin-layout';
import { AdminBreadcrumb } from '@/components/admin/admin-sidebar';
import { CategoryForm } from '@/features/admin/components/category-form';
import { useAsyncAction } from '@/features/checkout/hooks/use-async-action';
import type { CategoryRow } from '@/src/services/admin-category.service';

export default function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const [categoryId, setCategoryId] = useState<string>();
  const [category, setCategory] = useState<CategoryRow | null>(null);
  const router = useRouter();
  const { execute: updateCategory, isLoading } = useAsyncAction(
    async (data: Record<string, unknown>) => {
      const response = await fetch(`/api/admin/categories/${categoryId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error('Failed to update category');

      router.push('/admin/categories');
    },
  );

  useEffect(() => {
    (async () => {
      const { id } = await params;
      setCategoryId(id);
      const response = await fetch(`/api/admin/categories/${id}`);
      const data = await response.json() as CategoryRow;
      setCategory(data);
    })();
  }, [params]);

  if (!category) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <AdminBreadcrumb
          items={[
            { label: 'Dashboard', href: '/admin' },
            { label: 'Categories', href: '/admin/categories' },
            { label: 'Edit Category' },
          ]}
        />

        <h1 className="text-3xl font-bold">Edit Category</h1>

        <CategoryForm
          category={category}
          onSubmit={updateCategory}
          isLoading={isLoading}
        />
      </div>
    </AdminLayout>
  );
}
