import { redirect } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { AppError } from "@/src/lib/errors";
import { createClient } from "@/src/lib/supabase/client";
import type { ProductRow } from "@/src/services/product.service";
import { buildCartLineItem, upsertCartLineItem, writeGuestCartItems } from "@/src/services/cart.service";
import { useCartStore, type WishlistItem } from "@/store/cart-store";
import type { ProductDetailRecord } from "@/src/lib/product-detail";

export type WishlistToggleProduct = Pick<
  ProductRow,
  "id" | "slug" | "title" | "description" | "price" | "compare_price" | "thumbnail" | "stock" | "active"
>;

export interface WishlistProductRecord extends ProductDetailRecord {
  wishlist_item_id: string;
  wishlisted_at: string;
}

function isMissingSupabaseTableError(error: unknown) {
  return Boolean(
    error &&
      typeof error === "object" &&
      "code" in error &&
      (error as { code?: string }).code === "PGRST205",
  );
}

export function normalizeWishlistProduct(row: {
  id: string;
  created_at: string;
  products?: ProductDetailRecord | ProductDetailRecord[] | null;
}) {
  const relatedProducts = row.products;
  const product = Array.isArray(relatedProducts) ? relatedProducts[0] ?? null : relatedProducts ?? null;

  if (!product) {
    return null;
  }

  return {
    ...product,
    wishlist_item_id: row.id,
    wishlisted_at: row.created_at,
  } satisfies WishlistProductRecord;
}

async function getCurrentAuthenticatedUser() {
  const supabase = createClient();
  const { data } = await supabase.auth.getUser();
  return data.user;
}

function requireAuthUser(user: User | null) {
  if (!user) {
    throw new AppError("Please sign in to manage your wishlist.", 401);
  }

  return user;
}

export async function getWishlist(userId?: string) {
  const currentUser = userId ? ({ id: userId } as User) : requireAuthUser(await getCurrentAuthenticatedUser());
  const supabase = createClient();

  const { data, error } = await supabase
    .from("wishlist_items")
    .select("id, product_id, created_at, products(*, categories(*))")
    .eq("user_id", currentUser.id)
    .order("created_at", { ascending: false });

  if (error) {
    if (isMissingSupabaseTableError(error)) {
      return [] as WishlistProductRecord[];
    }

    throw error;
  }

  return (data ?? []).map(normalizeWishlistProduct).filter((item): item is WishlistProductRecord => Boolean(item));
}

export async function getWishlistCount(userId?: string) {
  const items = await getWishlist(userId);
  return items.length;
}

async function ensureProductExists(productId: string) {
  const supabase = createClient();
  const { data, error } = await supabase.from("products").select("*").eq("id", productId).maybeSingle();

  if (error) {
    if (isMissingSupabaseTableError(error)) {
      throw new AppError("Catalog is still being provisioned. Please try again shortly.", 503);
    }

    throw error;
  }

  if (!data) {
    throw new AppError("That product is no longer available.", 404);
  }

  if (!data.active) {
    throw new AppError("That product is currently unavailable.", 409);
  }

  return data;
}

export async function addToWishlist(productId: string) {
  const user = requireAuthUser(await getCurrentAuthenticatedUser());
  const product = await ensureProductExists(productId);
  const supabase = createClient();

  const { data: existing } = await supabase.from("wishlist_items").select("id").eq("user_id", user.id).eq("product_id", productId).maybeSingle();

  if (existing) {
    return product;
  }

  const { error } = await supabase.from("wishlist_items").insert({ user_id: user.id, product_id: productId });

  if (error) {
    if (isMissingSupabaseTableError(error)) {
      throw new AppError("Wishlist is still being provisioned. Please try again shortly.", 503);
    }

    throw error;
  }

  return product;
}

export async function removeFromWishlist(productId: string) {
  const user = requireAuthUser(await getCurrentAuthenticatedUser());
  const supabase = createClient();
  const { error } = await supabase.from("wishlist_items").delete().eq("user_id", user.id).eq("product_id", productId);

  if (error) {
    if (isMissingSupabaseTableError(error)) {
      return;
    }

    throw error;
  }
}

export async function toggleWishlist(productId: string) {
  const user = requireAuthUser(await getCurrentAuthenticatedUser());
  const supabase = createClient();
  const { data: existing } = await supabase.from("wishlist_items").select("id").eq("user_id", user.id).eq("product_id", productId).maybeSingle();

  if (existing) {
    await removeFromWishlist(productId);
    return { wished: false as const };
  }

  await addToWishlist(productId);
  return { wished: true as const };
}

export async function moveWishlistItemToCart(product: WishlistToggleProduct, quantity = 1) {
  const currentState = useCartStore.getState();
  const nextItem = buildCartLineItem(product, quantity);
  const nextItems = upsertCartLineItem(currentState.items, nextItem);
  currentState.setItems(nextItems);

  if (!currentState.userId) {
    writeGuestCartItems(nextItems);
  }

  await removeFromWishlist(product.id);
}

export function redirectToLogin(returnTo?: string) {
  const target = returnTo ? `/login?returnTo=${encodeURIComponent(returnTo)}` : "/login";
  redirect(target);
}

export function toWishlistItemIds(items: WishlistItem[]) {
  return items.map((item) => item.id);
}
