'use client';

import { useCallback, useState } from 'react';
import type { CategoryRow } from '@/src/services/admin-category.service';

export function useAdminCategories() {
  const [categories, setCategories] = useState<CategoryRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  const PAGE_SIZE = 20;

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/admin/categories?page=${page}&search=${encodeURIComponent(searchQuery)}`,
      );

      if (!response.ok) throw new Error('Failed to fetch categories');

      const data = await response.json();
      setCategories(data.categories);
      setTotalItems(data.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading categories');
    } finally {
      setLoading(false);
    }
  }, [page, searchQuery]);

  const createCategory = useCallback(
    async (input: Record<string, unknown>) => {
      try {
        const response = await fetch('/api/admin/categories', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(input),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || 'Failed to create category');
        }

        const newCategory = await response.json();
        setCategories([newCategory, ...categories]);
        setTotalItems(totalItems + 1);
        return newCategory;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Error creating category';
        setError(message);
        throw err;
      }
    },
    [categories, totalItems],
  );

  const updateCategory = useCallback(
    async (id: string, input: Record<string, unknown>) => {
      try {
        const response = await fetch(`/api/admin/categories/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(input),
        });

        if (!response.ok) throw new Error('Failed to update category');

        const updated = await response.json();
        setCategories(categories.map((c) => (c.id === id ? updated : c)));
        return updated;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Error updating category';
        setError(message);
        throw err;
      }
    },
    [categories],
  );

  const deleteCategory = useCallback(
    async (id: string) => {
      try {
        const response = await fetch(`/api/admin/categories/${id}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || 'Failed to delete category');
        }

        setCategories(categories.filter((c) => c.id !== id));
        setTotalItems(totalItems - 1);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Error deleting category';
        setError(message);
        throw err;
      }
    },
    [categories, totalItems],
  );

  return {
    categories,
    loading,
    error,
    page,
    setPage,
    totalItems,
    pageSize: PAGE_SIZE,
    searchQuery,
    setSearchQuery,
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
  };
}
