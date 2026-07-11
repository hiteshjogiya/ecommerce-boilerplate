export const ORDER_STATUS = {
  Pending: "Pending",
  Confirmed: "Confirmed",
  Cancelled: "Cancelled",
  Delivered: "Delivered",
} as const;

export const PAYMENT_STATUS = {
  Pending: "Pending",
  Paid: "Paid",
  Failed: "Failed",
  Refunded: "Refunded",
} as const;

export type OrderStatus = (typeof ORDER_STATUS)[keyof typeof ORDER_STATUS];
export type PaymentStatus = (typeof PAYMENT_STATUS)[keyof typeof PAYMENT_STATUS];

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);
}
