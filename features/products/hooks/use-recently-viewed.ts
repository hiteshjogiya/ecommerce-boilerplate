"use client";

import { useEffect, useSyncExternalStore } from "react";
import { toRecentlyViewedProduct, upsertRecentlyViewed, writeRecentlyViewedToStorage, type RecentlyViewedProduct } from "@/src/lib/recently-viewed";
import type { ProductDetailRecord } from "@/src/lib/product-detail";

const listeners = new Set<() => void>();
const EMPTY_RECENTLY_VIEWED: RecentlyViewedProduct[] = [];
let cachedStorageValue: string | null = null;
let cachedSnapshot: RecentlyViewedProduct[] = EMPTY_RECENTLY_VIEWED;

function subscribe(callback: () => void) {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

function emitChange() {
  listeners.forEach((callback) => callback());
}

function getSnapshot() {
  if (typeof window === "undefined") {
    return EMPTY_RECENTLY_VIEWED;
  }

  const stored = window.localStorage.getItem("recently-viewed-products");

  if (stored === cachedStorageValue) {
    return cachedSnapshot;
  }

  cachedStorageValue = stored;

  if (!stored) {
    cachedSnapshot = EMPTY_RECENTLY_VIEWED;
    return cachedSnapshot;
  }

  try {
    const parsed = JSON.parse(stored) as RecentlyViewedProduct[];
    cachedSnapshot = Array.isArray(parsed) ? parsed.slice(0, 10) : EMPTY_RECENTLY_VIEWED;
  } catch {
    cachedSnapshot = EMPTY_RECENTLY_VIEWED;
  }

  return cachedSnapshot;
}

function getServerSnapshot() {
  return EMPTY_RECENTLY_VIEWED;
}

export function useRecentlyViewed(currentProduct?: ProductDetailRecord) {
  const items = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  useEffect(() => {
    if (!currentProduct) {
      return;
    }

    const nextItems = upsertRecentlyViewed(items, toRecentlyViewedProduct(currentProduct));
    writeRecentlyViewedToStorage(nextItems);
    emitChange();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentProduct?.slug]);

  return items;
}
