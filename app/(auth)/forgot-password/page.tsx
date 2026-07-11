"use client";

import { AuthCard } from "@/features/auth/components/auth-card";
import { AuthFooter } from "@/features/auth/components/auth-footer";
import { AuthHeader } from "@/features/auth/components/auth-header";
import { Input } from "@/components/ui/input";
import { forgotPasswordAction } from "@/features/auth/actions/auth-actions";
import { useActionState } from "react";
import { Mail } from "lucide-react";

export default function ForgotPasswordPage() {
  const [state, formAction, isPending] = useActionState(forgotPasswordAction, {
    success: false,
    message: "",
  });

  return (
    <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.12),_transparent_55%),linear-gradient(135deg,_#f8fafc_0%,_#eef2ff_100%)] px-4 py-12">
      <AuthCard
        title="Reset password"
        description="Enter the email linked to your account and we’ll send recovery instructions."
        footer={<AuthFooter message="Remembered your password?" href="/login" label="Back to sign in" />}
        className="w-full max-w-md"
      >
        <AuthHeader title="Forgot password" subtitle="We’ll help you get back into your account safely." />
        <form action={formAction} className="space-y-4" noValidate>
          {state.message ? (
            <div className={state.success ? "rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700" : "rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"}>
              {state.message}
            </div>
          ) : null}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700" htmlFor="email">Email</label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input id="email" name="email" type="email" placeholder="you@example.com" className="pl-10" />
            </div>
            {state.fieldErrors?.email ? <p className="text-sm text-rose-600">{state.fieldErrors.email}</p> : null}
          </div>
          <button type="submit" disabled={isPending} className="inline-flex w-full items-center justify-center rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70">
            {isPending ? "Sending instructions..." : "Send recovery email"}
          </button>
        </form>
      </AuthCard>
    </main>
  );
}
