'use client';

import { useState, useCallback, useEffect } from 'react';

export function useStockNotification(productId: string) {
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch(`/api/stock-notifications?productId=${productId}`)
      .then((r) => r.json())
      .then((d) => setSubscribed(d.subscribed ?? false))
      .catch(() => {/* ignore */});
  }, [productId]);

  const toggle = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/stock-notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, action: subscribed ? 'unsubscribe' : 'subscribe' }),
      });
      const data = await res.json();
      if (res.ok) setSubscribed(data.subscribed);
    } finally {
      setLoading(false);
    }
  }, [productId, subscribed]);

  return { subscribed, loading, toggle };
}
