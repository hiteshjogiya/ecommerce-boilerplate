import { MainShell } from "@/components/layout/main-shell";
import CatalogPage from "@/features/catalog/catalog-page";

interface ProductsPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default function ProductsPage({ searchParams }: ProductsPageProps) {
  return (
    <MainShell>
      <CatalogPage searchParams={searchParams} />
    </MainShell>
  );
}
