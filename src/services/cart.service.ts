import { createClient } from "@/src/lib/supabase/client";
import { getSupabaseEnv } from "@/src/lib/supabase/env";
import type { ProductRow } from "@/src/services/product.service";

export interface CartLineItem {
  productId: string;
  slug: string | null;
  name: string;
  description: string;
  price: number;
  originalPrice: number | null;
  image: string;
  stock: number;
  active: boolean;
  quantity: number;
  updatedAt: string;
}

export interface CartTotals {
  subtotal: number;
  estimatedTax: number;
  shipping: number;
  total: number;
  totalQuantity: number;
}

export const GUEST_CART_STORAGE_KEY = "northstar-guest-cart";

function isMissingSupabaseTableError(error: unknown) {
  return Boolean(
    error &&
      typeof error === "object" &&
      "code" in error &&
      (error as { code?: string }).code === "PGRST205",
  );
}

function nowIsoString() {
  return new Date().toISOString();
}

export function clampCartQuantity(quantity: number, stock: number) {
  const maxQuantity = Math.max(1, stock || 1);
  return Math.min(Math.max(quantity, 1), maxQuantity);
}

function resolveStock(primary: number, secondary: number) {
  if (primary > 0 && secondary > 0) {
    return Math.min(primary, secondary);
  }

  return Math.max(primary, secondary);
}

export function buildCartLineItem(product: Pick<ProductRow, "id" | "title" | "description" | "price" | "compare_price" | "stock" | "thumbnail" | "active"> & { slug?: string | null }, quantity = 1): CartLineItem {
  return {
    productId: product.id,
    slug: product.slug ?? null,
    name: product.title,
    description: product.description,
    price: Number(product.price),
    originalPrice: product.compare_price != null ? Number(product.compare_price) : null,
    image: product.thumbnail ?? "/window.svg",
    stock: Number(product.stock) || 0,
    active: Boolean(product.active),
    quantity: clampCartQuantity(quantity, Number(product.stock) || 1),
    updatedAt: nowIsoString(),
  };
}

export function buildUnavailableCartLineItem(productId: string, quantity = 1): CartLineItem {
  return {
    productId,
    slug: null,
    name: "Unavailable product",
    description: "This product is no longer available.",
    price: 0,
    originalPrice: null,
    image: "/window.svg",
    stock: 0,
    active: false,
    quantity: clampCartQuantity(quantity, 1),
    updatedAt: nowIsoString(),
  };
}

export function upsertCartLineItem(items: CartLineItem[], nextItem: CartLineItem) {
  return [nextItem, ...items.filter((item) => item.productId !== nextItem.productId)];
}

export function mergeCartLineItems(...groups: CartLineItem[][]) {
  const merged = new Map<string, CartLineItem>();

  for (const group of groups) {
    for (const item of group) {
      const current = merged.get(item.productId);

      if (!current) {
        merged.set(item.productId, { ...item, quantity: clampCartQuantity(item.quantity, item.stock || 1) });
        continue;
      }

      const stock = resolveStock(current.stock, item.stock);
      const quantity = clampCartQuantity(current.quantity + item.quantity, stock || 1);

      merged.set(item.productId, {
        ...current,
        ...item,
        stock,
        quantity,
        updatedAt: item.updatedAt,
      });
    }
  }

  return Array.from(merged.values()).sort((left, right) => right.updatedAt.localeCompare(left.updatedAt));
}

export function readGuestCartItems() {
  if (typeof window === "undefined") {
    return [] as CartLineItem[];
  }

  try {
    const rawValue = window.localStorage.getItem(GUEST_CART_STORAGE_KEY);

    if (!rawValue) {
      return [] as CartLineItem[];
    }

    const parsed = JSON.parse(rawValue) as CartLineItem[];

    return Array.isArray(parsed)
      ? parsed
          .map((item) => ({
            ...item,
            quantity: clampCartQuantity(Number(item.quantity) || 1, Number(item.stock) || 1),
            stock: Number(item.stock) || 0,
            price: Number(item.price) || 0,
            originalPrice: item.originalPrice != null ? Number(item.originalPrice) : null,
            active: Boolean(item.active),
          }))
          .slice(0, 50)
      : [];
  } catch {
    return [] as CartLineItem[];
  }
}

export function writeGuestCartItems(items: CartLineItem[]) {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(GUEST_CART_STORAGE_KEY, JSON.stringify(items.slice(0, 50)));
  } catch {
    // Ignore storage failures.
  }
}

export function clearGuestCartItems() {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.removeItem(GUEST_CART_STORAGE_KEY);
  } catch {
    // Ignore storage failures.
  }
}

export function calculateCartTotals(items: CartLineItem[]): CartTotals {
  const subtotal = items.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);
  const estimatedTax = subtotal * 0.08;
  const shipping = subtotal >= 100 ? 0 : 12;

  return {
    subtotal,
    estimatedTax,
    shipping,
    total: subtotal + estimatedTax + shipping,
    totalQuantity: items.reduce((sum, item) => sum + item.quantity, 0),
  };
}

export async function loadRemoteCartItems(userId: string) {
  const { isConfigured, url, key } = getSupabaseEnv();

  if (!isConfigured || !url || !key) {
    return [] as CartLineItem[];
  }

  const supabase = createClient();
  const { data, error } = await supabase
    .from("cart_items")
    .select("id, user_id, product_id, quantity, created_at, updated_at, products(*)")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    if (isMissingSupabaseTableError(error)) {
      return [] as CartLineItem[];
    }

    throw error;
  }

  return (data ?? [])
    .map((row) => {
      const relatedProducts = (row as { products?: unknown }).products;
      const relatedProduct = Array.isArray(relatedProducts)
        ? ((relatedProducts[0] as ProductRow | undefined) ?? null)
        : ((relatedProducts as ProductRow | null | undefined) ?? null);

      if (!relatedProduct) {
        return buildUnavailableCartLineItem(row.product_id, Number(row.quantity) || 1);
      }

      return buildCartLineItem(relatedProduct, Number(row.quantity) || 1);
    })
    .filter(Boolean);
}

export async function syncRemoteCartItems(userId: string, items: CartLineItem[]) {
  const { isConfigured, url, key } = getSupabaseEnv();

  if (!isConfigured || !url || !key) {
    return;
  }

  const supabase = createClient();
  const timestamp = nowIsoString();

  const { error: deleteError } = await supabase.from("cart_items").delete().eq("user_id", userId);

  if (deleteError) {
    if (isMissingSupabaseTableError(deleteError)) {
      return;
    }

    throw deleteError;
  }

  if (!items.length) {
    return;
  }

  const { error: insertError } = await supabase.from("cart_items").insert(
    items.map((item) => ({
      user_id: userId,
      product_id: item.productId,
      quantity: item.quantity,
      created_at: timestamp,
      updated_at: timestamp,
    })),
  );

  if (insertError) {
    if (isMissingSupabaseTableError(insertError)) {
      return;
    }

    throw insertError;
  }
}
