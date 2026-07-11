/**
 * Admin-specific product operations
 * These methods require admin role
 */

import { createServerSupabaseClient } from "@/src/lib/supabase/server";
import type { Database } from "@/src/types/database";

export type ProductRow = Database["public"]["Tables"]["products"]["Row"];

interface CreateProductInput {
  title: string;
  slug: string;
  category_id: string;
  description: string;
  price: number;
  compare_price?: number;
  stock: number;
  featured?: boolean;
  active?: boolean;
  thumbnail?: string;
}

interface UpdateProductInput extends Partial<CreateProductInput> {
  id: string;
}

export async function createProduct(input: CreateProductInput) {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("products")
    .insert({
      title: input.title,
      slug: input.slug,
      category_id: input.category_id,
      description: input.description,
      price: input.price,
      compare_price: input.compare_price,
      stock: input.stock,
      featured: input.featured ?? false,
      active: input.active ?? true,
      thumbnail: input.thumbnail,
    })
    .select()
    .single();

  if (error) throw error;
  return data as ProductRow;
}

export async function updateProduct(input: UpdateProductInput) {
  const supabase = await createServerSupabaseClient();
  const { id, ...updates } = input;

  const { data, error } = await supabase
    .from("products")
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as ProductRow;
}

export async function deleteProduct(id: string) {
  const supabase = await createServerSupabaseClient();

  const { error } = await supabase.from("products").delete().eq("id", id);

  if (error) {
    if (error.code === '23503') {
      throw new Error('Cannot delete product with existing orders');
    }
    throw error;
  }
}

export async function toggleProductActive(id: string, active: boolean) {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("products")
    .update({ active })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as ProductRow;
}

export async function getProductById(id: string) {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("products")
    .select("*, categories(*)")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data as ProductRow;
}

export async function getAdminProducts({
  search,
  category_id,
  page = 1,
  pageSize = 20,
}: {
  search?: string;
  category_id?: string;
  page?: number;
  pageSize?: number;
}) {
  const supabase = await createServerSupabaseClient();

  let query = supabase.from("products").select("*, categories(*)", { count: "exact" }).order("created_at", { ascending: false });

  if (search) {
    query = query.ilike("title", `%${search}%`);
  }

  if (category_id) {
    query = query.eq("category_id", category_id);
  }

  const start = (page - 1) * pageSize;
  const end = start + pageSize - 1;

  const { data, error, count } = await query.range(start, end);

  if (error) throw error;

  return {
    products: data as ProductRow[],
    total: count ?? 0,
  };
}
