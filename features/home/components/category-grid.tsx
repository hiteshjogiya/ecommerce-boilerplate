import Link from "next/link";
import Image from "next/image";
import type { CategoryRow } from "@/src/services/category.service";

interface CategoryGridProps {
  categories: CategoryRow[];
}

export function CategoryGrid({ categories }: CategoryGridProps) {
  return (
    <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {categories.map((category) => (
        <Link key={category.id} href={`/categories/${category.slug}`} className="group overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
          <div className="relative h-48 overflow-hidden">
            <Image
              src={category.image ?? "/placeholder-category.jpg"}
              alt={category.name}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover transition duration-500 group-hover:scale-105"
            />
          </div>
          <div className="p-6">
            <h3 className="text-lg font-semibold text-slate-900">{category.name}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">Curated essentials for every space.</p>
          </div>
        </Link>
      ))}
    </div>
  );
}
