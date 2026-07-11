import { MainShell } from "@/components/layout/main-shell";

export default function AccountLoading() {
  return (
    <MainShell>
      <section className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
        <div className="space-y-4">
          <div className="h-10 w-64 animate-pulse rounded-xl bg-slate-200" />
          <div className="h-48 animate-pulse rounded-2xl bg-slate-200" />
          <div className="h-48 animate-pulse rounded-2xl bg-slate-200" />
        </div>
      </section>
    </MainShell>
  );
}
