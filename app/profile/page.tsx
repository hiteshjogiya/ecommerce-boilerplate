import Link from "next/link";
import { createServerSupabaseClient } from "@/src/lib/supabase/server";
import { redirect } from "next/navigation";
import { signOutAction } from "@/features/auth/actions/auth-actions";
import { getSupabaseEnv } from "@/src/lib/supabase/env";

export default async function ProfilePage() {
  const { isConfigured } = getSupabaseEnv();

  if (!isConfigured) {
    redirect("/login");
  }

  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col px-4 py-16 sm:px-6 lg:px-8">
      <div className="rounded-[28px] border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-medium uppercase tracking-[0.3em] text-blue-600">Protected area</p>
        <h1 className="mt-3 text-3xl font-semibold text-slate-900">Welcome, {user.email}</h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-500">
          This route is protected by middleware and Supabase server session checks.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <Link href="/" className="inline-flex items-center text-sm font-medium text-slate-900 hover:text-blue-600">
            Return home
          </Link>
          <form action={signOutAction}>
            <button type="submit" className="inline-flex items-center rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50">
              Sign out
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
