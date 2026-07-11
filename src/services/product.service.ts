import { unstable_cache } from "next/cache";
import { createPublicSupabaseClient } from "@/src/lib/supabase/public";
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

interface CatalogProductsCacheInput {
  categoryId?: string;
  categorySlug?: string;
  featured: boolean;
  search?: string;
  sort: string;
  page: number;
  pageSize: number;
  minPrice: number;
  maxPrice: number;
  availability?: string;
}

const getProductsCached = unstable_cache(
  async (options: { categoryId?: string; featured?: boolean; search?: string; limit: number }) => {
    const supabase = createPublicSupabaseClient();

    let query = supabase
      .from("products")
      .select("*, categories(*)")
      .eq("active", true)
      .order("created_at", { ascending: false })
      .limit(options.limit);

    if (options.categoryId) {
      query = query.eq("category_id", options.categoryId);
    }

    if (options.featured) {
      query = query.eq("featured", true);
    }

    if (options.search) {
      query = query.ilike("title", `%${options.search}%`);
    }

    const { data, error } = await query;

    if (error) {
      if (isMissingSupabaseTableError(error)) {
        return [] as ProductRow[];
      }

      throw error;
    }

    return data as ProductRow[];
  },
  ["products-query"],
  { revalidate: 180, tags: ["products"] },
);

const getCatalogProductsCached = unstable_cache(
  async (options: CatalogProductsCacheInput) => {
    const supabase = createPublicSupabaseClient();

    let query = supabase.from("products").select("*, categories(*)", { count: "exact" }).eq("active", true);

    if (options.categoryId) {
      query = query.eq("category_id", options.categoryId);
    }

    if (options.categorySlug) {
      const { data: categoryData, error: categoryError } = await supabase.from("categories").select("id").eq("slug", options.categorySlug).maybeSingle();

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

    if (options.search) {
      query = query.ilike("title", `%${options.search}%`);
    }

    if (options.featured) {
      query = query.eq("featured", true);
    }

    if (options.availability === "in_stock") {
      query = query.gte("stock", 1);
    }

    if (options.minPrice > 0) {
      query = query.gte("price", options.minPrice);
    }

    if (options.maxPrice > 0) {
      query = query.lte("price", options.maxPrice);
    }

    switch (options.sort) {
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

    const start = (options.page - 1) * options.pageSize;
    const end = start + options.pageSize - 1;
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
  },
  ["catalog-products-query"],
  { revalidate: 120, tags: ["products", "categories"] },
);

const getProductBySlugCached = unstable_cache(
  async (slug: string) => {
    const supabase = createPublicSupabaseClient();
    const { data, error } = await supabase.from("products").select("*, categories(*)").eq("slug", slug).eq("active", true).maybeSingle();

    if (error) {
      if (isMissingSupabaseTableError(error)) {
        return null;
      }

      throw error;
    }

    return data as ProductRow | null;
  },
  ["product-by-slug"],
  { revalidate: 120, tags: ["products"] },
);

export async function getProducts({ categoryId, featured, search, limit = 12 }: { categoryId?: string; featured?: boolean; search?: string; limit?: number } = {}) {
  return getProductsCached({ categoryId, featured, search, limit });
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
  return getCatalogProductsCached({
    categoryId,
    categorySlug,
    featured: Boolean(featured),
    search,
    sort,
    page,
    pageSize,
    minPrice,
    maxPrice,
    availability,
  });
}

export async function getFeaturedProducts(limit = 8) {
  return getProducts({ featured: true, limit });
}

export async function getProductBySlug(slug: string) {
  return getProductBySlugCached(slug);
}

export async function getProductsByCategory(categoryId: string, limit = 12) {
  return getProducts({ categoryId, limit });
}

export async function searchProducts(query: string, limit = 12) {
  return getProducts({ search: query, limit });
}
