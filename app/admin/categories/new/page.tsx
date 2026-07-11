'use client';

import { useRouter } from 'next/navigation';
import { AdminLayout } from '@/components/admin/admin-layout';
import { AdminBreadcrumb } from '@/components/admin/admin-sidebar';
import { CategoryForm } from '@/features/admin/components/category-form';
import { useAsyncAction } from '@/features/checkout/hooks/use-async-action';

export default function NewCategoryPage() {
  const router = useRouter();
  const { execute: createCategory, isLoading } = useAsyncAction(
    async (data) => {
      const response = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create category');
      }

      router.push('/admin/categories');
    },
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        <AdminBreadcrumb
          items={[
            { label: 'Dashboard', href: '/admin' },
            { label: 'Categories', href: '/admin/categories' },
            { label: 'New Category' },
          ]}
        />

        <h1 className="text-3xl font-bold">Create Category</h1>

        <CategoryForm
          onSubmit={createCategory}
          isLoading={isLoading}
        />
      </div>
    </AdminLayout>
  );
}
