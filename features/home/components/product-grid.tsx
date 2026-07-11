import { HomeProductGrid } from "@/features/home/components/home-product-grid";
import { getProductRatingSummaries } from "@/src/services/review.service";
import type { ProductRow } from "@/src/services/product.service";
import type { Product } from "@/types/product";

interface ProductGridProps {
  products: ProductRow[];
}

export async function ProductGrid({ products }: ProductGridProps) {
  const ratingSummaries = await getProductRatingSummaries(products.map((product) => product.id));

  const mappedProducts: Product[] = products.map((product) => ({
    id: product.id,
    slug: product.slug,
    name: product.title,
    description: product.description,
    price: Number(product.price),
    originalPrice: Number(product.compare_price) > Number(product.price) ? Number(product.compare_price) : undefined,
    image: product.thumbnail ?? "/window.svg",
    badge: product.featured ? "Featured" : undefined,
    rating: ratingSummaries[product.id]?.average ?? 0,
    reviews: ratingSummaries[product.id]?.count ?? 0,
    href: `/products/${product.slug}`,
  }));

  return <HomeProductGrid products={mappedProducts} />;
}
