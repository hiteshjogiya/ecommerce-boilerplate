import { createServerSupabaseClient } from "@/src/lib/supabase/server";
import type { Database } from "@/src/types/database";

export type ProductRow = Database["public"]["Tables"]["products"]["Row"];

export async function getRecommendations(productId: string, categoryId: string, limit = 6): Promise<ProductRow[]> {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("active", true)
    .eq("category_id", categoryId)
    .neq("id", productId)
    .order("featured", { ascending: false })
    .limit(limit);

  if (error) return [];
  return data as ProductRow[];
}

export async function getFrequentlyBoughtTogether(productId: string, limit = 4): Promise<ProductRow[]> {
  const supabase = await createServerSupabaseClient();

  // Find products that appear in the same orders as this product
  const { data: orderItems } = await supabase
    .from("order_items")
    .select("order_id")
    .eq("product_id", productId)
    .limit(50);

  if (!orderItems || orderItems.length === 0) return [];

  const orderIds = orderItems.map((oi) => oi.order_id);

  const { data: coItems } = await supabase
    .from("order_items")
    .select("product_id")
    .in("order_id", orderIds)
    .neq("product_id", productId);

  if (!coItems || coItems.length === 0) return [];

  // Count frequency
  const freq: Record<string, number> = {};
  for (const item of coItems) {
    freq[item.product_id] = (freq[item.product_id] ?? 0) + 1;
  }

  const topIds = Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([id]) => id);

  if (topIds.length === 0) return [];

  const { data: products } = await supabase
    .from("products")
    .select("*")
    .in("id", topIds)
    .eq("active", true);

  return (products ?? []) as ProductRow[];
}

export async function getFeaturedRecommendations(limit = 6): Promise<ProductRow[]> {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("active", true)
    .eq("featured", true)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) return [];
  return data as ProductRow[];
}
