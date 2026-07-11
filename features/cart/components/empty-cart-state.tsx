import Link from "next/link";
import { ShoppingBag } from "lucide-react";

interface EmptyCartStateProps {
  title?: string;
  description?: string;
}

export function EmptyCartState({
  title = "Your cart is empty",
  description = "Browse the collection and add products to start building your order.",
}: EmptyCartStateProps) {
  return (
    <div className="rounded-[28px] border border-dashed border-slate-300 bg-white px-6 py-12 text-center shadow-sm">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-blue-600">
        <ShoppingBag className="h-8 w-8" />
      </div>
      <h2 className="mt-5 text-2xl font-semibold tracking-tight text-slate-900">{title}</h2>
      <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-slate-600">{description}</p>
      <div className="mt-6">
        <Link href="/products" className="inline-flex h-11 items-center rounded-full bg-blue-600 px-5 text-sm font-medium text-white transition hover:bg-blue-700">
          Continue shopping
        </Link>
      </div>
    </div>
  );
}
