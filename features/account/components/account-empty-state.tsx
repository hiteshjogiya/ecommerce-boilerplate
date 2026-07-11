import Link from "next/link";

interface AccountEmptyStateProps {
  title: string;
  description: string;
  actionHref?: string;
  actionLabel?: string;
}

export function AccountEmptyState({ title, description, actionHref, actionLabel }: AccountEmptyStateProps) {
  return (
    <div className="rounded-[24px] border border-slate-200 bg-white p-8 text-center shadow-sm">
      <h2 className="text-xl font-semibold text-slate-900">{title}</h2>
      <p className="mt-2 text-sm text-slate-600">{description}</p>
      {actionHref && actionLabel ? (
        <Link href={actionHref} className="mt-5 inline-flex h-11 items-center rounded-full border border-slate-200 px-5 text-sm font-medium text-slate-700 transition hover:border-blue-600 hover:text-blue-600">
          {actionLabel}
        </Link>
      ) : null}
    </div>
  );
}
