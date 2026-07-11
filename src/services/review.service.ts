import { createServerSupabaseClient } from "@/src/lib/supabase/server";
import type { Database } from "@/src/types/database";

export type ReviewRow = Database["public"]["Tables"]["reviews"]["Row"];

export interface ReviewWithProfile extends ReviewRow {
  user_profiles?: { full_name: string | null } | null;
}

export async function getProductReviews(productId: string, page = 1, pageSize = 10, sort: 'newest' | 'highest' | 'lowest' = 'newest') {
  const supabase = await createServerSupabaseClient();

  const orderColumn = sort === 'newest' ? 'created_at' : 'rating';
  const ascending = sort === 'lowest';

  const start = (page - 1) * pageSize;
  const end = start + pageSize - 1;

  const { data, error, count } = await supabase
    .from("reviews")
    .select("*", { count: "exact" })
    .eq("product_id", productId)
    .order(orderColumn, { ascending })
    .range(start, end);

  if (error) throw error;
  return { reviews: data as ReviewRow[], total: count ?? 0 };
}

export async function getProductRatingSummary(productId: string) {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("reviews")
    .select("rating")
    .eq("product_id", productId);

  if (error) throw error;
  if (!data || data.length === 0) {
    return { average: 0, count: 0, distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } };
  }

  const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } as Record<number, number>;
  let sum = 0;
  for (const row of data) {
    distribution[row.rating] = (distribution[row.rating] ?? 0) + 1;
    sum += row.rating;
  }

  return {
    average: Number((sum / data.length).toFixed(1)),
    count: data.length,
    distribution,
  };
}

export async function getProductRatingSummaries(productIds: string[]) {
  const uniqueIds = Array.from(new Set(productIds.filter(Boolean)));
  if (uniqueIds.length === 0) {
    return {} as Record<string, { average: number; count: number }>;
  }

  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("reviews")
    .select("product_id, rating")
    .in("product_id", uniqueIds);

  if (error) {
    return {} as Record<string, { average: number; count: number }>;
  }

  const acc: Record<string, { sum: number; count: number }> = {};
  for (const row of data ?? []) {
    const productId = row.product_id;
    const prev = acc[productId] ?? { sum: 0, count: 0 };
    prev.sum += row.rating;
    prev.count += 1;
    acc[productId] = prev;
  }

  const summaries: Record<string, { average: number; count: number }> = {};
  for (const id of uniqueIds) {
    const stat = acc[id];
    if (!stat) {
      summaries[id] = { average: 0, count: 0 };
    } else {
      summaries[id] = {
        average: Number((stat.sum / stat.count).toFixed(1)),
        count: stat.count,
      };
    }
  }

  return summaries;
}

export async function getUserReviewForProduct(userId: string, productId: string) {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("reviews")
    .select("*")
    .eq("user_id", userId)
    .eq("product_id", productId)
    .maybeSingle();

  if (error) throw error;
  return data as ReviewRow | null;
}

export async function canUserReviewProduct(userId: string, productId: string): Promise<boolean> {
  const supabase = await createServerSupabaseClient();

  const { data: orders, error: ordersError } = await supabase
    .from("orders")
    .select("id")
    .eq("user_id", userId)
    .limit(200);

  if (ordersError || !orders || orders.length === 0) return false;

  const orderIds = orders.map((o) => o.id);

  const { data: orderItems, error: itemsError } = await supabase
    .from("order_items")
    .select("id")
    .eq("product_id", productId)
    .in("order_id", orderIds)
    .limit(1);

  if (itemsError) return false;
  return (orderItems?.length ?? 0) > 0;
}

export async function createReview(input: { user_id: string; product_id: string; rating: number; title?: string; body?: string }) {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("reviews")
    .insert(input)
    .select()
    .single();

  if (error) throw error;
  return data as ReviewRow;
}

export async function updateReview(id: string, userId: string, input: { rating?: number; title?: string; body?: string }) {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("reviews")
    .update({ ...input, updated_at: new Date().toISOString() })
    .eq("id", id)
    .eq("user_id", userId)
    .select()
    .single();

  if (error) throw error;
  return data as ReviewRow;
}

export async function deleteReview(id: string, userId: string) {
  const supabase = await createServerSupabaseClient();

  const { error } = await supabase
    .from("reviews")
    .delete()
    .eq("id", id)
    .eq("user_id", userId);

  if (error) throw error;
}
