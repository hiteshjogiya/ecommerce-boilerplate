import { ProductCard } from "@/components/common/product-card";
import type { Product } from "@/types/product";

interface HomeProductGridProps {
  products: Product[];
}

export function HomeProductGrid({ products }: HomeProductGridProps) {
  return (
    <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
