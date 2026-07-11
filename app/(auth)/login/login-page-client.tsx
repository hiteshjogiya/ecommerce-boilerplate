"use client";

import Link from "next/link";
import { useActionState } from "react";
import { Mail, Sparkles } from "lucide-react";
import { AuthCard } from "@/features/auth/components/auth-card";
import { AuthFooter } from "@/features/auth/components/auth-footer";
import { AuthHeader } from "@/features/auth/components/auth-header";
import { PasswordInput } from "@/features/auth/components/password-input";
import { SocialButton } from "@/features/auth/components/social-button";
import { Input } from "@/components/ui/input";
import { signInAction } from "@/features/auth/actions/auth-actions";

interface LoginPageClientProps {
  returnTo: string;
}

export function LoginPageClient({ returnTo }: LoginPageClientProps) {
  const [state, formAction, isPending] = useActionState(signInAction, {
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
              Secure access, simplified
            </div>
            <h2 className="mt-6 text-3xl font-semibold leading-tight sm:text-4xl">
              Welcome back to your premium shopping experience.
            </h2>
            <p className="mt-4 max-w-lg text-sm leading-7 text-slate-300">
              Manage your orders, saved items, and account details in one secure place.
            </p>
            <div className="mt-8 rounded-[24px] border border-white/10 bg-white/10 p-5 text-sm text-slate-200">
              <p className="font-medium text-white">Why customers love Northstar</p>
              <ul className="mt-3 space-y-2">
                <li>• Fast checkout and saved preferences</li>
                <li>• Secure account recovery and support</li>
                <li>• Personalized recommendations</li>
              </ul>
            </div>
          </div>

          <div className="flex justify-center">
            <AuthCard
              title="Sign in"
              description="Use your email and password to continue to Northstar."
              footer={<AuthFooter message="New to Northstar?" href="/register" label="Create account" />}
              className="w-full max-w-md"
            >
              <AuthHeader title="Welcome back" subtitle="Sign in to continue where you left off." />
              <form action={formAction} className="space-y-4" noValidate>
                <input type="hidden" name="returnTo" value={returnTo} />
                {state.message ? (
                  <div className={state.success ? "rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700" : "rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"}>
                    {state.message}
                  </div>
                ) : null}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700" htmlFor="email">Email</label>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <Input id="email" name="email" type="email" placeholder="you@example.com" className="pl-10" aria-describedby="email-error" />
                  </div>
                  {state.fieldErrors?.email ? <p id="email-error" className="text-sm text-rose-600">{state.fieldErrors.email}</p> : null}
                </div>
                <div>
                  <PasswordInput label="Password" name="password" placeholder="Enter your password" error={state.fieldErrors?.password} />
                </div>
                <div className="flex items-center justify-between text-sm">
                  <Link href="/forgot-password" className="font-medium text-slate-700 hover:text-blue-600">
                    Forgot password?
                  </Link>
                </div>
                <button type="submit" disabled={isPending} className="inline-flex w-full items-center justify-center rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70">
                  {isPending ? "Signing in..." : "Sign in"}
                </button>
                <div className="flex items-center gap-3 pt-2 text-sm text-slate-400">
                  <div className="h-px flex-1 bg-slate-200" />
                  <span>Or continue with</span>
                  <div className="h-px flex-1 bg-slate-200" />
                </div>
                <SocialButton label="Continue with Google" icon={<Mail className="h-4 w-4" />} />
              </form>
            </AuthCard>
          </div>
        </div>
      </div>
    </main>
  );
}