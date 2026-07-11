import type { Metadata } from "next";
import { MainShell } from "@/components/layout/main-shell";
import { CheckoutPage } from "@/features/checkout/components/checkout-page";
import { buildMetadata } from "@/src/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Checkout",
  description: "Securely review your order and complete checkout.",
  path: "/checkout",
  noIndex: true,
});

export default function CheckoutRoutePage() {
  return (
    <MainShell>
      <CheckoutPage />
    </MainShell>
  );
}
