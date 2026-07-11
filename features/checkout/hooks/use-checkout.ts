"use client";

import { useMemo, useState } from "react";
import { checkoutSchema, type CheckoutValues } from "@/features/checkout/schemas/checkout-schema";
import { getShippingMethod, SHIPPING_METHODS } from "@/features/checkout/constants";
import { useCart } from "@/features/cart/hooks/use-cart";
import { useCartTotals } from "@/features/cart/hooks/use-cart";
import { useAddresses } from "@/features/checkout/hooks/use-addresses";
import { usePlaceOrder } from "@/features/checkout/hooks/use-place-order";

export function useCheckout() {
  const { items, userId } = useCart();
  const cartTotals = useCartTotals();
  const addressesApi = useAddresses();
  const placeOrderApi = usePlaceOrder();
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [selectedShippingMethodId, setSelectedShippingMethodId] = useState(SHIPPING_METHODS[0].id);
  const [billingSameAsShipping, setBillingSameAsShipping] = useState(true);

  const resolvedAddressId = selectedAddressId ?? addressesApi.defaultAddressId;
  const shippingMethod = getShippingMethod(selectedShippingMethodId);
  const tax = Number(cartTotals.estimatedTax.toFixed(2));
  const discount = 0;
  const shippingCost = shippingMethod.price;

  const grandTotal = useMemo(() => {
    return Number((cartTotals.subtotal + shippingCost + tax - discount).toFixed(2));
  }, [cartTotals.subtotal, discount, shippingCost, tax]);

  const validateCheckout = (values: CheckoutValues) => checkoutSchema.safeParse(values);

  return {
    items,
    userId,
    cartTotals,
    tax,
    discount,
    shippingCost,
    grandTotal,
    shippingMethod,
    selectedAddressId: resolvedAddressId,
    selectedShippingMethodId,
    billingSameAsShipping,
    setSelectedAddressId,
    setSelectedShippingMethodId,
    setBillingSameAsShipping,
    validateCheckout,
    addressesApi,
    placeOrderApi,
  };
}
