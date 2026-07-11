'use client';

import { useState, useCallback } from 'react';
import type { Database } from '@/src/types/database';

type ProductRow = Database["public"]["Tables"]["products"]["Row"];

export function useRecommendations(productId: string, categoryId: string) {
  const [similar, setSimilar] = useState<ProductRow[]>([]);
  const [boughtTogether, setBoughtTogether] = useState<ProductRow[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRecommendations = useCallback(async () => {
    if (!productId || !categoryId) return;
    setLoading(true);
    try {
      const [simRes, btRes] = await Promise.all([
        fetch(`/api/recommendations/${productId}?categoryId=${categoryId}&type=similar`),
        fetch(`/api/recommendations/${productId}?type=bought-together`),
      ]);
      const [simData, btData] = await Promise.all([simRes.json(), btRes.json()]);
      setSimilar(Array.isArray(simData) ? simData : []);
      setBoughtTogether(Array.isArray(btData) ? btData : []);
    } catch {
      setSimilar([]);
      setBoughtTogether([]);
    } finally {
      setLoading(false);
    }
  }, [productId, categoryId]);

  return { similar, boughtTogether, loading, fetchRecommendations };
}
