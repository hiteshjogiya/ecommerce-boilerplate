import { redirect } from "next/navigation";
import { MainShell } from "@/components/layout/main-shell";
import { AccountShell } from "@/features/account/components/account-shell";
import { getDashboardSummaryServer } from "@/src/services/account.server";

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
