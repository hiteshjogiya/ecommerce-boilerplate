import { MainShell } from "@/components/layout/main-shell";
import ProductDetailPage from "@/features/products/product-detail-page";
import { getSupabaseEnv } from "@/src/lib/supabase/env";
import { findFallbackProductBySlug } from "@/src/constants/catalog-fallback";
import { getProductBySlug } from "@/src/services/product.service";
import { isValidProductSlug } from "@/src/lib/product-detail";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { slug } = await params;

  if (!isValidProductSlug(slug)) {
    return {};
  }

  try {
    const { isConfigured } = getSupabaseEnv();
    const product = isConfigured ? await getProductBySlug(slug) : findFallbackProductBySlug(slug);

    if (!product) {
      return {};
    }

    return {
      title: product.title,
      description: product.description,
      openGraph: {
        title: product.title,
        description: product.description,
        type: "article",
      },
      twitter: {
        card: "summary_large_image",
        title: product.title,
        description: product.description,
      },
      alternates: {
        canonical: `/products/${slug}`,
      },
    };
  } catch {
    return {};
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;

  return (
    <MainShell>
      <ProductDetailPage slug={slug} />
    </MainShell>
  );
}
