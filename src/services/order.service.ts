import { AppError } from "@/src/lib/errors";
import { ORDER_STATUS, PAYMENT_STATUS } from "@/src/constants/order";
import { createClient } from "@/src/lib/supabase/client";
import type { Database } from "@/src/types/database";

export type OrderRow = Database["public"]["Tables"]["orders"]["Row"];
export type OrderItemRow = Database["public"]["Tables"]["order_items"]["Row"];

export interface PlaceOrderInput {
  addressId: string;
  shippingMethod: string;
  shippingCost: number;
  tax: number;
  discount: number;
}

export async function createOrder(order: Database["public"]["Tables"]["orders"]["Insert"]) {
  const supabase = createClient();
  const { data, error } = await supabase.from("orders").insert(order).select("*").single();

  if (error) {
    throw error;
  }

  return data as OrderRow;
}

export async function createOrderItems(items: Database["public"]["Tables"]["order_items"]["Insert"][]) {
  const supabase = createClient();
  const { data, error } = await supabase.from("order_items").insert(items).select("*");

  if (error) {
    throw error;
  }

  return (data ?? []) as OrderItemRow[];
}

export async function placeOrder(input: PlaceOrderInput) {
  const supabase = createClient();
  const { data: userData } = await supabase.auth.getUser();

  if (!userData.user) {
    throw new AppError("Please sign in to place your order.", 401);
  }

  const { data, error } = await supabase.rpc("place_order", {
    p_address_id: input.addressId,
    p_shipping_method: input.shippingMethod,
    p_shipping_cost: input.shippingCost,
    p_tax: input.tax,
    p_discount: input.discount,
  });

  if (error) {
    throw new AppError(error.message || "Unable to place your order right now.", 400);
  }

  const first = Array.isArray(data) ? data[0] : null;

  if (!first?.order_id || !first?.order_number) {
    throw new AppError("Your order could not be completed.", 500);
  }

  return {
    orderId: first.order_id,
    orderNumber: first.order_number,
    status: ORDER_STATUS.Pending,
    paymentStatus: PAYMENT_STATUS.Pending,
  };
}
