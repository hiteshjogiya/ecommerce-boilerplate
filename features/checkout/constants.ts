export interface ShippingMethod {
  id: string;
  name: string;
  price: number;
  estimatedDelivery: string;
}

export const SHIPPING_METHODS: ShippingMethod[] = [
  {
    id: "standard",
    name: "Standard Shipping",
    price: 6,
    estimatedDelivery: "3-5 business days",
  },
  {
    id: "express",
    name: "Express Shipping",
    price: 16,
    estimatedDelivery: "1-2 business days",
  },
];

export function getShippingMethod(methodId: string) {
  return SHIPPING_METHODS.find((method) => method.id === methodId) ?? SHIPPING_METHODS[0];
}
