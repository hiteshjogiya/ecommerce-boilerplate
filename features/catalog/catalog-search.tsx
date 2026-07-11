"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search as SearchIcon } from "lucide-react";

interface CatalogSearchProps {
  initialQuery: string;
}

export function CatalogSearch({ initialQuery }: CatalogSearchProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(initialQuery);

  useEffect(() => {
    const trimmedQuery = query.trim();
    const timer = window.setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());

      if (trimmedQuery) {
        params.set("q", trimmedQuery);
      } else {
        params.delete("q");
      }

      params.set("page", "1");

      const nextUrl = `${pathname}${params.toString() ? `?${params.toString()}` : ""}`;
      const currentUrl = `${pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ""}`;

      if (nextUrl === currentUrl) {
        return;
      }

      router.replace(nextUrl, { scroll: false });
    }, 300);

    return () => window.clearTimeout(timer);
  }, [query, pathname, router, searchParams]);

  return (
    <form className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-2" onSubmit={(event) => event.preventDefault()}>
      <SearchIcon className="h-4 w-4 text-slate-400" />
      <input
        name="q"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search products"
        className="w-44 bg-transparent text-sm outline-none sm:w-56"
        aria-label="Search products"
      />
      <button type="submit" className="rounded-full bg-blue-600 px-3 py-2 text-sm font-medium text-white">
        Search
      </button>
    </form>
  );
}
