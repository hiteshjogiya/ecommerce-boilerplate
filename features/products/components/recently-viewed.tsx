"use client";

import Image from "next/image";
import Link from "next/link";
import { useRecentlyViewed } from "@/features/products/hooks/use-recently-viewed";
import type { ProductDetailRecord } from "@/src/lib/product-detail";

interface RecentlyViewedProductsProps {
  currentProduct: ProductDetailRecord;
}

export function RecentlyViewedProducts({ currentProduct }: RecentlyViewedProductsProps) {
  const items = useRecentlyViewed(currentProduct).filter((item) => item.slug !== currentProduct.slug);

  if (!items.length) {
    return null;
  }

  return (
    <section className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">Recently viewed</p>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">Continue browsing</h2>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {items.map((item) => (
          <Link key={item.slug} href={`/products/${item.slug}`} className="group overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
            <div className="relative h-44 overflow-hidden">
              <Image src={item.thumbnail ?? "/window.svg"} alt={item.title} fill sizes="(max-width: 768px) 100vw, 20vw" className="object-cover transition duration-500 group-hover:scale-105" />
            </div>
            <div className="p-4">
              <h3 className="text-sm font-semibold text-slate-900">{item.title}</h3>
              <p className="mt-1 text-sm text-slate-600">${item.price.toFixed(2)}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
