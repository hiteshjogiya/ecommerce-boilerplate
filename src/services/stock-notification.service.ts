import { createServerSupabaseClient } from "@/src/lib/supabase/server";

export async function subscribeToStockNotification(userId: string, productId: string) {
  const supabase = await createServerSupabaseClient();

  const { error } = await supabase
    .from("stock_notifications")
    .upsert({ user_id: userId, product_id: productId, notified: false }, { onConflict: "user_id,product_id" });

  if (error) throw error;
}

export async function unsubscribeFromStockNotification(userId: string, productId: string) {
  const supabase = await createServerSupabaseClient();

  const { error } = await supabase
    .from("stock_notifications")
    .delete()
    .eq("user_id", userId)
    .eq("product_id", productId);

  if (error) throw error;
}

export async function isUserSubscribed(userId: string, productId: string): Promise<boolean> {
  const supabase = await createServerSupabaseClient();

  const { data } = await supabase
    .from("stock_notifications")
    .select("id")
    .eq("user_id", userId)
    .eq("product_id", productId)
    .maybeSingle();

  return !!data;
}
