'use client';

import { useState } from 'react';
import { Tag, X, Loader } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCoupon } from '@/features/checkout/hooks/use-coupon';

interface CouponInputProps {
  orderTotal: number;
  onDiscountChange: (discount: number, couponCode?: string) => void;
}

export function CouponInput({ orderTotal, onDiscountChange }: CouponInputProps) {
  const [input, setInput] = useState('');
  const { code, coupon, discount, loading, error, applyCode, removeCoupon } = useCoupon();

  const handleApply = async () => {
    if (!input.trim()) return;
    const success = await applyCode(input.trim(), orderTotal);
    if (success) {
      onDiscountChange(discount, input.trim().toUpperCase());
    }
  };

  const handleRemove = () => {
    removeCoupon();
    setInput('');
    onDiscountChange(0);
  };

  if (code && coupon) {
    return (
      <div className="flex items-center justify-between p-3 rounded-lg bg-green-50 border border-green-200">
        <div className="flex items-center gap-2">
          <Tag className="h-4 w-4 text-green-600" />
          <div>
            <p className="text-sm font-medium text-green-800">{code} applied</p>
            <p className="text-xs text-green-600">
              {coupon.description || `${coupon.discount_type === 'percentage' ? `${coupon.discount_value}%` : `$${coupon.discount_value}`} off`}
              {' — '}
              <span className="font-semibold">-${discount.toFixed(2)}</span>
            </p>
          </div>
        </div>
        <button onClick={handleRemove} className="text-green-600 hover:text-green-800 transition-colors" aria-label="Remove coupon">
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value.toUpperCase())}
            onKeyDown={(e) => e.key === 'Enter' && handleApply()}
            placeholder="Coupon code"
            className="w-full rounded-lg border border-slate-200 pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 uppercase"
            aria-label="Coupon code"
          />
        </div>
        <Button size="sm" onClick={handleApply} disabled={loading || !input.trim()} className="shrink-0 gap-1.5">
          {loading ? <Loader className="h-3.5 w-3.5 animate-spin" /> : null}
          Apply
        </Button>
      </div>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
