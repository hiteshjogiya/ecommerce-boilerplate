'use client';

import { useCallback, useState } from 'react';
import type { ProductRow } from '@/src/services/admin-product.service';

export function useAdminProducts() {
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryId, setCategoryId] = useState<string>();
  const [sortKey, setSortKey] = useState<'title' | 'price' | 'stock' | 'created_at'>('created_at');
  const [sortAscending, setSortAscending] = useState(false);

  const PAGE_SIZE = 20;

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/admin/products?page=${page}&search=${encodeURIComponent(searchQuery)}${
          categoryId ? `&category_id=${categoryId}` : ''
        }&sort=${sortKey}&ascending=${sortAscending}`,
      );

      if (!response.ok) throw new Error('Failed to fetch products');

      const data = await response.json();
      setProducts(data.products);
      setTotalItems(data.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading products');
    } finally {
      setLoading(false);
    }
  }, [page, searchQuery, categoryId, sortKey, sortAscending]);

  const createProduct = useCallback(
    async (input: Record<string, unknown>) => {
      try {
        const response = await fetch('/api/admin/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(input),
        });

        if (!response.ok) throw new Error('Failed to create product');

        const newProduct = await response.json();
        setProducts([newProduct, ...products]);
        setTotalItems(totalItems + 1);
        return newProduct;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Error creating product';
        setError(message);
        throw err;
      }
    },
    [products, totalItems],
  );

  const updateProduct = useCallback(
    async (id: string, input: Record<string, unknown>) => {
      try {
        const response = await fetch(`/api/admin/products/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(input),
        });

        if (!response.ok) throw new Error('Failed to update product');

        const updated = await response.json();
        setProducts(products.map((p) => (p.id === id ? updated : p)));
        return updated;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Error updating product';
        setError(message);
        throw err;
      }
    },
    [products],
  );

  const deleteProduct = useCallback(
    async (id: string) => {
      try {
        const response = await fetch(`/api/admin/products/${id}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || 'Failed to delete product');
        }

        setProducts(products.filter((p) => p.id !== id));
        setTotalItems(totalItems - 1);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Error deleting product';
        setError(message);
        throw err;
      }
    },
    [products, totalItems],
  );

  const toggleActive = useCallback(
    async (id: string, active: boolean) => {
      try {
        const response = await fetch(`/api/admin/products/${id}/toggle`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ active }),
        });

        if (!response.ok) throw new Error('Failed to toggle product');

        const updated = await response.json();
        setProducts(products.map((p) => (p.id === id ? updated : p)));
        return updated;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Error toggling product';
        setError(message);
        throw err;
      }
    },
    [products],
  );

  return {
    products,
    loading,
    error,
    page,
    setPage,
    totalItems,
    pageSize: PAGE_SIZE,
    searchQuery,
    setSearchQuery,
    categoryId,
    setCategoryId,
    sortKey,
    setSortKey,
    sortAscending,
    setSortAscending,
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    toggleActive,
  };
}
