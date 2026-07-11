import { redirect } from "next/navigation";
import { AuthCard } from "@/features/auth/components/auth-card";
import { AuthHeader } from "@/features/auth/components/auth-header";
import { PasswordInput } from "@/features/auth/components/password-input";
import { resetPasswordAction } from "@/features/auth/actions/auth-actions";

async function submitResetPassword(formData: FormData) {
  formData.set("code", formData.get("code")?.toString() ?? "");
  await resetPasswordAction({ success: false, message: "" }, formData);
}

interface ResetPasswordPageProps {
  searchParams: Promise<{ code?: string }>;
}

export default async function ResetPasswordPage({ searchParams }: ResetPasswordPageProps) {
  const params = await searchParams;
  const code = params.code ?? "";

  if (!code) {
    redirect("/forgot-password");
  }

  return <ResetPasswordForm code={code} />;
}

function ResetPasswordForm({ code }: { code: string }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.12),_transparent_55%),linear-gradient(135deg,_#f8fafc_0%,_#eef2ff_100%)] px-4 py-12">
      <AuthCard title="Set new password" description="Choose a new password for your account." className="w-full max-w-md">
        <AuthHeader title="Create a new password" subtitle="Use a strong password to keep your account secure." />
        <form action={submitResetPassword} className="space-y-4" noValidate>
          <input type="hidden" name="code" value={code} />
          <PasswordInput label="New Password" name="newPassword" placeholder="Enter a new password" />
          <PasswordInput label="Confirm Password" name="confirmPassword" placeholder="Confirm your new password" />
          <button type="submit" className="inline-flex w-full items-center justify-center rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">
            Update password
          </button>
        </form>
      </AuthCard>
    </main>
  );
}
