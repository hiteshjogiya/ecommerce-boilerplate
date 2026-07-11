import { createBrowserClient } from "@supabase/ssr";
import { getSupabaseEnv } from "@/src/lib/supabase/env";

export function createClient() {
  const { url, key, isConfigured } = getSupabaseEnv();

  if (!isConfigured || !url || !key) {
    throw new Error("Supabase URL and anon key are not configured.");
  }

  return createBrowserClient(url, key);
}
