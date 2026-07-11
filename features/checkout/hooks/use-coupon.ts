'use client';

import { useState, useCallback } from 'react';
import type { Database } from '@/src/types/database';

type CouponRow = Database['public']['Tables']['coupons']['Row'];

interface CouponState {
  code: string;
  coupon: CouponRow | null;
  discount: number;
  loading: boolean;
  error: string | null;
}

export function useCoupon() {
  const [state, setState] = useState<CouponState>({
    code: '',
    coupon: null,
    discount: 0,
    loading: false,
    error: null,
  });

  const applyCode = useCallback(async (code: string, orderTotal: number) => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, orderTotal }),
      });
      const data = await res.json();
      if (!res.ok) {
        setState((prev) => ({ ...prev, loading: false, error: data.error || 'Invalid coupon' }));
        return false;
      }
      setState({ code: code.toUpperCase(), coupon: data.coupon, discount: data.discount, loading: false, error: null });
      return true;
    } catch {
      setState((prev) => ({ ...prev, loading: false, error: 'Failed to apply coupon' }));
      return false;
    }
  }, []);

  const removeCoupon = useCallback(() => {
    setState({ code: '', coupon: null, discount: 0, loading: false, error: null });
  }, []);

  return { ...state, applyCode, removeCoupon };
}
