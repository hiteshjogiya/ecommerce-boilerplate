import type { Metadata } from "next";
import Link from "next/link";
import { MainShell } from "@/components/layout/main-shell";
import { buildMetadata } from "@/src/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Offline",
  description: "You are currently offline. Reconnect to continue browsing products.",
  path: "/offline",
  noIndex: true,
});

export default function OfflinePage() {
  return (
    <MainShell>
      <section className="mx-auto max-w-3xl px-4 py-20 text-center lg:px-8">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Offline</p>
        <h1 className="mt-3 text-4xl font-semibold text-slate-900">No internet connection</h1>
        <p className="mt-3 text-slate-600">Please reconnect to continue. Cached content may still be available.</p>
        <Link href="/" className="mt-8 inline-flex rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white">
          Retry home
        </Link>
      </section>
    </MainShell>
  );
}
