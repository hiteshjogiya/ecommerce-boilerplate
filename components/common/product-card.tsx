"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingBag, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Product } from "@/types/product";
import { WishlistToggleButton } from "@/features/wishlist/components/wishlist-toggle-button";
import { getImageProps } from "@/src/lib/image";

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
}

export function ProductCard({
  product,
  onAddToCart = () => undefined,
}: ProductCardProps) {
  const href = product.href ?? (product.slug ? `/products/${product.slug}` : undefined);
  const roundedRating = Math.round(product.rating ?? 0);
  const imageProps = getImageProps(product.image);

  return (
    <article className={`group relative overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg ${href ? "cursor-pointer" : ""}`}>
      {href ? <Link href={href} aria-label={`View ${product.name}`} className="absolute inset-0 z-20 block focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2" /> : null}
      <div className="relative h-56 overflow-hidden">
        {product.badge ? (
          <span className="absolute left-4 top-4 z-10 rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white">
            {product.badge}
          </span>
        ) : null}
        <WishlistToggleButton
          product={{
            id: product.id,
            slug: product.slug ?? "",
            title: product.name,
            description: product.description,
            price: product.price,
            compare_price: product.originalPrice ?? null,
            thumbnail: product.image,
            stock: 1,
            active: true,
          }}
          className="absolute right-4 top-4 z-30"
          label={`Toggle wishlist for ${product.name}`}
        />
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, 25vw"
          className="object-cover transition duration-500 group-hover:scale-105"
          {...imageProps}
        />
      </div>
      <div className="relative z-10 space-y-4 p-6">
        <div className="space-y-2">
          <div className="space-y-2">
          <div className="flex items-center gap-1 text-amber-500">
            {Array.from({ length: 5 }).map((_, index) => (
              <Star
                key={`${product.id}-${index}`}
                className={`h-4 w-4 ${index < roundedRating ? "fill-current" : "fill-none text-slate-300"}`}
              />
            ))}
            <span className="ml-2 text-sm text-slate-500">{(product.rating ?? 0).toFixed(1)} ({product.reviews})</span>
          </div>
          <h3 className="text-lg font-semibold text-slate-900">{product.name}</h3>
          <p className="text-sm leading-6 text-slate-600">{product.description}</p>
          </div>
        </div>
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-lg font-semibold text-slate-900">${product.price.toFixed(2)}</p>
            {product.originalPrice ? (
              <p className="text-sm text-slate-400 line-through">${product.originalPrice.toFixed(2)}</p>
            ) : null}
          </div>
          <Button variant="secondary" size="sm" onClick={() => onAddToCart(product)}>
            <ShoppingBag className="mr-2 h-4 w-4" />
            Add
          </Button>
        </div>
      </div>
    </article>
  );
}
