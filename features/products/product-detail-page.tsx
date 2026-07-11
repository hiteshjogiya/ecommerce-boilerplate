import Link from "next/link";
import dynamic from "next/dynamic";
import { notFound } from "next/navigation";
import { ChevronRight, Info, Package, Truck } from "lucide-react";
import { EmptyState } from "@/features/home/components/empty-state";
import { ProductCard } from "@/components/common/product-card";
import { JsonLd } from "@/components/seo/json-ld";
import { getSupabaseEnv } from "@/src/lib/supabase/env";
import { getProductBySlug, getProductsByCategory } from "@/src/services/product.service";
import { getProductRatingSummaries } from "@/src/services/review.service";
import { fallbackCategories, findFallbackProductBySlug, getFallbackCategoryBySlug, getFallbackProductsByCategoryId } from "@/src/constants/catalog-fallback";
import { buildProductGalleryImages, formatCurrency, getDiscountPercentage, getProductCategoryName, getProductCategorySlug, isValidProductSlug, type ProductDetailRecord } from "@/src/lib/product-detail";
import { ProductImageGallery } from "@/features/products/components/product-image-gallery";
import { AddToCartSection } from "@/features/products/components/add-to-cart-section";
import { ProductBreadcrumbs } from "@/features/products/components/product-breadcrumbs";
import { ProductShareButton } from "@/features/products/components/product-share-button";
import { StockNotificationButton } from "@/features/products/components/stock-notification-button";
import { CompareButton } from "@/features/products/components/compare-button";
import { absoluteUrl, buildBreadcrumbJsonLd, buildProductJsonLd } from "@/src/lib/seo";

const RecentlyViewedProducts = dynamic(() => import("@/features/products/components/recently-viewed").then((mod) => mod.RecentlyViewedProducts));
const RecommendationsSection = dynamic(() => import("@/features/products/components/recommendations-section").then((mod) => mod.RecommendationsSection));
const ReviewSection = dynamic(() => import("@/features/products/components/review-section").then((mod) => mod.ReviewSection));

interface ProductDetailPageProps {
  slug: string;
}

interface ProductDetailSectionProps {
  product: ProductDetailRecord;
  relatedProducts: ProductDetailRecord[];
}

function getStockLabel(stock: number) {
  if (stock > 10) {
    return "In stock";
  }

  if (stock > 0) {
    return `Only ${stock} left`;
  }

  return "Out of stock";
}

async function loadProductData(slug: string) {
  const { isConfigured } = getSupabaseEnv();

  if (!isValidProductSlug(slug)) {
    notFound();
  }

  if (!isConfigured) {
    const fallbackProduct = findFallbackProductBySlug(slug);

    if (!fallbackProduct) {
      notFound();
    }

    const fallbackCategory = fallbackCategories.find((category) => category.id === fallbackProduct.category_id) ?? getFallbackCategoryBySlug("everyday-essentials");
    const relatedFallbackProducts = fallbackCategory ? getFallbackProductsByCategoryId(fallbackCategory.id, fallbackProduct.id, 4) : [];

    return {
      product: {
        ...fallbackProduct,
        categories: fallbackCategory ?? null,
      } as ProductDetailRecord,
      relatedProducts: relatedFallbackProducts.map((item) => ({
        ...item,
        categories: fallbackCategory ?? null,
      } as ProductDetailRecord)),
    };
  }

  const product = (await getProductBySlug(slug)) as ProductDetailRecord | null;

  if (!product) {
    notFound();
  }

  let relatedProducts: ProductDetailRecord[] = [];
  try {
    relatedProducts = (await getProductsByCategory(product.category_id, 5))
      .filter((item) => item.id !== product.id)
      .map((item) => ({ ...item, categories: product.categories ?? null })) as ProductDetailRecord[];
  } catch {
    relatedProducts = [];
  }

  return { product, relatedProducts };
}

async function ProductDetailSection({ product, relatedProducts }: ProductDetailSectionProps) {
  const galleryImages = buildProductGalleryImages(product);
  const categoryName = getProductCategoryName(product);
  const categorySlug = getProductCategorySlug(product);
  const discount = getDiscountPercentage(Number(product.price), product.compare_price);
  const stockLabel = getStockLabel(Number(product.stock));
  const fullDescription = product.full_description ?? product.description;
  const sku = product.sku ?? null;
  const relatedRatingSummaries = await getProductRatingSummaries(relatedProducts.map((item) => item.id));
  const productUrl = absoluteUrl(`/products/${product.slug}`);
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", url: absoluteUrl("/") },
    { name: "Products", url: absoluteUrl("/products") },
    { name: categoryName, url: categorySlug ? absoluteUrl(`/categories/${categorySlug}`) : absoluteUrl("/products") },
    { name: product.title, url: productUrl },
  ]);
  const productJsonLd = buildProductJsonLd({
    name: product.title,
    description: product.description,
    image: product.thumbnail ?? "/window.svg",
    sku,
    price: Number(product.price),
    availability: Number(product.stock) > 0 ? "InStock" : "OutOfStock",
    url: productUrl,
    category: categoryName,
  });

  return (
    <article className="space-y-10">
      <JsonLd id={`breadcrumb-product-${product.id}`} data={breadcrumbJsonLd} />
      <JsonLd id={`product-jsonld-${product.id}`} data={productJsonLd} />
      <ProductBreadcrumbs categoryName={categoryName} categorySlug={categorySlug} productName={product.title} />

      <section className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
        <ProductImageGallery images={galleryImages} title={product.title} />

        <div className="space-y-6 rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm lg:p-8">
          <div className="space-y-3">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">{categoryName}</p>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">{product.title}</h1>
            <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600">
              <span className="rounded-full bg-slate-100 px-3 py-1 font-medium text-slate-700">{stockLabel}</span>
              {sku ? <span className="rounded-full bg-slate-100 px-3 py-1 font-medium text-slate-700">SKU {sku}</span> : null}
              {discount > 0 ? <span className="rounded-full bg-blue-50 px-3 py-1 font-medium text-blue-700">Save {discount}%</span> : null}
            </div>
          </div>

          <div className="space-y-2 border-y border-slate-200 py-6">
            <div className="flex items-end gap-3">
              <p className="text-3xl font-semibold text-slate-900">{formatCurrency(Number(product.price))}</p>
              {product.compare_price ? <p className="pb-1 text-lg text-slate-400 line-through">{formatCurrency(Number(product.compare_price))}</p> : null}
            </div>
            <p className="text-sm leading-7 text-slate-600">{product.description}</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                <Package className="h-4 w-4 text-blue-600" />
                Stock status
              </div>
              <p className="mt-2 text-sm text-slate-600">{stockLabel}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                <Truck className="h-4 w-4 text-blue-600" />
                Delivery
              </div>
              <p className="mt-2 text-sm text-slate-600">Fast shipping and easy returns available.</p>
            </div>
          </div>

          <AddToCartSection product={product} />

          {product.stock === 0 && (
            <StockNotificationButton productId={product.id} />
          )}

          <div className="flex flex-wrap gap-2">
            <ProductShareButton title={product.title} slug={product.slug} />
            <CompareButton product={product} />
          </div>

          <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
              <Info className="h-4 w-4 text-blue-600" />
              Product details
            </div>
            <div className="mt-4 space-y-4 text-sm leading-7 text-slate-600">
              <p>{fullDescription}</p>
              <p>
                Category: <span className="font-medium text-slate-900">{categoryName}</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {relatedProducts.length ? (
        <section className="space-y-6">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">Related products</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">More from this category</h2>
            </div>
            {categorySlug ? (
              <Link href={`/categories/${categorySlug}`} className="text-sm font-medium text-slate-700 hover:text-blue-600">
                View category <ChevronRight className="inline-block h-4 w-4" />
              </Link>
            ) : null}
          </div>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {relatedProducts.slice(0, 4).map((item) => (
              <ProductCard
                key={item.id}
                product={{
                  id: item.id,
                  slug: item.slug,
                  name: item.title,
                  description: item.description,
                  price: Number(item.price),
                  originalPrice: item.compare_price ? Number(item.compare_price) : undefined,
                  image: item.thumbnail ?? "/window.svg",
                  badge: item.featured ? "Featured" : undefined,
                  rating: relatedRatingSummaries[item.id]?.average ?? 0,
                  reviews: relatedRatingSummaries[item.id]?.count ?? 0,
                  href: `/products/${item.slug}`,
                }}
              />
            ))}
          </div>
        </section>
      ) : (
        <EmptyState title="No related products yet" description="Related products will appear once more products are available in this category." />
      )}

      <RecentlyViewedProducts currentProduct={product} />

      <RecommendationsSection productId={product.id} categoryId={product.category_id} />

      <ReviewSection productId={product.id} />
    </article>
  );
}

export default async function ProductDetailPage({ slug }: ProductDetailPageProps) {
  const data = await loadProductData(slug);

  return (
    <main className="flex-1 bg-slate-50">
      <section className="mx-auto max-w-7xl px-4 py-8 lg:px-8 lg:py-10">
        <ProductDetailSection product={data.product} relatedProducts={data.relatedProducts} />
      </section>
    </main>
  );
}
