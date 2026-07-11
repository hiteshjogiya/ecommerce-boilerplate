import type { Metadata } from "next";
import { MainShell } from "@/components/layout/main-shell";
import { JsonLd } from "@/components/seo/json-ld";
import CatalogPage from "@/features/catalog/catalog-page";
import { buildBreadcrumbJsonLd, buildCategoryJsonLd, buildMetadata, absoluteUrl } from "@/src/lib/seo";
import { getSupabaseEnv } from "@/src/lib/supabase/env";
import { getCategoryBySlug } from "@/src/services/category.service";
import { getFallbackCategoryBySlug } from "@/src/constants/catalog-fallback";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export const revalidate = 120;

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const { isConfigured } = getSupabaseEnv();
  const category = isConfigured ? await getCategoryBySlug(slug) : getFallbackCategoryBySlug(slug);

  if (!category) {
    return buildMetadata({
      title: "Category",
      description: "Explore products by category.",
      path: `/categories/${slug}`,
    });
  }

  return buildMetadata({
    title: `${category.name} Category`,
    description: `Shop ${category.name} products curated for quality and daily use.`,
    path: `/categories/${slug}`,
    image: category.image ?? "/window.svg",
  });
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { slug } = await params;
  const { isConfigured } = getSupabaseEnv();
  const category = isConfigured ? await getCategoryBySlug(slug) : getFallbackCategoryBySlug(slug);
  const categoryName = category?.name ?? "Category";
  const categoryDescription = category ? `Browse all ${category.name} products.` : "Browse curated products by category.";

  return (
    <MainShell>
      <JsonLd
        id={`breadcrumb-category-${slug}`}
        data={buildBreadcrumbJsonLd([
          { name: "Home", url: absoluteUrl("/") },
          { name: "Products", url: absoluteUrl("/products") },
          { name: categoryName, url: absoluteUrl(`/categories/${slug}`) },
        ])}
      />
      <JsonLd
        id={`category-jsonld-${slug}`}
        data={buildCategoryJsonLd({
          name: categoryName,
          description: categoryDescription,
          url: absoluteUrl(`/categories/${slug}`),
        })}
      />
      <CatalogPage searchParams={searchParams} categorySlug={slug} />
    </MainShell>
  );
}
