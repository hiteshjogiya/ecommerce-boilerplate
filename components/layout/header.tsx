"use client";

import Link from "next/link";
import { Menu, Heart, ShoppingBag, User, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useCartStore } from "@/store/cart-store";
import { SiteNav } from "@/components/layout/site-nav";
import { SearchBar } from "@/components/layout/search-bar";
import { createClient } from "@/src/lib/supabase/client";
import { AvatarImage } from "@/components/ui/avatar-image";

export function Header() {
  const wishlist = useCartStore((state) => state.wishlist);
  const totalQuantity = useCartStore((state) => state.items.reduce((sum, item) => sum + item.quantity, 0));
  const openDrawer = useCartStore((state) => state.openDrawer);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      try {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user || cancelled) {
          setAvatarUrl(null);
          return;
        }

        const { data } = await supabase
          .from("user_profiles")
          .select("avatar_url")
          .eq("user_id", user.id)
          .maybeSingle();

        if (!cancelled) {
          setAvatarUrl(data?.avatar_url ?? null);
        }
      } catch {
        if (!cancelled) {
          setAvatarUrl(null);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="border-b border-slate-100 bg-slate-900 px-4 py-3 text-center text-sm font-medium text-white">
        Free shipping on orders over $100 • New season arrivals now live
      </div>
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 lg:px-8">
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="rounded-full border border-slate-200 p-2 lg:hidden"
            onClick={() => setMobileNavOpen((value) => !value)}
            aria-label="Toggle menu"
            aria-expanded={mobileNavOpen}
            aria-controls="mobile-site-nav"
          >
            {mobileNavOpen ? <X className="h-5 w-5 text-slate-700" /> : <Menu className="h-5 w-5 text-slate-700" />}
          </button>
          <Link href="/" className="text-xl font-semibold tracking-tight text-slate-900">
            Northstar
          </Link>
        </div>

        <SiteNav />

        <div className="flex flex-1 items-center justify-end gap-3">
          <div className="hidden md:flex flex-1 lg:flex-1 max-w-md">
            <SearchBar />
          </div>
          <Link href="/wishlist" className="relative rounded-full border border-slate-200 p-2.5 text-slate-700">
            <Heart className="h-5 w-5" />
            {wishlist.length > 0 ? (
              <span className="absolute -right-1 -top-1 rounded-full bg-blue-600 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                {wishlist.length}
              </span>
            ) : null}
          </Link>
          <Link href="/account" className="rounded-full border border-slate-200 p-2.5 text-slate-700 transition hover:bg-slate-50" aria-label="Go to account dashboard">
            {avatarUrl ? (
              <AvatarImage src={avatarUrl} alt="Account avatar" size={20} className="h-5 w-5 border-0" />
            ) : (
              <User className="h-5 w-5" />
            )}
          </Link>
          <button type="button" onClick={openDrawer} className="relative rounded-full border border-slate-200 p-2.5 text-slate-700 transition hover:bg-slate-50" aria-label="Open cart drawer">
            <ShoppingBag className="h-5 w-5" />
            {totalQuantity > 0 ? (
              <span className="absolute -right-1 -top-1 rounded-full bg-blue-600 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                {totalQuantity}
              </span>
            ) : null}
          </button>
        </div>
      </div>
      {mobileNavOpen ? (
        <div id="mobile-site-nav" className="border-t border-slate-200 bg-white px-4 py-4 lg:hidden">
          <SiteNav mobile />
        </div>
      ) : null}
    </header>
  );
}
