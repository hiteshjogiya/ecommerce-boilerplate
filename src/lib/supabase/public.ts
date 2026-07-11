import { createClient } from "@supabase/supabase-js";
import { getSupabaseEnv } from "@/src/lib/supabase/env";

export function createPublicSupabaseClient() {
  const { url, key, isConfigured } = getSupabaseEnv();

  if (!isConfigured || !url || !key) {
    throw new Error("Supabase URL and anon key are not configured.");
  }

  return createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
}
