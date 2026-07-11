import Link from "next/link";

interface AuthHeaderProps {
  title: string;
  subtitle: string;
}

export function AuthHeader({ title, subtitle }: AuthHeaderProps) {
  return (
    <div className="mb-8 flex flex-col items-center text-center">
      <Link href="/" className="mb-6 text-2xl font-semibold tracking-tight text-slate-900">
        Northstar
      </Link>
      <h1 className="text-3xl font-semibold tracking-tight text-slate-900">{title}</h1>
      <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">{subtitle}</p>
    </div>
  );
}
