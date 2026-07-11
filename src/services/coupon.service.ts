import { createServerSupabaseClient } from "@/src/lib/supabase/server";
import type { Database } from "@/src/types/database";

export type CouponRow = Database["public"]["Tables"]["coupons"]["Row"];

export interface CouponValidationResult {
  valid: boolean;
  coupon?: CouponRow;
  discount?: number;
  error?: string;
}

export async function validateCoupon(code: string, userId: string, orderTotal: number): Promise<CouponValidationResult> {
  const supabase = await createServerSupabaseClient();

  const { data: coupon, error } = await supabase
    .from("coupons")
    .select("*")
    .eq("code", code.toUpperCase())
    .eq("active", true)
    .maybeSingle();

  if (error) return { valid: false, error: "Failed to validate coupon" };
  if (!coupon) return { valid: false, error: "Invalid coupon code" };

  if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) {
    return { valid: false, error: "Coupon has expired" };
  }

  if (coupon.max_uses !== null && coupon.used_count >= coupon.max_uses) {
    return { valid: false, error: "Coupon usage limit reached" };
  }

  if (orderTotal < coupon.minimum_order_value) {
    return { valid: false, error: `Minimum order value is $${coupon.minimum_order_value.toFixed(2)}` };
  }

  // Check if user already used this coupon
  const { data: usage } = await supabase
    .from("coupon_usages")
    .select("id")
    .eq("coupon_id", coupon.id)
    .eq("user_id", userId)
    .maybeSingle();

  if (usage) return { valid: false, error: "You have already used this coupon" };

  const discount = coupon.discount_type === 'percentage'
    ? Number(((orderTotal * coupon.discount_value) / 100).toFixed(2))
    : Math.min(coupon.discount_value, orderTotal);

  return { valid: true, coupon, discount };
}

export async function recordCouponUsage(couponId: string, userId: string, orderId?: string) {
  const supabase = await createServerSupabaseClient();

  await supabase.from("coupon_usages").insert({ coupon_id: couponId, user_id: userId, order_id: orderId ?? null });

  // Increment used_count
  const { data: coupon } = await supabase.from("coupons").select("used_count").eq("id", couponId).single();
  if (coupon) {
    await supabase.from("coupons").update({ used_count: coupon.used_count + 1 }).eq("id", couponId);
  }
}
