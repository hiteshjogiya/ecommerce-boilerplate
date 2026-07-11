'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AdminLayout } from '@/components/admin/admin-layout';
import { AdminBreadcrumb } from '@/components/admin/admin-sidebar';
import { ProductForm } from '@/features/admin/components/product-form';
import { useAsyncAction } from '@/features/checkout/hooks/use-async-action';
import type { ProductRow } from '@/src/services/admin-product.service';
import type { CategoryRow } from '@/src/services/admin-category.service';

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const [productId, setProductId] = useState<string>();
  const [product, setProduct] = useState<ProductRow | null>(null);
  const [categories, setCategories] = useState<CategoryRow[]>([]);
  const router = useRouter();
  const { execute: updateProduct, isLoading } = useAsyncAction<Record<string, unknown>>(
    async (data) => {
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error('Failed to update product');

      router.push('/admin/products');
    },
  );

  useEffect(() => {
    (async () => {
      const { id } = await params;
      setProductId(id);
      const [p, cats] = await Promise.all([
        fetch(`/api/admin/products/${id}`).then((r) => r.json()),
        fetch('/api/categories').then((r) => r.json()),
      ]);
      setProduct(p);
      setCategories(cats);
    })();
  }, [params]);

  if (!product) {
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
            { label: 'Products', href: '/admin/products' },
            { label: 'Edit Product' },
          ]}
        />

        <h1 className="text-3xl font-bold">Edit Product</h1>

        <ProductForm
          product={product}
          categories={categories}
          onSubmit={updateProduct}
          isLoading={isLoading}
        />
      </div>
    </AdminLayout>
  );
}
