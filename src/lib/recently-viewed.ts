import type { ProductDetailRecord } from "@/src/lib/product-detail";

const STORAGE_KEY = "recently-viewed-products";
const MAX_ITEMS = 10;

export interface RecentlyViewedProduct {
  id: string;
  slug: string;
  title: string;
  thumbnail: string | null;
  price: number;
  compare_price: number | null;
}

export function toRecentlyViewedProduct(product: ProductDetailRecord): RecentlyViewedProduct {
  return {
    id: product.id,
    slug: product.slug,
    title: product.title,
    thumbnail: product.thumbnail,
    price: Number(product.price),
    compare_price: product.compare_price,
  };
}

export function upsertRecentlyViewed(products: RecentlyViewedProduct[], product: RecentlyViewedProduct) {
  const filtered = products.filter((item) => item.slug !== product.slug);
  return [product, ...filtered].slice(0, MAX_ITEMS);
}

export function readRecentlyViewedFromStorage() {
  if (typeof window === "undefined") {
    return [] as RecentlyViewedProduct[];
  }

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return [] as RecentlyViewedProduct[];
    }

    const parsed = JSON.parse(stored) as RecentlyViewedProduct[];
    return Array.isArray(parsed) ? parsed.slice(0, MAX_ITEMS) : [];
  } catch {
    return [] as RecentlyViewedProduct[];
  }
}

export function writeRecentlyViewedToStorage(products: RecentlyViewedProduct[]) {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(products.slice(0, MAX_ITEMS)));
  } catch {
    // Ignore storage failures.
  }
}
