import { MainShell } from "@/components/layout/main-shell";

export default function OrderSuccessLoading() {
  return (
    <MainShell>
      <main className="flex-1 bg-slate-50">
        <section className="mx-auto max-w-4xl px-4 py-10 lg:px-8">
          <div className="rounded-[28px] border border-slate-200 bg-white p-8 shadow-sm">
            <p className="text-sm text-slate-600">Loading order confirmation...</p>
          </div>
        </section>
      </main>
    </MainShell>
  );
}
