import { HomeProductGrid } from "@/features/home/components/home-product-grid";
import type { ProductRow } from "@/src/services/product.service";
import type { Product } from "@/types/product";

interface ProductGridProps {
  products: ProductRow[];
}

export function ProductGrid({ products }: ProductGridProps) {
  const mappedProducts: Product[] = products.map((product) => ({
    id: product.id,
    slug: product.slug,
    name: product.title,
    description: product.description,
    price: Number(product.price),
    originalPrice: Number(product.compare_price) > Number(product.price) ? Number(product.compare_price) : undefined,
    image: product.thumbnail ?? "/window.svg",
    badge: product.featured ? "Featured" : undefined,
    reviews: 4,
    href: `/products/${product.slug}`,
  }));

  return <HomeProductGrid products={mappedProducts} />;
}
