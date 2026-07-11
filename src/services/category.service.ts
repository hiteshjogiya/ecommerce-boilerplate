import { unstable_cache } from "next/cache";
import { createPublicSupabaseClient } from "@/src/lib/supabase/public";
import type { Database } from "@/src/types/database";

export type CategoryRow = Database["public"]["Tables"]["categories"]["Row"];

function isMissingSupabaseTableError(error: unknown) {
  return Boolean(
    error &&
      typeof error === "object" &&
      "code" in error &&
      (error as { code?: string }).code === "PGRST205",
  );
}

export async function getCategories() {
  return getCategoriesCached();
}

const getCategoriesCached = unstable_cache(
  async () => {
    const supabase = createPublicSupabaseClient();
    const { data, error } = await supabase.from("categories").select("*").order("created_at", { ascending: false });

    if (error) {
      if (isMissingSupabaseTableError(error)) {
        return [] as CategoryRow[];
      }

      throw error;
    }

    return data as CategoryRow[];
  },
  ["categories-list"],
  { revalidate: 600, tags: ["categories"] },
);

const getCategoryBySlugCached = unstable_cache(
  async (slug: string) => {
    const supabase = createPublicSupabaseClient();
    const { data, error } = await supabase.from("categories").select("*").eq("slug", slug).maybeSingle();

    if (error) {
      if (isMissingSupabaseTableError(error)) {
        return null;
      }

      throw error;
    }

    return data as CategoryRow | null;
  },
  ["category-by-slug"],
  { revalidate: 600, tags: ["categories"] },
);

export async function getCategoryBySlug(slug: string) {
  return getCategoryBySlugCached(slug);
}
