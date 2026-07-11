'use client';

import { Bell, BellOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useStockNotification } from '@/features/products/hooks/use-stock-notification';

interface StockNotificationButtonProps {
  productId: string;
}

export function StockNotificationButton({ productId }: StockNotificationButtonProps) {
  const { subscribed, loading, toggle } = useStockNotification(productId);

  return (
    <Button
      variant={subscribed ? 'secondary' : 'ghost'}
      size="sm"
      onClick={toggle}
      disabled={loading}
      className="gap-2"
      aria-label={subscribed ? 'Cancel stock notification' : 'Notify me when back in stock'}
    >
      {subscribed ? <BellOff className="h-4 w-4" /> : <Bell className="h-4 w-4" />}
      {subscribed ? 'Cancel Notification' : 'Notify Me When Available'}
    </Button>
  );
}
