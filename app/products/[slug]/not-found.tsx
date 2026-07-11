import { MainShell } from "@/components/layout/main-shell";
import { ProductNotFoundState } from "@/features/products/components/product-not-found-state";

export default function NotFound() {
  return (
    <MainShell>
      <section className="mx-auto max-w-7xl px-4 py-8 lg:px-8 lg:py-10">
        <ProductNotFoundState />
      </section>
    </MainShell>
  );
}
