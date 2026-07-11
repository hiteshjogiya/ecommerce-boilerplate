import Link from "next/link";
import Image from "next/image";
import type { CategoryRow } from "@/src/services/category.service";

interface CategoryGridProps {
  categories: CategoryRow[];
}

export function CategoryGrid({ categories }: CategoryGridProps) {
  return (
    <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {categories.map((category, index) => (
        <CategoryGridItem key={category.id} category={category} eager={index === 0} />
      ))}
    </div>
  );
}

function CategoryGridItem({ category, eager }: { category: CategoryRow; eager: boolean }) {
  const imageSrc = category.image && category.image.trim().length > 0 ? category.image : "/window.svg";

  return (
    <Link href={`/categories/${category.slug}`} className="group overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <div className="relative h-48 overflow-hidden">
        <Image
          src={imageSrc}
          alt={category.name}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition duration-500 group-hover:scale-105"
          loading={eager ? "eager" : "lazy"}
        />
      </div>
      <div className="p-6">
        <h3 className="text-lg font-semibold text-slate-900">{category.name}</h3>
        <p className="mt-2 text-sm leading-6 text-slate-600">Curated essentials for every space.</p>
      </div>
    </Link>
  );
}
