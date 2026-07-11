export function ProductDetailSkeleton() {
  return (
    <div className="space-y-8">
      <div className="h-4 w-48 animate-pulse rounded-full bg-slate-200" />
      <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="h-[560px] animate-pulse rounded-[32px] bg-slate-200" />
        <div className="space-y-4 rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm lg:p-8">
          <div className="h-4 w-24 animate-pulse rounded-full bg-slate-200" />
          <div className="h-10 w-3/4 animate-pulse rounded bg-slate-200" />
          <div className="h-4 w-full animate-pulse rounded bg-slate-200" />
          <div className="h-4 w-5/6 animate-pulse rounded bg-slate-200" />
          <div className="h-28 animate-pulse rounded-3xl bg-slate-200" />
          <div className="h-12 animate-pulse rounded-full bg-slate-200" />
          <div className="h-12 animate-pulse rounded-full bg-slate-200" />
        </div>
      </div>
    </div>
  );
}
