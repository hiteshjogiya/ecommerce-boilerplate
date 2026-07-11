import { createServerSupabaseClient } from "@/src/lib/supabase/server";
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
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.from("categories").select("*").order("created_at", { ascending: false });

  if (error) {
    if (isMissingSupabaseTableError(error)) {
      return [] as CategoryRow[];
    }

    throw error;
  }

  return data as CategoryRow[];
}

export async function getCategoryBySlug(slug: string) {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.from("categories").select("*").eq("slug", slug).maybeSingle();

  if (error) {
    if (isMissingSupabaseTableError(error)) {
      return null;
    }

    throw error;
  }

  return data as CategoryRow | null;
}
