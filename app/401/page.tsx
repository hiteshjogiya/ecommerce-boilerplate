import type { Metadata } from "next";
import Link from "next/link";
import { MainShell } from "@/components/layout/main-shell";
import { buildMetadata } from "@/src/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Unauthorized",
  description: "Please sign in to access this resource.",
  path: "/401",
  noIndex: true,
});

export default function UnauthorizedPage() {
  return (
    <MainShell>
      <section className="mx-auto max-w-3xl px-4 py-20 text-center lg:px-8">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-600">401</p>
        <h1 className="mt-3 text-4xl font-semibold text-slate-900">Unauthorized</h1>
        <p className="mt-3 text-slate-600">You need to sign in before viewing this page.</p>
        <div className="mt-8 flex items-center justify-center gap-3">
          <Link href="/login" className="rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white">
            Sign in
          </Link>
          <Link href="/" className="rounded-full border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700">
            Home
          </Link>
        </div>
      </section>
    </MainShell>
  );
}
