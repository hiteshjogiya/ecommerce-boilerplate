"use client";

import { AuthCard } from "@/features/auth/components/auth-card";
import { AuthFooter } from "@/features/auth/components/auth-footer";
import { AuthHeader } from "@/features/auth/components/auth-header";
import { PasswordInput } from "@/features/auth/components/password-input";
import { Input } from "@/components/ui/input";
import { signUpAction } from "@/features/auth/actions/auth-actions";
import { useActionState } from "react";
import { Mail, Sparkles } from "lucide-react";

export default function RegisterPage() {
  const [state, formAction, isPending] = useActionState(signUpAction, {
    success: false,
    message: "",
  });

  return (
    <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.12),_transparent_55%),linear-gradient(135deg,_#f8fafc_0%,_#eef2ff_100%)] px-4 py-12">
      <div className="w-full max-w-6xl rounded-[32px] border border-slate-200/70 bg-white/80 p-4 shadow-[0_30px_80px_-24px_rgba(15,23,42,0.22)] backdrop-blur sm:p-8 lg:p-10">
        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div className="rounded-[28px] bg-slate-900 p-8 text-white sm:p-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-sm text-slate-100">
              <Sparkles className="h-4 w-4" />
              Join Northstar today
            </div>
            <h2 className="mt-6 text-3xl font-semibold leading-tight sm:text-4xl">
              Create an account and unlock a smoother shopping experience.
            </h2>
            <p className="mt-4 max-w-lg text-sm leading-7 text-slate-300">
              Track your account, receive updates, and save your favorite products in one place.
            </p>
          </div>

          <div className="flex justify-center">
            <AuthCard
              title="Create account"
              description="Create a secure account to access your profile and saved items."
              footer={<AuthFooter message="Already have an account?" href="/login" label="Sign in" />}
              className="w-full max-w-md"
            >
              <AuthHeader title="Get started" subtitle="Sign up in less than a minute." />
              <form action={formAction} className="space-y-4" noValidate>
                {state.message ? (
                  <div className={state.success ? "rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700" : "rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"}>
                    {state.message}
                  </div>
                ) : null}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700" htmlFor="fullName">Full Name</label>
                  <Input id="fullName" name="fullName" type="text" placeholder="Alex Morgan" />
                  {state.fieldErrors?.fullName ? <p className="text-sm text-rose-600">{state.fieldErrors.fullName}</p> : null}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700" htmlFor="email">Email</label>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <Input id="email" name="email" type="email" placeholder="you@example.com" className="pl-10" />
                  </div>
                  {state.fieldErrors?.email ? <p className="text-sm text-rose-600">{state.fieldErrors.email}</p> : null}
                </div>
                <PasswordInput label="Password" name="password" placeholder="Create a strong password" error={state.fieldErrors?.password} />
                <PasswordInput label="Confirm Password" name="confirmPassword" placeholder="Repeat your password" error={state.fieldErrors?.confirmPassword} />
                <button type="submit" disabled={isPending} className="inline-flex w-full items-center justify-center rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70">
                  {isPending ? "Creating account..." : "Create account"}
                </button>
              </form>
            </AuthCard>
          </div>
        </div>
      </div>
    </main>
  );
}
