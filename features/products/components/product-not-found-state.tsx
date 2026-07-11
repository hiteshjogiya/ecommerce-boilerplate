import Link from "next/link";
import { EmptyState } from "@/features/home/components/empty-state";

export function ProductNotFoundState() {
  return (
    <div className="space-y-6">
      <EmptyState title="Product not found" description="The product may have been removed, renamed, or the link may be invalid." />
      <div className="flex justify-center">
        <Link href="/products" className="text-sm font-medium text-blue-600 hover:text-blue-700">
          Back to catalog
        </Link>
      </div>
    </div>
  );
}
