import { MainShell } from "@/components/layout/main-shell";
import { ScrollToTop } from "@/components/common/scroll-to-top";
import ProductDetailPage from "@/features/products/product-detail-page";
import type { Metadata } from "next";
import { getSupabaseEnv } from "@/src/lib/supabase/env";
import { findFallbackProductBySlug } from "@/src/constants/catalog-fallback";
import { getProductBySlug } from "@/src/services/product.service";
import { isValidProductSlug } from "@/src/lib/product-detail";
import { buildMetadata } from "@/src/lib/seo";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 120;

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;

  if (!isValidProductSlug(slug)) {
    return buildMetadata({
      title: "Product",
      description: "Product detail page",
      path: `/products/${slug}`,
      type: "article",
    });
  }

  try {
    const { isConfigured } = getSupabaseEnv();
    const product = isConfigured ? await getProductBySlug(slug) : findFallbackProductBySlug(slug);

    if (!product) {
      return buildMetadata({
        title: "Product",
        description: "Product detail page",
        path: `/products/${slug}`,
        type: "article",
      });
    }

    return buildMetadata({
      title: product.title,
      description: product.description,
      path: `/products/${slug}`,
      image: product.thumbnail ?? "/window.svg",
      type: "article",
    });
  } catch {
    return buildMetadata({
      title: "Product",
      description: "Product detail page",
      path: `/products/${slug}`,
      type: "article",
    });
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;

  return (
    <MainShell>
      <ScrollToTop key={slug} />
      <ProductDetailPage slug={slug} />
    </MainShell>
  );
}
