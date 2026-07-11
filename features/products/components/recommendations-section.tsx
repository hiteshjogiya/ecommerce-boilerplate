'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { StarRating } from '@/components/ui/star-rating';
import { useRecommendations } from '@/features/products/hooks/use-recommendations';
import type { Database } from '@/src/types/database';

type ProductRow = Database["public"]["Tables"]["products"]["Row"];

function RecommendationCard({ product }: { product: ProductRow }) {
  return (
    <Link
      href={`/products/${product.slug}`}
      className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="relative h-44 overflow-hidden bg-slate-100">
        {product.thumbnail ? (
          <Image src={product.thumbnail} alt={product.title} fill sizes="(max-width: 768px) 100vw, 20vw" className="object-cover transition duration-500 group-hover:scale-105" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-slate-300">
            <span className="text-4xl">📦</span>
          </div>
        )}
      </div>
      <div className="p-4 space-y-1">
        <h3 className="text-sm font-semibold text-slate-900 line-clamp-2">{product.title}</h3>
        <StarRating rating={0} size="sm" />
        <p className="text-sm font-bold text-slate-900">${product.price.toFixed(2)}</p>
      </div>
    </Link>
  );
}

export function RecommendationsSection({ productId, categoryId }: { productId: string; categoryId: string }) {
  const { similar, boughtTogether, loading, fetchRecommendations } = useRecommendations(productId, categoryId);

  useEffect(() => {
    fetchRecommendations();
  }, [fetchRecommendations]);

  if (loading) {
    return (
      <section className="space-y-4">
        <div className="h-6 w-48 bg-slate-100 rounded animate-pulse" />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-52 rounded-2xl bg-slate-100 animate-pulse" />
          ))}
        </div>
      </section>
    );
  }

  if (similar.length === 0 && boughtTogether.length === 0) return null;

  return (
    <div className="space-y-10">
      {similar.length > 0 && (
        <section className="space-y-6" aria-label="Similar products">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">You might also like</p>
            <h2 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">Similar Products</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {similar.slice(0, 5).map((p) => <RecommendationCard key={p.id} product={p} />)}
          </div>
        </section>
      )}

      {boughtTogether.length > 0 && (
        <section className="space-y-6" aria-label="Frequently bought together">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-purple-600">Customers also bought</p>
            <h2 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">Frequently Bought Together</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {boughtTogether.slice(0, 4).map((p) => <RecommendationCard key={p.id} product={p} />)}
          </div>
        </section>
      )}
    </div>
  );
}
