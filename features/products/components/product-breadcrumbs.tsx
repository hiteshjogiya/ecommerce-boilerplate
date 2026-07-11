import Link from "next/link";

interface ProductBreadcrumbsProps {
  categoryName: string;
  categorySlug: string;
  productName: string;
}

export function ProductBreadcrumbs({ categoryName, categorySlug, productName }: ProductBreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
      <Link href="/" className="hover:text-blue-600">
        Home
      </Link>
      <span aria-hidden="true">/</span>
      <Link href={categorySlug ? `/categories/${categorySlug}` : "/products"} className="hover:text-blue-600">
        {categoryName}
      </Link>
      <span aria-hidden="true">/</span>
      <span className="font-medium text-slate-900">{productName}</span>
    </nav>
  );
}
