'use client';

import { useState, useCallback } from 'react';
import type { ReviewRow } from '@/src/services/review.service';

interface RatingSummary {
  average: number;
  count: number;
  distribution: Record<number, number>;
}

interface ReviewsState {
  reviews: ReviewRow[];
  total: number;
  summary: RatingSummary;
  userReview: ReviewRow | null;
  canReview: boolean;
  loading: boolean;
  error: string | null;
  page: number;
  sort: 'newest' | 'highest' | 'lowest';
}

export function useReviews(productId: string) {
  const [state, setState] = useState<ReviewsState>({
    reviews: [],
    total: 0,
    summary: { average: 0, count: 0, distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } },
    userReview: null,
    canReview: false,
    loading: true,
    error: null,
    page: 1,
    sort: 'newest',
  });

  const fetchReviews = useCallback(async (page = 1, sort: 'newest' | 'highest' | 'lowest' = 'newest') => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const res = await fetch(`/api/reviews/${productId}?page=${page}&sort=${sort}`);
      const data = await res.json();
      setState((prev) => ({
        ...prev,
        reviews: data.reviews ?? [],
        total: data.total ?? 0,
        summary: data.summary ?? prev.summary,
        userReview: data.userReview ?? null,
        canReview: data.canReview ?? false,
        loading: false,
        page,
        sort,
      }));
    } catch {
      setState((prev) => ({ ...prev, loading: false, error: 'Failed to load reviews' }));
    }
  }, [productId]);

  const submitReview = async (input: { rating: number; title?: string; body?: string }) => {
    const res = await fetch(`/api/reviews/${productId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || 'Failed to submit review');
    }
    await fetchReviews(state.page, state.sort);
  };

  const editReview = async (id: string, input: { rating?: number; title?: string; body?: string }) => {
    const res = await fetch(`/api/reviews/edit/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    });
    if (!res.ok) throw new Error('Failed to update review');
    await fetchReviews(state.page, state.sort);
  };

  const removeReview = async (id: string) => {
    const res = await fetch(`/api/reviews/edit/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete review');
    await fetchReviews(state.page, state.sort);
  };

  const changePage = (page: number) => fetchReviews(page, state.sort);
  const changeSort = (sort: 'newest' | 'highest' | 'lowest') => fetchReviews(1, sort);

  return { ...state, fetchReviews, submitReview, editReview, removeReview, changePage, changeSort };
}
