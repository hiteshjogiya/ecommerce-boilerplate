"use client";

import { useCallback, useState } from "react";
import { createClient } from "@/src/lib/supabase/client";
import type { Database } from "@/src/types/database";

type OrderDetails = Database["public"]["Tables"]["orders"]["Row"] & {
  order_items: Array<
    Database["public"]["Tables"]["order_items"]["Row"] & {
      products: Database["public"]["Tables"]["products"]["Row"] | null;
    }
  >;
};

export function useOrder() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getOrder = useCallback(async (orderNumber: string) => {
    setLoading(true);
    setError(null);

    try {
      const supabase = createClient();
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

      return data as OrderDetails | null;
    } catch (error) {
      setError(error instanceof Error ? error.message : "Unable to load order details.");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    getOrder,
  };
}
