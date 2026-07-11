/**
 * Admin-specific order operations
 * These methods require admin role
 */

import { createServerSupabaseClient } from "@/src/lib/supabase/server";
import type { Database } from "@/src/types/database";

export type OrderRow = Database["public"]["Tables"]["orders"]["Row"];
type DbOrderStatus = Database["public"]["Enums"]["order_status"];

export type OrderStatus = "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled";

export type AdminOrderRow = Omit<OrderRow, "status"> & { status: OrderStatus };

function toDbOrderStatus(status: OrderStatus): DbOrderStatus {
  switch (status) {
    case "pending":
      return "Pending";
    case "confirmed":
      return "Confirmed";
    case "processing":
      return "Pending";
    case "shipped":
      return "Confirmed";
    case "delivered":
      return "Delivered";
    case "cancelled":
      return "Cancelled";
    default:
      return "Pending";
  }
}

function fromDbOrderStatus(status: DbOrderStatus): OrderStatus {
  switch (status) {
    case "Pending":
      return "pending";
    case "Confirmed":
      return "confirmed";
    case "Delivered":
      return "delivered";
    case "Cancelled":
      return "cancelled";
    default:
      return "pending";
  }
}

function normalizeOrderRow(row: OrderRow): AdminOrderRow {
  return {
    ...row,
    status: fromDbOrderStatus(row.status as DbOrderStatus),
  };
}

export type OrderWithItems = OrderRow & {
  order_items: Array<
    Database["public"]["Tables"]["order_items"]["Row"] & {
      products: Database["public"]["Tables"]["products"]["Row"] | null;
    }
  >;
};

export type AdminOrderWithItems = Omit<OrderWithItems, "status"> & { status: OrderStatus };

export async function getAdminOrders({
  search,
  status,
  page = 1,
  pageSize = 20,
}: {
  search?: string;
  status?: OrderStatus;
  page?: number;
  pageSize?: number;
}) {
  const supabase = await createServerSupabaseClient();

  let query = supabase
    .from("orders")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false });

  if (search) {
    query = query.ilike("order_number", `%${search}%`);
  }

  if (status) {
    query = query.eq("status", toDbOrderStatus(status));
  }

  const start = (page - 1) * pageSize;
  const end = start + pageSize - 1;

  const { data, error, count } = await query.range(start, end);

  if (error) throw error;

  return {
    orders: ((data ?? []) as OrderRow[]).map(normalizeOrderRow),
    total: count ?? 0,
  };
}

export async function getAdminOrderById(orderNumber: string): Promise<AdminOrderWithItems> {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("orders")
    .select("*, order_items(*, products(*))")
    .eq("order_number", orderNumber)
    .single();

  if (error) throw error;

  return {
    ...(data as OrderWithItems),
    status: fromDbOrderStatus((data as OrderWithItems).status as DbOrderStatus),
  };
}

export async function updateOrderStatus(orderNumber: string, status: OrderStatus) {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("orders")
    .update({
      status: toDbOrderStatus(status),
      updated_at: new Date().toISOString(),
    })
    .eq("order_number", orderNumber)
    .select()
    .single();

  if (error) throw error;

  return normalizeOrderRow(data as OrderRow);
}

export async function getAdminOrderStats() {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase.rpc("get_admin_stats");

  if (error) throw error;

  return data;
}
