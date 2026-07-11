import { MainShell } from "@/components/layout/main-shell";
import { ProductDetailSkeleton } from "@/features/products/components/product-detail-skeleton";

export default function Loading() {
  return (
    <MainShell>
      <section className="mx-auto max-w-7xl px-4 py-8 lg:px-8 lg:py-10">
        <ProductDetailSkeleton />
      </section>
    </MainShell>
  );
}
