'use client';

import { useState, useCallback } from 'react';

const STORAGE_KEY = 'recently-searched';
const MAX_SEARCHES = 10;

export function useRecentlySearched() {
  const [searches, setSearches] = useState<string[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? (JSON.parse(stored) as string[]) : [];
    } catch {
      return [];
    }
  });

  const addSearch = useCallback((query: string) => {
    if (!query.trim()) return;
    setSearches((prev) => {
      const filtered = prev.filter((s) => s.toLowerCase() !== query.toLowerCase());
      const updated = [query.trim(), ...filtered].slice(0, MAX_SEARCHES);
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(updated)); } catch { /* ignore */ }
      return updated;
    });
  }, []);

  const removeSearch = useCallback((query: string) => {
    setSearches((prev) => {
      const updated = prev.filter((s) => s !== query);
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(updated)); } catch { /* ignore */ }
      return updated;
    });
  }, []);

  const clearAll = useCallback(() => {
    setSearches([]);
    try { localStorage.removeItem(STORAGE_KEY); } catch { /* ignore */ }
  }, []);

  return { searches, addSearch, removeSearch, clearAll };
}
