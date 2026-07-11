import { MainShell } from "@/components/layout/main-shell";
import CatalogPage from "@/features/catalog/catalog-page";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { slug } = await params;

  return (
    <MainShell>
      <CatalogPage searchParams={searchParams} categorySlug={slug} />
    </MainShell>
  );
}
