"use client";

import Link from "next/link";
import { useEffect } from "react";
import { reportError } from "@/src/lib/monitoring";

export default function GlobalError({ error }: { error: Error & { digest?: string } }) {
  useEffect(() => {
    reportError(error, { area: "global-error-boundary" });
  }, [error]);

  return (
    <html lang="en">
      <body className="m-0 min-h-screen bg-slate-50 text-slate-900">
        <main className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center px-4 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-rose-600">Critical error</p>
          <h1 className="mt-3 text-4xl font-semibold">Application unavailable</h1>
          <p className="mt-3 text-slate-600">Please refresh the page. If the issue persists, contact support.</p>
          <Link href="/" className="mt-8 rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white">
            Return home
          </Link>
        </main>
      </body>
    </html>
  );
}
