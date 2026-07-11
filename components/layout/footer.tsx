import Link from "next/link";
import { Globe, MessageCircle, Send } from "lucide-react";
import { footerColumns } from "@/constants/mock-data";

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
        <div className="space-y-6">
          <div>
            <p className="text-xl font-semibold tracking-tight text-slate-900">Northstar</p>
            <p className="mt-3 max-w-md text-sm leading-7 text-slate-600">
              Premium essentials for modern living, designed to elevate every day with thoughtful quality.
            </p>
          </div>
          <div className="flex gap-3">
            {[Globe, MessageCircle, Send].map((Icon, index) => (
              <Link
                key={index}
                href="/"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition hover:border-blue-600 hover:text-blue-600"
              >
                <Icon className="h-4 w-4" />
              </Link>
            ))}
          </div>
        </div>

        <div className="grid gap-8 sm:grid-cols-3">
          {footerColumns.map((column) => (
            <div key={column.title}>
              <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-900">
                {column.title}
              </h3>
              <ul className="mt-4 space-y-3 text-sm text-slate-600">
                {column.links.map((link) => (
                  <li key={link}>
                    <Link href="/" className="transition hover:text-slate-900">
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </footer>
  );
}
