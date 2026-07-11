"use client";

import { useEffect } from "react";
import { createClient } from "@/src/lib/supabase/client";
import { getSupabaseEnv } from "@/src/lib/supabase/env";
import { clearGuestCartItems, loadRemoteCartItems, mergeCartLineItems, readGuestCartItems, syncRemoteCartItems, writeGuestCartItems } from "@/src/services/cart.service";
import { useCartStore } from "@/store/cart-store";

export function CartSyncBridge() {
  const setItems = useCartStore((state) => state.setItems);
  const setUserId = useCartStore((state) => state.setUserId);
  const setBusy = useCartStore((state) => state.setBusy);
  const userId = useCartStore((state) => state.userId);
  const items = useCartStore((state) => state.items);

  useEffect(() => {
    const { isConfigured } = getSupabaseEnv();

    if (!isConfigured) {
      setBusy(false);
      setUserId(null);
      setItems(readGuestCartItems());
      return;
    }

    const supabase = createClient();
    let cancelled = false;

    void (async () => {
      setBusy(true);

      try {
        const { data } = await supabase.auth.getSession();
        const sessionUser = data.session?.user ?? null;

        if (cancelled) {
          return;
        }

        if (!sessionUser) {
          setUserId(null);
          setItems(readGuestCartItems());
          return;
        }

        setUserId(sessionUser.id);

        const remoteItems = await loadRemoteCartItems(sessionUser.id);
        const guestItems = readGuestCartItems();
        const mergedItems = mergeCartLineItems(remoteItems, guestItems);

        if (cancelled) {
          return;
        }

        setItems(mergedItems);
        await syncRemoteCartItems(sessionUser.id, mergedItems);
        clearGuestCartItems();
      } catch {
        if (!cancelled) {
          const fallbackItems = readGuestCartItems();

          if (fallbackItems.length > 0) {
            setItems(fallbackItems);
          }
        }
      } finally {
        if (!cancelled) {
          setBusy(false);
        }
      }
    })();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (cancelled) {
        return;
      }

      const nextUser = session?.user ?? null;

      if (!nextUser) {
        writeGuestCartItems(useCartStore.getState().items);
        setBusy(false);
        setUserId(null);
        setItems(readGuestCartItems());
        return;
      }

      setBusy(true);

      try {
        setUserId(nextUser.id);

        const remoteItems = await loadRemoteCartItems(nextUser.id);
        const guestItems = readGuestCartItems();
        const mergedItems = mergeCartLineItems(remoteItems, guestItems);

        setItems(mergedItems);
        await syncRemoteCartItems(nextUser.id, mergedItems);
        clearGuestCartItems();
      } catch {
        if (!cancelled) {
          const fallbackItems = readGuestCartItems();

          if (fallbackItems.length > 0) {
            setItems(fallbackItems);
          }
        }
      } finally {
        if (!cancelled) {
          setBusy(false);
        }
      }
    });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, [setBusy, setItems, setUserId]);

  useEffect(() => {
    if (!userId) {
      writeGuestCartItems(items);
    }
  }, [items, userId]);

  return null;
}
