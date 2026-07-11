import { createServerSupabaseClient } from "@/src/lib/supabase/server";
import type { Database } from "@/src/types/database";

export interface DashboardSummary {
  email: string;
  fullName: string;
  avatarUrl: string | null;
  totalOrders: number;
  wishlistCount: number;
  recentOrders: Database["public"]["Tables"]["orders"]["Row"][];
  defaultAddress: Database["public"]["Tables"]["addresses"]["Row"] | null;
}

export interface AccountProfileSummary {
  user_id: string;
  full_name: string | null;
  phone: string | null;
  avatar_url: string | null;
  email: string;
}

export async function getCurrentAccountUserServer() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  return user;
}

export async function getDashboardSummaryServer(): Promise<DashboardSummary | null> {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const [{ count: orderCount }, { count: wishlistCount }, { data: recentOrders }, { data: defaultAddress }, { data: profile }] = await Promise.all([
    supabase.from("orders").select("id", { count: "exact", head: true }).eq("user_id", user.id),
    supabase.from("wishlist_items").select("id", { count: "exact", head: true }).eq("user_id", user.id),
    supabase.from("orders").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).limit(5),
    supabase.from("addresses").select("*").eq("user_id", user.id).eq("is_default", true).maybeSingle(),
    supabase.from("user_profiles").select("*").eq("user_id", user.id).maybeSingle(),
  ]);

  return {
    email: user.email ?? "",
    fullName: profile?.full_name ?? user.user_metadata?.full_name ?? user.email?.split("@")[0] ?? "Customer",
    avatarUrl: profile?.avatar_url ?? null,
    totalOrders: orderCount ?? 0,
    wishlistCount: wishlistCount ?? 0,
    recentOrders: (recentOrders ?? []) as Database["public"]["Tables"]["orders"]["Row"][],
    defaultAddress: (defaultAddress as Database["public"]["Tables"]["addresses"]["Row"] | null) ?? null,
  };
}

export async function getUserProfileSummaryServer(): Promise<AccountProfileSummary | null> {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: profile } = await supabase.from("user_profiles").select("*").eq("user_id", user.id).maybeSingle();

  return {
    user_id: user.id,
    full_name: profile?.full_name ?? user.user_metadata?.full_name ?? user.email?.split("@")[0] ?? "",
    phone: profile?.phone ?? null,
    avatar_url: profile?.avatar_url ?? null,
    email: user.email ?? "",
  };
}

export async function getUserOrdersServer(page = 1, pageSize = 10) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { orders: [], total: 0 };
  }

  const start = (page - 1) * pageSize;
  const end = start + pageSize - 1;

  const { data, error, count } = await supabase
    .from("orders")
    .select("*, order_items(count)", { count: "exact" })
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .range(start, end);

  if (error) {
    throw error;
  }

  return {
    orders: (data ?? []) as unknown as Array<Database["public"]["Tables"]["orders"]["Row"] & { order_items: { count: number }[] }>,
    total: count ?? 0,
  };
}

export async function getUserOrderDetailsServer(orderNumber: string) {
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

  return data as (Database["public"]["Tables"]["orders"]["Row"] & {
    order_items: Array<
      Database["public"]["Tables"]["order_items"]["Row"] & {
        products: Database["public"]["Tables"]["products"]["Row"] | null;
      }
    >;
  }) | null;
}
