import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { CartDrawer } from "@/features/cart/components/cart-drawer";
import { CartSyncBridge } from "@/features/cart/hooks/use-cart-sync";
import { WishlistSyncBoundary } from "@/features/wishlist/components/wishlist-sync-boundary";

export function MainShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
      <Header />
      <CartSyncBridge />
      <WishlistSyncBoundary />
      <CartDrawer />
      <div className="flex-1">{children}</div>
      <Footer />
    </div>
  );
}
