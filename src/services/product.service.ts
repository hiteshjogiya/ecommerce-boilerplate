import { createServerSupabaseClient } from "@/src/lib/supabase/server";
import type { Database } from "@/src/types/database";

export type ProductRow = Database["public"]["Tables"]["products"]["Row"];

function isMissingSupabaseTableError(error: unknown) {
  return Boolean(
    error &&
      typeof error === "object" &&
      "code" in error &&
      (error as { code?: string }).code === "PGRST205",
  );
}

export interface CatalogProductsOptions {
  categoryId?: string;
  categorySlug?: string;
  featured?: boolean;
  search?: string;
  sort?: string;
  page?: number;
  pageSize?: number;
  minPrice?: number;
  maxPrice?: number;
  availability?: string;
  limit?: number;
}

export async function getProducts({ categoryId, featured, search, limit = 12 }: { categoryId?: string; featured?: boolean; search?: string; limit?: number } = {}) {
  const supabase = await createServerSupabaseClient();

  let query = supabase.from("products").select("*, categories(*)").eq("active", true).order("created_at", { ascending: false }).limit(limit);

  if (categoryId) {
    query = query.eq("category_id", categoryId);
  }

  if (featured) {
    query = query.eq("featured", true);
  }

  if (search) {
    query = query.ilike("title", `%${search}%`);
  }

  const { data, error } = await query;

  if (error) {
    if (isMissingSupabaseTableError(error)) {
      return [] as ProductRow[];
    }

    throw error;
  }

  return data as ProductRow[];
}

export async function getCatalogProducts({
  categoryId,
  categorySlug,
  featured,
  search,
  sort = "featured",
  page = 1,
  pageSize = 12,
  minPrice = 0,
  maxPrice = 500,
  availability,
}: CatalogProductsOptions = {}) {
  const supabase = await createServerSupabaseClient();

  let query = supabase.from("products").select("*, categories(*)", { count: "exact" }).eq("active", true);

  if (categoryId) {
    query = query.eq("category_id", categoryId);
  }

  if (categorySlug) {
    const { data: categoryData, error: categoryError } = await supabase.from("categories").select("id").eq("slug", categorySlug).maybeSingle();

    if (categoryError) {
      if (isMissingSupabaseTableError(categoryError)) {
        return { products: [] as ProductRow[], total: 0 };
      }

      throw categoryError;
    }

    if (categoryData?.id) {
      query = query.eq("category_id", categoryData.id);
    }
  }

  if (search) {
    query = query.ilike("title", `%${search}%`);
  }

  if (featured) {
    query = query.eq("featured", true);
  }

  if (availability === "in_stock") {
    query = query.gte("stock", 1);
  }

  if (minPrice > 0) {
    query = query.gte("price", minPrice);
  }

  if (maxPrice > 0) {
    query = query.lte("price", maxPrice);
  }

  switch (sort) {
    case "price_asc":
      query = query.order("price", { ascending: true });
      break;
    case "price_desc":
      query = query.order("price", { ascending: false });
      break;
    case "name_asc":
      query = query.order("title", { ascending: true });
      break;
    case "name_desc":
      query = query.order("title", { ascending: false });
      break;
    case "newest":
      query = query.order("created_at", { ascending: false });
      break;
    case "featured":
    default:
      query = query.order("featured", { ascending: false }).order("created_at", { ascending: false });
      break;
  }

  const start = (page - 1) * pageSize;
  const end = start + pageSize - 1;
  const { data, error, count } = await query.range(start, end);

  if (error) {
    if (isMissingSupabaseTableError(error)) {
      return { products: [] as ProductRow[], total: 0 };
    }

    throw error;
  }

  return {
    products: data as ProductRow[],
    total: count ?? 0,
  };
}

export async function getFeaturedProducts(limit = 8) {
  return getProducts({ featured: true, limit });
}

export async function getProductBySlug(slug: string) {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.from("products").select("*, categories(*)").eq("slug", slug).eq("active", true).maybeSingle();

  if (error) {
    if (isMissingSupabaseTableError(error)) {
      return null;
    }

    throw error;
  }

  return data as ProductRow | null;
}

export async function getProductsByCategory(categoryId: string, limit = 12) {
  return getProducts({ categoryId, limit });
}

export async function searchProducts(query: string, limit = 12) {
  return getProducts({ search: query, limit });
}
