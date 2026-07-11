import Link from "next/link";
import { navLinks } from "@/constants/mock-data";

export function SiteNav({ mobile = false }: { mobile?: boolean }) {
  return (
    <nav className={mobile ? "flex flex-col gap-4" : "hidden items-center gap-6 lg:flex"}>
      {navLinks.map((link) => (
        <Link
          key={link}
          href="/"
          className={mobile ? "text-base font-medium text-slate-700" : "text-sm font-medium text-slate-600 transition hover:text-slate-900"}
        >
          {link}
        </Link>
      ))}
    </nav>
  );
}
