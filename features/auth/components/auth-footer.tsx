import Link from "next/link";

interface AuthFooterProps {
  message: string;
  href: string;
  label: string;
}

export function AuthFooter({ message, href, label }: AuthFooterProps) {
  return (
    <p className="text-sm text-slate-500">
      {message}{" "}
      <Link href={href} className="font-medium text-slate-900 transition hover:text-blue-600">
        {label}
      </Link>
    </p>
  );
}
