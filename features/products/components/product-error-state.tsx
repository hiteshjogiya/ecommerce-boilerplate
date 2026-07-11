import { CatalogError } from "@/features/catalog/catalog-error";

export function ProductErrorState() {
  return <CatalogError title="We couldn’t load this product" description="Please try again in a moment." />;
}
