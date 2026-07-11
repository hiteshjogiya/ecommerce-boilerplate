"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Heart, LogOut, MapPinHouse, Package, User } from "lucide-react";
import { signOutAction } from "@/features/auth/actions/auth-actions";
import { AvatarImage } from "@/components/ui/avatar-image";

interface AccountShellProps {
  children: React.ReactNode;
  profileSummary: {
    fullName: string;
    email: string;
    avatarUrl: string | null;
  };
}

const NAV_ITEMS = [
  { label: "Dashboard", href: "/account", icon: Home },
  { label: "Profile", href: "/account/profile", icon: User },
  { label: "Orders", href: "/account/orders", icon: Package },
  { label: "Addresses", href: "/account/addresses", icon: MapPinHouse },
  { label: "Wishlist", href: "/wishlist", icon: Heart },
];

export function AccountShell({ children, profileSummary }: AccountShellProps) {
  const pathname = usePathname();

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 px-4 py-8 lg:px-8">
      <div className="grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
        <aside className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-3">
            <AvatarImage src={profileSummary.avatarUrl} alt={profileSummary.fullName} size={48} className="h-12 w-12" fallbackLabel={profileSummary.fullName} />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-900">{profileSummary.fullName}</p>
              <p className="truncate text-xs text-slate-500">{profileSummary.email}</p>
            </div>
          </div>

          <nav className="mt-4 space-y-1" aria-label="Account navigation">
            {NAV_ITEMS.map((item) => {
              const active = pathname === item.href || (item.href !== "/account" && pathname.startsWith(`${item.href}/`));
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium transition ${active ? "bg-slate-900 text-white" : "text-slate-700 hover:bg-slate-100"}`}
                  aria-current={active ? "page" : undefined}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <form action={signOutAction} className="mt-4">
            <button type="submit" className="flex w-full items-center gap-2 rounded-full border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100">
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </form>
        </aside>

        <section>{children}</section>
      </div>
    </main>
  );
}
