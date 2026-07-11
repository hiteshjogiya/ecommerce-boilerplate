"use client";

import { useEffect } from "react";
import Link from "next/link";
import { MainShell } from "@/components/layout/main-shell";
import { reportError } from "@/src/lib/monitoring";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function AppError({ error, reset }: ErrorProps) {
  useEffect(() => {
    reportError(error, { area: "app-error-boundary" });
  }, [error]);

  return (
    <MainShell>
      <section className="mx-auto max-w-3xl px-4 py-20 text-center lg:px-8">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-rose-600">500</p>
        <h1 className="mt-3 text-4xl font-semibold text-slate-900">Something went wrong</h1>
        <p className="mt-3 text-slate-600">An unexpected error occurred. Try again or return to a safe page.</p>
        <div className="mt-8 flex items-center justify-center gap-3">
          <button type="button" onClick={reset} className="rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white">
            Try again
          </button>
          <Link href="/" className="rounded-full border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700">
            Home
          </Link>
        </div>
      </section>
    </MainShell>
  );
}
