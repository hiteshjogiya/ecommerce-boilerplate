import { MainShell } from "@/components/layout/main-shell";

export default function GlobalLoading() {
  return (
    <MainShell>
      <section className="mx-auto flex w-full max-w-7xl flex-1 px-4 py-8 lg:px-8">
        <div className="grid w-full gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
          <aside className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
            <div className="h-14 animate-pulse rounded-2xl bg-slate-200" />
            <div className="mt-4 space-y-2">
              <div className="h-9 animate-pulse rounded-full bg-slate-200" />
              <div className="h-9 animate-pulse rounded-full bg-slate-200" />
              <div className="h-9 animate-pulse rounded-full bg-slate-200" />
            </div>
          </aside>

          <div className="space-y-4">
            <div className="h-12 w-64 animate-pulse rounded-xl bg-slate-200" />
            <div className="h-48 animate-pulse rounded-2xl bg-slate-200" />
            <div className="h-48 animate-pulse rounded-2xl bg-slate-200" />
          </div>
        </div>
      </section>
    </MainShell>
  );
}
