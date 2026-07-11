"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/toast";
import { placeOrder } from "@/src/services/order.service";
import { useCartStore } from "@/store/cart-store";
import type { CheckoutValues } from "@/features/checkout/schemas/checkout-schema";
import type { ShippingMethod } from "@/features/checkout/constants";

function getErrorMessage(error: unknown, fallback: string) {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
}

export function usePlaceOrder() {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitOrder = useCallback(
    async (values: CheckoutValues, shippingMethod: ShippingMethod, tax: number, discount: number) => {
      if (isSubmitting) {
        return { success: false as const, message: "Order submission is already in progress." };
      }

      setIsSubmitting(true);
      setError(null);

      try {
        const result = await placeOrder({
          addressId: values.addressId,
          shippingMethod: shippingMethod.name,
          shippingCost: shippingMethod.price,
          tax,
          discount,
        });

        const store = useCartStore.getState();
        store.setItems([]);
        store.setError(null);

        toast({ title: "Order placed", description: `Order ${result.orderNumber} was placed successfully.`, variant: "success" });
        router.push(`/order/success?orderNumber=${encodeURIComponent(result.orderNumber)}`);
        return { success: true as const, orderNumber: result.orderNumber };
      } catch (error) {
        const message = getErrorMessage(error, "Your order could not be completed.");
        setError(message);
        toast({ title: "Checkout error", description: message, variant: "error" });
        return { success: false as const, message };
      } finally {
        setIsSubmitting(false);
      }
    },
    [isSubmitting, router, toast],
  );

  return {
    isSubmitting,
    error,
    submitOrder,
  };
}
