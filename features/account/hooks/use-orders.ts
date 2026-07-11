"use client";

import { useCallback, useState } from "react";
import { createClient } from "@/src/lib/supabase/client";
import type { Database } from "@/src/types/database";

export function useOrders() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getOrders = useCallback(async (page: number, pageSize: number) => {
    setLoading(true);
    setError(null);

    try {
      const supabase = createClient();
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
        .select("*", { count: "exact" })
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .range(start, end);

      if (error) {
        throw error;
      }

      return {
        orders: (data ?? []) as Database["public"]["Tables"]["orders"]["Row"][],
        total: count ?? 0,
      };
    } catch (error) {
      setError(error instanceof Error ? error.message : "Unable to load orders.");
      return { orders: [], total: 0 };
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    getOrders,
  };
}
