'use client';

import { BarChart2, X } from 'lucide-react';
import Link from 'next/link';
import { useCompareStore } from '@/store/compare-store';
import type { Database } from '@/src/types/database';

type ProductRow = Database["public"]["Tables"]["products"]["Row"];

interface CompareButtonProps {
  product: ProductRow;
  className?: string;
}

export function CompareButton({ product, className = '' }: CompareButtonProps) {
  const { addProduct, removeProduct, isInCompare } = useCompareStore();
  const inCompare = isInCompare(product.id);
  const { products } = useCompareStore();

  const handleToggle = () => {
    if (inCompare) {
      removeProduct(product.id);
    } else if (products.length < 4) {
      addProduct(product);
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={!inCompare && products.length >= 4}
      className={`flex items-center gap-1.5 text-xs font-medium transition-colors ${
        inCompare
          ? 'text-blue-600 hover:text-blue-800'
          : 'text-slate-500 hover:text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed'
      } ${className}`}
      aria-label={inCompare ? 'Remove from comparison' : 'Add to comparison'}
      aria-pressed={inCompare}
    >
      <BarChart2 className="h-3.5 w-3.5" />
      {inCompare ? 'Remove' : 'Compare'}
    </button>
  );
}

export function CompareBar() {
  const { products, removeProduct, clearAll } = useCompareStore();

  if (products.length === 0) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-200 shadow-lg px-4 py-3"
      role="region"
      aria-label="Product comparison bar"
    >
      <div className="max-w-6xl mx-auto flex items-center gap-4 flex-wrap">
        <span className="text-sm font-medium text-slate-700 shrink-0">
          Compare ({products.length}/4)
        </span>
        <div className="flex-1 flex flex-wrap gap-2">
          {products.map((p) => (
            <div key={p.id} className="flex items-center gap-1.5 bg-slate-100 rounded-full px-3 py-1 text-sm">
              <span className="truncate max-w-32">{p.title}</span>
              <button
                onClick={() => removeProduct(p.id)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
                aria-label={`Remove ${p.title} from comparison`}
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={clearAll}
            className="text-sm text-slate-500 hover:text-slate-700 transition-colors"
          >
            Clear
          </button>
          {products.length >= 2 && (
            <Link
              href="/compare"
              className="text-sm font-medium bg-blue-600 text-white px-4 py-1.5 rounded-full hover:bg-blue-700 transition-colors"
            >
              Compare Now
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
