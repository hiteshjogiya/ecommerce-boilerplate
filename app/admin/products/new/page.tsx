'use client';

import { useRouter } from 'next/navigation';
import { AdminLayout } from '@/components/admin/admin-layout';
import { AdminBreadcrumb } from '@/components/admin/admin-sidebar';
import { ProductForm } from '@/features/admin/components/product-form';
import { useEffect, useState } from 'react';
import { useAsyncAction } from '@/features/checkout/hooks/use-async-action';
import type { CategoryRow } from '@/src/services/admin-category.service';

export default function NewProductPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<CategoryRow[]>([]);
  const { execute: createProduct, isLoading } = useAsyncAction<Record<string, unknown>>(
    async (data) => {
      const response = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error('Failed to create product');

      router.push('/admin/products');
    },
  );

  useEffect(() => {
    fetch('/api/categories')
      .then(res => res.json())
      .then(setCategories)
      .catch(console.error);
  }, []);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <AdminBreadcrumb
          items={[
            { label: 'Dashboard', href: '/admin' },
            { label: 'Products', href: '/admin/products' },
            { label: 'New Product' },
          ]}
        />

        <h1 className="text-3xl font-bold">Create Product</h1>

        <ProductForm
          categories={categories}
          onSubmit={createProduct}
          isLoading={isLoading}
        />
      </div>
    </AdminLayout>
  );
}
