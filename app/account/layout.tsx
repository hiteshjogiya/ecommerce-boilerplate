import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { MainShell } from "@/components/layout/main-shell";
import { AccountShell } from "@/features/account/components/account-shell";
import { getDashboardSummaryServer } from "@/src/services/account.server";
import { buildMetadata } from "@/src/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Account",
  description: "Manage your profile, orders, addresses, and preferences.",
  path: "/account",
  noIndex: true,
});

export const dynamic = "force-dynamic";

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  const summary = await getDashboardSummaryServer();

  if (!summary) {
    redirect("/login?returnTo=/account");
  }

  return (
    <MainShell>
      <AccountShell
        profileSummary={{
          fullName: summary.fullName,
          email: summary.email,
          avatarUrl: summary.avatarUrl,
        }}
      >
        {children}
      </AccountShell>
    </MainShell>
  );
}
