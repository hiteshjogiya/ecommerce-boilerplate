export default function CartLoading() {
  return (
    <main className="flex-1 bg-slate-50">
      <section className="mx-auto max-w-7xl px-4 py-8 lg:px-8 lg:py-10">
        <div className="animate-pulse rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm lg:p-10">
          <div className="h-4 w-28 rounded-full bg-slate-200" />
          <div className="mt-4 h-10 w-72 rounded-2xl bg-slate-200" />
          <div className="mt-3 h-4 w-full max-w-2xl rounded-full bg-slate-200" />
          <div className="mt-8 h-64 rounded-[28px] bg-slate-100" />
        </div>
      </section>
    </main>
  );
}
