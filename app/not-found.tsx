import Link from "next/link";
import { MainShell } from "@/components/layout/main-shell";

export default function NotFound() {
  return (
    <MainShell>
      <section className="mx-auto max-w-3xl px-4 py-20 text-center lg:px-8">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">404</p>
        <h1 className="mt-3 text-4xl font-semibold text-slate-900">Page not found</h1>
        <p className="mt-3 text-slate-600">The page you requested does not exist or was moved.</p>
        <div className="mt-8 flex items-center justify-center gap-3">
          <Link href="/" className="rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white">
            Go to home
          </Link>
          <Link href="/products" className="rounded-full border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700">
            Browse products
          </Link>
        </div>
      </section>
    </MainShell>
  );
}
