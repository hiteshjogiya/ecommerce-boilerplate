import Link from "next/link";
import { ArrowRight, Mail, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getCategories } from "@/src/services/category.service";
import { getFeaturedProducts, getProducts } from "@/src/services/product.service";
import { SectionHeading } from "@/features/home/components/section-heading";
import { CategoryGrid } from "@/features/home/components/category-grid";
import { ProductGrid } from "@/features/home/components/product-grid";
import { EmptyState } from "@/features/home/components/empty-state";
import { LoadingSkeleton } from "@/features/home/components/loading-skeleton";
import { Suspense } from "react";
import { getSupabaseEnv } from "@/src/lib/supabase/env";
import type { CategoryRow } from "@/src/services/category.service";
import type { ProductRow } from "@/src/services/product.service";

const fallbackCategories: CategoryRow[] = [
  { id: "cat-1", name: "Everyday Essentials", slug: "everyday-essentials", image: "/window.svg" } as CategoryRow,
  { id: "cat-2", name: "Weekend Layers", slug: "weekend-layers", image: "/globe.svg" } as CategoryRow,
  { id: "cat-3", name: "Signature Accessories", slug: "signature-accessories", image: "/vercel.svg" } as CategoryRow,
];

const fallbackFeaturedProducts: ProductRow[] = [
  { id: "prod-1", slug: "aero-shell-jacket", title: "Aero Shell Jacket", description: "Weather-ready shell with a tailored, lightweight finish.", price: 189, compare_price: 240, thumbnail: "/window.svg", stock: 12 } as ProductRow,
  { id: "prod-2", slug: "contour-tote", title: "Contour Tote", description: "A structured carryall designed for everyday practicality.", price: 98, compare_price: 128, thumbnail: "/globe.svg", stock: 8 } as ProductRow,
  { id: "prod-3", slug: "lumen-knit-set", title: "Lumen Knit Set", description: "Soft knit layers with a premium hand-feel.", price: 156, compare_price: 198, thumbnail: "/vercel.svg", stock: 6 } as ProductRow,
  { id: "prod-4", slug: "studio-loafers", title: "Studio Loafers", description: "Comfort-first form with a polished, sculptural profile.", price: 132, compare_price: 154, thumbnail: "/next.svg", stock: 10 } as ProductRow,
];

const fallbackNewArrivals: ProductRow[] = [
  { id: "prod-5", slug: "sculpted-tote", title: "Sculpted Tote", description: "Minimal lines and a polished finish for daily carry.", price: 112, compare_price: 140, thumbnail: "/window.svg", stock: 7 } as ProductRow,
  { id: "prod-6", slug: "cloud-knit-cardigan", title: "Cloud Knit Cardigan", description: "Soft texture and relaxed shape for effortless layering.", price: 94, compare_price: 118, thumbnail: "/globe.svg", stock: 5 } as ProductRow,
  { id: "prod-7", slug: "orbit-sunglasses", title: "Orbit Sunglasses", description: "Refined silhouettes with a lightweight feel.", price: 72, compare_price: 90, thumbnail: "/vercel.svg", stock: 9 } as ProductRow,
  { id: "prod-8", slug: "studio-scarf", title: "Studio Scarf", description: "A tactile finishing piece designed for cooler days.", price: 58, compare_price: 74, thumbnail: "/next.svg", stock: 11 } as ProductRow,
];

async function CategoriesSection() {
  const { isConfigured } = getSupabaseEnv();
  const categories = isConfigured ? await getCategories() : fallbackCategories;

  if (!categories.length) {
    return <EmptyState title="No categories available" description="Categories will appear here as soon as they’re added." />;
  }

  return <CategoryGrid categories={categories} />;
}

async function FeaturedProductsSection() {
  const { isConfigured } = getSupabaseEnv();
  const featuredProducts = isConfigured ? await getFeaturedProducts(8) : fallbackFeaturedProducts;

  if (!featuredProducts.length) {
    return <EmptyState title="No featured products yet" description="Featured products will appear here as soon as they’re added." />;
  }

  return <ProductGrid products={featuredProducts} />;
}

async function NewArrivalsSection() {
  const { isConfigured } = getSupabaseEnv();
  const newArrivals = isConfigured ? await getProducts({ limit: 8 }) : fallbackNewArrivals;

  if (!newArrivals.length) {
    return <EmptyState title="No new arrivals yet" description="New arrivals will appear here as soon as they’re published." />;
  }

  return <ProductGrid products={newArrivals} />;
}

export default async function HomePage() {
  return (
    <main className="flex-1 bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.12),_transparent_30%),linear-gradient(180deg,_#f8fafc_0%,_#f8fafc_100%)]">
      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-24">
        <div className="flex flex-col justify-center">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">
            <Sparkles className="h-4 w-4" />
            New collection is live
          </div>
          <h1 className="mt-6 text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
            Elevate your everyday with premium essentials.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
            Discover refined apparel, accessories, and home pieces crafted for effortless modern living.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button size="lg">Shop collection</Button>
            <Button variant="ghost" size="lg" className="border border-slate-200">
              Explore lookbook
            </Button>
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            {['Free shipping', 'Verified quality', 'New arrivals'].map((item) => (
              <span key={item} className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm">
                {item}
              </span>
            ))}
          </div>
        </div>

        <div className="rounded-[32px] border border-slate-200 bg-slate-900 p-6 text-white shadow-[0_30px_80px_-30px_rgba(15,23,42,0.65)] sm:p-8">
          <div className="rounded-[24px] border border-white/10 bg-white/10 p-6 backdrop-blur">
            <p className="text-sm font-medium uppercase tracking-[0.25em] text-slate-300">Editor&apos;s pick</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight">The signature edit.</h2>
            <p className="mt-4 max-w-md text-sm leading-7 text-slate-300">
              Clean lines, thoughtful details, and versatile layers designed to move from day to night.
            </p>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
                <p className="text-sm text-slate-300">Free express delivery</p>
                <p className="mt-2 text-xl font-semibold">24h dispatch</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
                <p className="text-sm text-slate-300">Curated quality</p>
                <p className="mt-2 text-xl font-semibold">Verified pieces</p>
              </div>
            </div>
            <div className="mt-8 flex items-center gap-3 text-sm font-medium text-slate-200">
              <span>Shop best sellers</span>
              <ArrowRight className="h-4 w-4" />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
        <SectionHeading eyebrow="Featured categories" title="Built for everyday living" action={<Link href="/categories" className="text-sm font-medium text-slate-700 hover:text-blue-600">View all</Link>} />
        <Suspense fallback={<LoadingSkeleton count={3} />}>
          <CategoriesSection />
        </Suspense>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
        <SectionHeading eyebrow="Featured products" title="The essentials everyone is loving" action={<Link href="/products" className="text-sm font-medium text-slate-700 hover:text-blue-600">Browse all</Link>} />
        <Suspense fallback={<LoadingSkeleton count={4} />}>
          <FeaturedProductsSection />
        </Suspense>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
        <SectionHeading eyebrow="New arrivals" title="Fresh drops for the season" action={<Link href="/products" className="text-sm font-medium text-slate-700 hover:text-blue-600">Explore more</Link>} />
        <Suspense fallback={<LoadingSkeleton count={4} />}>
          <NewArrivalsSection />
        </Suspense>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16 lg:px-8">
        <div className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm sm:p-10 lg:p-12">
          <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">Stay in the loop</p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">Join our newsletter</h2>
              <p className="mt-3 max-w-lg text-sm leading-7 text-slate-600">Receive first access to launches, offers, and style inspiration.</p>
            </div>
            <form className="flex flex-col gap-3 sm:flex-row" noValidate>
              <label className="sr-only" htmlFor="newsletter-email">Email address</label>
              <div className="relative flex-1">
                <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input id="newsletter-email" name="email" type="email" placeholder="Email address" className="h-12 w-full rounded-full border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm text-slate-900 outline-none transition focus:border-blue-600" />
              </div>
              <Button type="submit" className="h-12">Subscribe</Button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}
