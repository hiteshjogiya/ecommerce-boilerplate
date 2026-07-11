"use client";

import { MainShell } from "@/components/layout/main-shell";
import { ProductErrorState } from "@/features/products/components/product-error-state";

interface ErrorPageProps {
  reset: () => void;
}

export default function ErrorPage({ reset }: ErrorPageProps) {
  return (
    <MainShell>
      <section className="mx-auto max-w-7xl px-4 py-8 lg:px-8 lg:py-10">
        <div className="space-y-4">
          <ProductErrorState />
          <button type="button" onClick={() => reset()} className="rounded-full bg-blue-600 px-4 py-2 text-sm font-medium text-white">
            Try again
          </button>
        </div>
      </section>
    </MainShell>
  );
}
