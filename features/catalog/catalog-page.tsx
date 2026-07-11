import Link from "next/link";
import { Suspense } from "react";
import { Filter, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/features/home/components/empty-state";
import { LoadingSkeleton } from "@/features/home/components/loading-skeleton";
import { ProductGrid } from "@/features/home/components/product-grid";
import { CatalogError } from "@/features/catalog/catalog-error";
import { CatalogSearch } from "@/features/catalog/catalog-search";
import { getSupabaseEnv } from "@/src/lib/supabase/env";
import { getCategories, type CategoryRow } from "@/src/services/category.service";
import { getCatalogProducts, type ProductRow } from "@/src/services/product.service";

interface CatalogPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
  categorySlug?: string;
}

interface CatalogContentProps extends CatalogPageProps {
  categories: CategoryRow[];
  isConfigured: boolean;
}

const PAGE_SIZE = 8;

const sortOptions = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest" },
  { value: "price_asc", label: "Price Low → High" },
  { value: "price_desc", label: "Price High → Low" },
  { value: "name_asc", label: "Name A → Z" },
  { value: "name_desc", label: "Name Z → A" },
] as const;

const fallbackCategories: CategoryRow[] = [
  { id: "cat-1", name: "Everyday Essentials", slug: "everyday-essentials", image: "/window.svg", created_at: "2026-07-11T00:00:00.000Z" },
  { id: "cat-2", name: "Weekend Layers", slug: "weekend-layers", image: "/globe.svg", created_at: "2026-07-11T00:00:00.000Z" },
  { id: "cat-3", name: "Signature Accessories", slug: "signature-accessories", image: "/vercel.svg", created_at: "2026-07-11T00:00:00.000Z" },
];

const fallbackProducts: ProductRow[] = [
  { id: "prod-1", category_id: "cat-1", title: "Aero Shell Jacket", slug: "aero-shell-jacket", description: "Weather-ready shell with a tailored, lightweight finish.", price: 189, compare_price: 240, stock: 12, thumbnail: "/window.svg", featured: true, active: true, created_at: "2026-07-11T00:00:00.000Z", updated_at: "2026-07-11T00:00:00.000Z" },
  { id: "prod-2", category_id: "cat-1", title: "Contour Tote", slug: "contour-tote", description: "A structured carryall designed for everyday practicality.", price: 98, compare_price: 128, stock: 8, thumbnail: "/globe.svg", featured: false, active: true, created_at: "2026-07-11T00:00:00.000Z", updated_at: "2026-07-11T00:00:00.000Z" },
  { id: "prod-3", category_id: "cat-2", title: "Lumen Knit Set", slug: "lumen-knit-set", description: "Soft knit layers with a premium hand-feel.", price: 156, compare_price: 198, stock: 6, thumbnail: "/vercel.svg", featured: true, active: true, created_at: "2026-07-11T00:00:00.000Z", updated_at: "2026-07-11T00:00:00.000Z" },
  { id: "prod-4", category_id: "cat-2", title: "Studio Loafers", slug: "studio-loafers", description: "Comfort-first form with a polished, sculptural profile.", price: 132, compare_price: 154, stock: 10, thumbnail: "/next.svg", featured: false, active: true, created_at: "2026-07-11T00:00:00.000Z", updated_at: "2026-07-11T00:00:00.000Z" },
  { id: "prod-5", category_id: "cat-3", title: "Sculpted Tote", slug: "sculpted-tote", description: "Minimal lines and a polished finish for daily carry.", price: 112, compare_price: 140, stock: 7, thumbnail: "/window.svg", featured: true, active: true, created_at: "2026-07-11T00:00:00.000Z", updated_at: "2026-07-11T00:00:00.000Z" },
  { id: "prod-6", category_id: "cat-3", title: "Cloud Knit Cardigan", slug: "cloud-knit-cardigan", description: "Soft texture and relaxed shape for effortless layering.", price: 94, compare_price: 118, stock: 5, thumbnail: "/globe.svg", featured: false, active: true, created_at: "2026-07-11T00:00:00.000Z", updated_at: "2026-07-11T00:00:00.000Z" },
  { id: "prod-7", category_id: "cat-3", title: "Orbit Sunglasses", slug: "orbit-sunglasses", description: "Refined silhouettes with a lightweight feel.", price: 72, compare_price: 90, stock: 9, thumbnail: "/vercel.svg", featured: false, active: true, created_at: "2026-07-11T00:00:00.000Z", updated_at: "2026-07-11T00:00:00.000Z" },
  { id: "prod-8", category_id: "cat-2", title: "Studio Scarf", slug: "studio-scarf", description: "A tactile finishing piece designed for cooler days.", price: 58, compare_price: 74, stock: 11, thumbnail: "/next.svg", featured: false, active: true, created_at: "2026-07-11T00:00:00.000Z", updated_at: "2026-07-11T00:00:00.000Z" },
];

function normalizeParam(value: string | string[] | undefined) {
  if (Array.isArray(value)) return value[0] ?? "";
  return value ?? "";
}

function buildPageNumbers(currentPage: number, totalPages: number) {
  const pages = new Set<number>();
  pages.add(1);
  pages.add(totalPages);
  pages.add(currentPage);
  pages.add(Math.max(1, currentPage - 1));
  pages.add(Math.min(totalPages, currentPage + 1));

  return Array.from(pages).filter((page) => page >= 1 && page <= totalPages).sort((a, b) => a - b);
}

function resolvePriceBounds(params: Record<string, string | string[] | undefined>) {
  const price = normalizeParam(params.price);

  if (price === "500-1000") {
    return { minPrice: 500, maxPrice: 1000 };
  }

  if (price === "1000-999999") {
    return { minPrice: 1000, maxPrice: 999999 };
  }

  return {
    minPrice: Number.parseInt(normalizeParam(params.minPrice), 10) || 0,
    maxPrice: Number.parseInt(normalizeParam(params.maxPrice), 10) || 500,
  };
}

function resolvePriceParam(minPrice: number, maxPrice: number) {
  if (minPrice === 500 && maxPrice === 1000) return "500-1000";
  if (minPrice === 1000) return "1000-999999";
  return "0-500";
}

function sortProducts(products: ProductRow[], sort: string) {
  const sorted = [...products];

  switch (sort) {
    case "price_asc":
      return sorted.sort((a, b) => Number(a.price) - Number(b.price));
    case "price_desc":
      return sorted.sort((a, b) => Number(b.price) - Number(a.price));
    case "name_asc":
      return sorted.sort((a, b) => a.title.localeCompare(b.title));
    case "name_desc":
      return sorted.sort((a, b) => b.title.localeCompare(a.title));
    case "newest":
      return sorted.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    case "featured":
    default:
      return sorted.sort((a, b) => Number(b.featured) - Number(a.featured) || new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }
}

function filterLocalCatalogProducts({
  categorySlug,
  search,
  sort,
  page,
  pageSize,
  minPrice,
  maxPrice,
  availability,
  featured,
}: {
  categorySlug?: string;
  search?: string;
  sort: string;
  page: number;
  pageSize: number;
  minPrice: number;
  maxPrice: number;
  availability?: string;
  featured?: boolean;
}) {
  const categoryId = categorySlug ? fallbackCategories.find((category) => category.slug === categorySlug)?.id : undefined;

  let products = fallbackProducts.filter((product) => product.active);

  if (categoryId) {
    products = products.filter((product) => product.category_id === categoryId);
  }

  if (search) {
    const normalizedSearch = search.toLowerCase();
    products = products.filter((product) => product.title.toLowerCase().includes(normalizedSearch));
  }

  if (featured) {
    products = products.filter((product) => product.featured);
  }

  if (availability === "in_stock") {
    products = products.filter((product) => Number(product.stock) > 0);
  }

  products = products.filter((product) => Number(product.price) >= minPrice && Number(product.price) <= maxPrice);
  products = sortProducts(products, sort);

  const total = products.length;
  const start = (page - 1) * pageSize;

  return {
    products: products.slice(start, start + pageSize),
    total,
  };
}

function buildCatalogHref({
  categorySlug,
  q,
  sort,
  page,
  category,
  price,
  availability,
  featured,
}: {
  categorySlug?: string;
  q?: string;
  sort?: string;
  page?: number;
  category?: string;
  price?: string;
  availability?: string;
  featured?: boolean;
}) {
  const params = new URLSearchParams();

  if (q) params.set("q", q);
  if (sort) params.set("sort", sort);
  if (page && page > 1) params.set("page", String(page));
  if (category) params.set("category", category);
  if (price) params.set("price", price);
  if (availability) params.set("availability", availability);
  if (featured) params.set("featured", "1");

  const basePath = categorySlug ? `/categories/${categorySlug}` : "/products";
  const queryString = params.toString();
  return queryString ? `${basePath}?${queryString}` : basePath;
}


async function CatalogContent({ searchParams, categorySlug, categories, isConfigured }: CatalogContentProps) {
  const params = await searchParams;
  const query = normalizeParam(params.q);
  const sort = normalizeParam(params.sort);
  const page = Number.parseInt(normalizeParam(params.page), 10) || 1;
  const category = normalizeParam(params.category);
  const { minPrice, maxPrice } = resolvePriceBounds(params);
  const price = normalizeParam(params.price) || resolvePriceParam(minPrice, maxPrice);
  const availability = normalizeParam(params.availability);
  const featured = normalizeParam(params.featured) === "1";
  const activeCategorySlug = categorySlug ?? category;
  const safePage = Number.isFinite(page) && page > 0 ? page : 1;

  let productsData: { products: ProductRow[]; total: number };

  try {
    productsData = isConfigured
      ? await getCatalogProducts({
          categorySlug: activeCategorySlug,
          search: query,
          sort,
          page: safePage,
          pageSize: PAGE_SIZE,
          minPrice,
          maxPrice,
          availability,
          featured,
        })
      : filterLocalCatalogProducts({
          categorySlug: activeCategorySlug,
          search: query,
          sort,
          page: safePage,
          pageSize: PAGE_SIZE,
          minPrice,
          maxPrice,
          availability,
          featured,
        });
  } catch {
    return <CatalogError />;
  }

  const totalPages = Math.max(1, Math.ceil(productsData.total / PAGE_SIZE));
  const currentPage = Math.min(safePage, totalPages);

  if (!productsData.products.length) {
    return (
      <div className="space-y-6">
        <EmptyState title="No products found" description="Try another search or broaden your filters." />
        <div className="flex justify-start">
          <Link href={categorySlug ? `/categories/${categorySlug}` : "/products"} className="text-sm font-medium text-blue-600 hover:text-blue-700">
            Clear filters
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-slate-600">
          Showing <span className="font-semibold text-slate-900">{productsData.products.length}</span> of <span className="font-semibold text-slate-900">{productsData.total}</span> products
        </p>
        <div className="flex flex-wrap gap-2">
          {query ? <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">{query}</span> : null}
          {activeCategorySlug ? <span className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700">{activeCategorySlug}</span> : null}
          {featured ? <span className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700">Featured only</span> : null}
          {price !== "0-500" ? <span className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700">Price: {price}</span> : null}
        </div>
      </div>

      <ProductGrid products={productsData.products as ProductRow[]} />

      <nav className="flex flex-wrap items-center justify-center gap-2" aria-label="Pagination">
        <Link
          href={buildCatalogHref({
            categorySlug: activeCategorySlug,
            q: query,
            sort,
            page: Math.max(1, currentPage - 1),
            category: activeCategorySlug,
            price,
            availability,
            featured,
          })}
          aria-disabled={currentPage <= 1}
          className={`rounded-full border px-4 py-2 text-sm font-medium ${currentPage <= 1 ? "pointer-events-none border-slate-200 text-slate-400" : "border-slate-200 text-slate-700 hover:border-blue-600 hover:text-blue-600"}`}
        >
          Previous
        </Link>

        {buildPageNumbers(currentPage, totalPages).map((pageNumber) => (
          <Link
            key={pageNumber}
            href={buildCatalogHref({
              categorySlug: activeCategorySlug,
              q: query,
              sort,
              page: pageNumber,
              category: activeCategorySlug,
              price,
              availability,
              featured,
            })}
            className={`rounded-full px-4 py-2 text-sm font-medium ${currentPage === pageNumber ? "bg-blue-600 text-white" : "border border-slate-200 text-slate-700 hover:border-blue-600 hover:text-blue-600"}`}
          >
            {pageNumber}
          </Link>
        ))}

        <Link
          href={buildCatalogHref({
            categorySlug: activeCategorySlug,
            q: query,
            sort,
            page: Math.min(totalPages, currentPage + 1),
            category: activeCategorySlug,
            price,
            availability,
            featured,
          })}
          aria-disabled={currentPage >= totalPages}
          className={`rounded-full border px-4 py-2 text-sm font-medium ${currentPage >= totalPages ? "pointer-events-none border-slate-200 text-slate-400" : "border-slate-200 text-slate-700 hover:border-blue-600 hover:text-blue-600"}`}
        >
          Next
        </Link>
      </nav>

      <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-base font-semibold text-slate-900">Browse by category</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {categories.map((item) => (
            <Link key={item.id} href={`/categories/${item.slug}`} className="rounded-full border border-slate-200 px-3 py-2 text-sm text-slate-700 hover:border-blue-600 hover:text-blue-600">
              {item.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default async function CatalogPage({ searchParams, categorySlug }: CatalogPageProps) {
  const params = await searchParams;
  const query = normalizeParam(params.q);
  const sort = normalizeParam(params.sort);
  const category = normalizeParam(params.category);
  const availability = normalizeParam(params.availability);
  const featured = normalizeParam(params.featured) === "1";
  const { minPrice, maxPrice } = resolvePriceBounds(params);
  const price = normalizeParam(params.price) || resolvePriceParam(minPrice, maxPrice);
  const { isConfigured } = getSupabaseEnv();
  const categories = isConfigured ? await getCategories() : fallbackCategories;

  return (
    <main className="flex-1 bg-slate-50">
      <section className="mx-auto max-w-7xl px-4 py-8 lg:px-8 lg:py-10">
        <div className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm lg:p-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">Catalog</p>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
                {categorySlug ? `Shop ${categorySlug.replace(/-/g, " ")}` : "Shop the collection"}
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
                Browse curated essentials, search for specific pieces, and refine the selection by category, price, and availability.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <CatalogSearch initialQuery={query} />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-4 pb-16 lg:grid-cols-[280px_minmax(0,1fr)] lg:px-8">
        <aside className="order-2 space-y-4 lg:order-1">
          <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4 text-blue-600" />
              <h2 className="text-base font-semibold text-slate-900">Filters</h2>
            </div>
            <form action={categorySlug ? `/categories/${categorySlug}` : "/products"} method="get" className="mt-4 space-y-4">
              <input type="hidden" name="q" value={query} />
              <input type="hidden" name="sort" value={sort} />
              <input type="hidden" name="page" value="1" />
              <div>
                <label className="text-sm font-medium text-slate-700" htmlFor="category-filter">
                  Category
                </label>
                <select id="category-filter" name="category" defaultValue={categorySlug ?? category} className="mt-2 h-11 w-full rounded-full border border-slate-200 bg-slate-50 px-4 text-sm outline-none">
                  <option value="">All categories</option>
                  {getCategoryOptions(categories)}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700" htmlFor="price-filter">
                  Price range
                </label>
                <select id="price-filter" name="price" defaultValue={price} className="mt-2 h-11 w-full rounded-full border border-slate-200 bg-slate-50 px-4 text-sm outline-none">
                  <option value="0-500">Under $500</option>
                  <option value="500-1000">$500 - $1,000</option>
                  <option value="1000-999999">$1,000+</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">Availability</label>
                <div className="mt-2 space-y-2 text-sm text-slate-600">
                  <label className="flex items-center gap-2">
                    <input type="radio" name="availability" value="in_stock" defaultChecked={availability === "in_stock"} />
                    In stock only
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="radio" name="availability" value="all" defaultChecked={availability !== "in_stock"} />
                    All products
                  </label>
                </div>
              </div>
              <label className="flex items-center gap-2 text-sm text-slate-700">
                <input type="checkbox" name="featured" value="1" defaultChecked={featured} />
                Featured products only
              </label>
              <div className="flex flex-wrap gap-2">
                <Button type="submit" size="sm">
                  Apply filters
                </Button>
                <Link href={categorySlug ? `/categories/${categorySlug}` : "/products"} className="inline-flex h-9 items-center justify-center rounded-full border border-slate-200 px-4 text-sm font-medium text-slate-700 hover:border-blue-600 hover:text-blue-600">
                  Reset
                </Link>
              </div>
            </form>
          </div>
        </aside>

        <div className="order-1 space-y-5 lg:order-2">
          <div className="flex flex-col gap-3 rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
              <Filter className="h-4 w-4 text-blue-600" />
              <span>Sort results</span>
            </div>
            <form action={categorySlug ? `/categories/${categorySlug}` : "/products"} method="get" className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <input type="hidden" name="q" value={query} />
              <input type="hidden" name="category" value={category || categorySlug || ""} />
              <input type="hidden" name="page" value="1" />
              <input type="hidden" name="price" value={price} />
              <input type="hidden" name="availability" value={availability} />
              <input type="hidden" name="featured" value={featured ? "1" : ""} />
              <select name="sort" defaultValue={sort} className="h-11 rounded-full border border-slate-200 bg-slate-50 px-4 text-sm outline-none">
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <Button type="submit" size="sm">
                Apply
              </Button>
            </form>
          </div>

          <Suspense fallback={<LoadingSkeleton count={4} />}>
            <CatalogContent searchParams={searchParams} categorySlug={categorySlug} categories={categories} isConfigured={isConfigured} />
          </Suspense>
        </div>
      </section>
    </main>
  );
}

function getCategoryOptions(categories: CategoryRow[]) {
  return categories.map((category) => (
    <option key={category.id} value={category.slug}>
      {category.name}
    </option>
  ));
}
