import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import dynamic from "next/dynamic";

const CartDrawer = dynamic(() => import("@/features/cart/components/cart-drawer").then((mod) => mod.CartDrawer));
const CartSyncBridge = dynamic(() => import("@/features/cart/hooks/use-cart-sync").then((mod) => mod.CartSyncBridge));
const WishlistSyncBoundary = dynamic(() => import("@/features/wishlist/components/wishlist-sync-boundary").then((mod) => mod.WishlistSyncBoundary));
const CompareBar = dynamic(() => import("@/features/products/components/compare-button").then((mod) => mod.CompareBar));

export function MainShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
      <Header />
      <CartSyncBridge />
      <WishlistSyncBoundary />
      <CartDrawer />
      <main id="main-content" className="flex-1" tabIndex={-1}>
        {children}
      </main>
      <Footer />
      <CompareBar />
    </div>
  );
}
