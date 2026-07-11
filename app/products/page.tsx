import type { Metadata } from "next";
import { MainShell } from "@/components/layout/main-shell";
import CatalogPage from "@/features/catalog/catalog-page";
import { buildMetadata } from "@/src/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Products",
  description: "Browse premium products, refine by category, and find your next favorite in seconds.",
  path: "/products",
});

export const revalidate = 120;

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
