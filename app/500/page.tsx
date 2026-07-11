import type { Metadata } from "next";
import Link from "next/link";
import { MainShell } from "@/components/layout/main-shell";
import { buildMetadata } from "@/src/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Server Error",
  description: "A server error occurred.",
  path: "/500",
  noIndex: true,
});

export default function ServerErrorPage() {
  return (
    <MainShell>
      <section className="mx-auto max-w-3xl px-4 py-20 text-center lg:px-8">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-rose-600">500</p>
        <h1 className="mt-3 text-4xl font-semibold text-slate-900">Server error</h1>
        <p className="mt-3 text-slate-600">We are working to resolve this issue.</p>
        <Link href="/" className="mt-8 inline-flex rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white">
          Back to home
        </Link>
      </section>
    </MainShell>
  );
}
