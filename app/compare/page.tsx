'use client';

import Image from 'next/image';
import Link from 'next/link';
import { X, ShoppingBag } from 'lucide-react';
import { MainShell } from '@/components/layout/main-shell';
import { Container } from '@/components/ui/container';
import { Button } from '@/components/ui/button';
import { StarRating } from '@/components/ui/star-rating';
import { useCompareStore } from '@/store/compare-store';

const COMPARE_ATTRIBUTES: Array<{ label: string; key: string; format?: (v: unknown) => string }> = [
  { label: 'Price', key: 'price', format: (v) => `$${(v as number).toFixed(2)}` },
  { label: 'Compare Price', key: 'compare_price', format: (v) => v ? `$${(v as number).toFixed(2)}` : '-' },
  { label: 'Stock', key: 'stock', format: (v) => (v as number) > 0 ? `${v as number} in stock` : 'Out of stock' },
  { label: 'Status', key: 'active', format: (v) => v ? 'Active' : 'Inactive' },
  { label: 'Featured', key: 'featured', format: (v) => v ? 'Yes' : 'No' },
];

export default function ComparePage() {
  const { products, removeProduct, clearAll } = useCompareStore();

  return (
    <MainShell>
      <Container className="py-10 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Compare Products</h1>
            <p className="text-slate-500 mt-1">{products.length} product{products.length !== 1 ? 's' : ''} selected (max 4)</p>
          </div>
          {products.length > 0 && (
            <Button variant="ghost" size="sm" onClick={clearAll}>Clear All</Button>
          )}
        </div>

        {products.length === 0 ? (
          <div className="py-24 text-center space-y-4">
            <p className="text-2xl text-slate-300">📊</p>
            <p className="text-lg font-medium text-slate-600">No products to compare</p>
            <p className="text-sm text-slate-400">Browse products and click &quot;Compare&quot; to add them here</p>
            <Link href="/products">
              <Button>Browse Products</Button>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse" role="table" aria-label="Product comparison">
              <thead>
                <tr>
                  <th className="text-left p-3 text-sm font-medium text-slate-500 w-40 min-w-32">Attribute</th>
                  {products.map((product) => (
                    <th key={product.id} className="p-3 min-w-48">
                      <div className="space-y-3">
                        <div className="relative h-40 bg-slate-100 rounded-xl overflow-hidden">
                          {product.thumbnail ? (
                            <Image src={product.thumbnail} alt={product.title} fill sizes="200px" className="object-cover" />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center text-4xl text-slate-300">📦</div>
                          )}
                          <button
                            onClick={() => removeProduct(product.id)}
                            className="absolute top-2 right-2 bg-white rounded-full p-1 shadow hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors"
                            aria-label={`Remove ${product.title} from comparison`}
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <Link href={`/products/${product.slug}`} className="text-sm font-semibold text-slate-900 hover:text-blue-600 transition-colors line-clamp-2 block text-left">
                          {product.title}
                        </Link>
                        <StarRating rating={0} size="sm" />
                      </div>
                    </th>
                  ))}
                  {/* Empty slots */}
                  {Array.from({ length: Math.max(0, 4 - products.length) }).map((_, i) => (
                    <th key={`empty-${i}`} className="p-3 min-w-48">
                      <div className="h-40 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200 flex items-center justify-center">
                        <Link href="/products" className="text-sm text-slate-400 hover:text-blue-600 transition-colors text-center">
                          + Add product<br /><span className="text-xs">to compare</span>
                        </Link>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COMPARE_ATTRIBUTES.map((attr, idx) => (
                  <tr key={attr.key} className={idx % 2 === 0 ? 'bg-slate-50' : 'bg-white'}>
                    <td className="p-3 text-sm font-medium text-slate-600">{attr.label}</td>
                    {products.map((product) => {
                      const val = product[attr.key as keyof typeof product];
                      const formatted = attr.format ? attr.format(val) : String(val ?? '-');
                      return (
                        <td key={product.id} className="p-3 text-sm text-slate-700 text-center">
                          {formatted}
                        </td>
                      );
                    })}
                    {Array.from({ length: Math.max(0, 4 - products.length) }).map((_, i) => (
                      <td key={`empty-${i}`} className="p-3" />
                    ))}
                  </tr>
                ))}
                {/* Add to cart row */}
                <tr className="border-t border-slate-200">
                  <td className="p-3 text-sm font-medium text-slate-600">Action</td>
                  {products.map((product) => (
                    <td key={product.id} className="p-3 text-center">
                      <Link href={`/products/${product.slug}`}>
                        <Button size="sm" className="gap-1.5">
                          <ShoppingBag className="h-3.5 w-3.5" />
                          View Product
                        </Button>
                      </Link>
                    </td>
                  ))}
                  {Array.from({ length: Math.max(0, 4 - products.length) }).map((_, i) => (
                    <td key={`empty-${i}`} className="p-3" />
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </Container>
    </MainShell>
  );
}
