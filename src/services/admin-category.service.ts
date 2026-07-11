/**
 * Admin-specific category operations
 * These methods require admin role
 */

import { createServerSupabaseClient } from "@/src/lib/supabase/server";
import type { Database } from "@/src/types/database";

export type CategoryRow = Database["public"]["Tables"]["categories"]["Row"];

interface CreateCategoryInput {
  name: string;
  slug: string;
  image?: string;
}

interface UpdateCategoryInput extends Partial<CreateCategoryInput> {
  id: string;
}

export async function createCategory(input: CreateCategoryInput) {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("categories")
    .insert({
      name: input.name,
      slug: input.slug,
      image: input.image,
    })
    .select()
    .single();

  if (error) throw error;
  return data as CategoryRow;
}

export async function updateCategory(input: UpdateCategoryInput) {
  const supabase = await createServerSupabaseClient();
  const { id, ...updates } = input;

  const { data, error } = await supabase
    .from("categories")
    .update({
      ...updates,
    })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as CategoryRow;
}

export async function deleteCategory(id: string) {
  const supabase = await createServerSupabaseClient();

  // Check if category has products
  const { count, error: countError } = await supabase
    .from("products")
    .select("id", { count: "exact", head: true })
    .eq("category_id", id);

  if (countError) throw countError;

  if (count && count > 0) {
    throw new Error("Cannot delete category with existing products");
  }

  const { error } = await supabase.from("categories").delete().eq("id", id);

  if (error) throw error;
}

export async function getCategoryById(id: string) {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase.from("categories").select("*").eq("id", id).single();

  if (error) throw error;
  return data as CategoryRow;
}

export async function getAdminCategories({
  search,
  page = 1,
  pageSize = 20,
}: {
  search?: string;
  page?: number;
  pageSize?: number;
}) {
  const supabase = await createServerSupabaseClient();

  let query = supabase.from("categories").select("*", { count: "exact" }).order("created_at", { ascending: false });

  if (search) {
    query = query.ilike("name", `%${search}%`);
  }

  const start = (page - 1) * pageSize;
  const end = start + pageSize - 1;

  const { data, error, count } = await query.range(start, end);

  if (error) throw error;

  return {
    categories: data as CategoryRow[],
    total: count ?? 0,
  };
}
