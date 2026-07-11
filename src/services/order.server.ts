import { createServerSupabaseClient } from "@/src/lib/supabase/server";
import type { Database } from "@/src/types/database";

export type OrderWithItems = Database["public"]["Tables"]["orders"]["Row"] & {
  order_items: Array<
    Database["public"]["Tables"]["order_items"]["Row"] & {
      products: Database["public"]["Tables"]["products"]["Row"] | null;
    }
  >;
};

export async function getOrderByNumberServer(orderNumber: string) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data, error } = await supabase
    .from("orders")
    .select("*, order_items(*, products(*))")
    .eq("user_id", user.id)
    .eq("order_number", orderNumber)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data as OrderWithItems | null;
}
