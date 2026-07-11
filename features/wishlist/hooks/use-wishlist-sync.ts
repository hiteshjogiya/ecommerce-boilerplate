"use client";

import { useEffect } from "react";
import { createClient } from "@/src/lib/supabase/client";
import { getSupabaseEnv } from "@/src/lib/supabase/env";
import { getWishlist } from "@/src/services/wishlist.service";
import { useCartStore } from "@/store/cart-store";

export function WishlistSyncBridge() {
  const setWishlistItems = useCartStore((state) => state.setWishlistItems);
  const setWishlistLoading = useCartStore((state) => state.setWishlistLoading);
  const setWishlistError = useCartStore((state) => state.setWishlistError);
  const setUserId = useCartStore((state) => state.setUserId);

  useEffect(() => {
    const { isConfigured } = getSupabaseEnv();

    if (!isConfigured) {
      setWishlistLoading(false);
      setWishlistItems([]);
      return;
    }

    const supabase = createClient();
    let cancelled = false;

    void (async () => {
      setWishlistLoading(true);
      setWishlistError(null);

      try {
        const { data } = await supabase.auth.getSession();
        const user = data.session?.user ?? null;

        if (cancelled) {
          return;
        }

        if (!user) {
          setUserId(null);
          setWishlistItems([]);
          return;
        }

        setUserId(user.id);
        const items = await getWishlist(user.id);

        if (cancelled) {
          return;
        }

        setWishlistItems(items);
      } catch (error) {
        if (!cancelled) {
          setWishlistError(error instanceof Error ? error.message : "We could not load your wishlist.");
        }
      } finally {
        if (!cancelled) {
          setWishlistLoading(false);
        }
      }
    })();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (cancelled) {
        return;
      }

      const user = session?.user ?? null;

      if (!user) {
        setUserId(null);
        setWishlistItems([]);
        return;
      }

      setWishlistLoading(true);
      setUserId(user.id);

      try {
        const items = await getWishlist(user.id);
        if (!cancelled) {
          setWishlistItems(items);
        }
      } catch (error) {
        if (!cancelled) {
          setWishlistError(error instanceof Error ? error.message : "We could not load your wishlist.");
        }
      } finally {
        if (!cancelled) {
          setWishlistLoading(false);
        }
      }
    });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, [setUserId, setWishlistError, setWishlistItems, setWishlistLoading]);

  return null;
}
