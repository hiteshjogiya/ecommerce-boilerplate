"use server";

import { redirect } from "next/navigation";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { AppError } from "@/src/lib/errors";
import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  type RegisterValues,
  type LoginValues,
  type ForgotPasswordValues,
  type ResetPasswordValues,
} from "@/features/auth/schemas";
import {
  sendPasswordResetEmailServer,
  signInWithEmailAndPasswordServer,
  signOutSessionServer,
  signUpWithEmailAndPasswordServer,
  updatePassword,
} from "@/features/auth/services/auth.service";

export interface AuthActionState {
  success: boolean;
  message: string;
  fieldErrors?: Record<string, string>;
}

function toFieldErrors(errors: Record<string, string[] | undefined>) {
  return Object.fromEntries(
    Object.entries(errors).map(([key, value]) => [key, value?.[0] ?? ""]),
  );
}

function getErrorMessage(error: unknown, fallback: string) {
  if (error instanceof AppError) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
}

export async function signUpAction(_prevState: AuthActionState, formData: FormData): Promise<AuthActionState> {
  const values: RegisterValues = {
    fullName: String(formData.get("fullName") ?? ""),
    email: String(formData.get("email") ?? ""),
    password: String(formData.get("password") ?? ""),
    confirmPassword: String(formData.get("confirmPassword") ?? ""),
  };

  const parsed = registerSchema.safeParse(values);

  if (!parsed.success) {
    return {
      success: false,
      message: "Please correct the highlighted fields before continuing.",
      fieldErrors: toFieldErrors(parsed.error.flatten().fieldErrors),
    };
  }

  try {
    await signUpWithEmailAndPasswordServer(parsed.data, process.env.NEXT_PUBLIC_SITE_URL);

    return {
      success: true,
      message: "Account created. Please check your inbox to verify your email before signing in.",
    };
  } catch (error) {
    return {
      success: false,
      message: getErrorMessage(error, "We could not create your account right now."),
    };
  }
}

export async function signInAction(_prevState: AuthActionState, formData: FormData): Promise<AuthActionState> {
  const values: LoginValues = {
    email: String(formData.get("email") ?? ""),
    password: String(formData.get("password") ?? ""),
  };
  const returnTo = String(formData.get("returnTo") ?? "");

  const parsed = loginSchema.safeParse(values);

  if (!parsed.success) {
    return {
      success: false,
      message: "Please enter a valid email address and password.",
      fieldErrors: toFieldErrors(parsed.error.flatten().fieldErrors),
    };
  }

  try {
    await signInWithEmailAndPasswordServer(parsed.data);
    redirect(returnTo.startsWith("/") ? returnTo : "/");
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }

    return {
      success: false,
      message: getErrorMessage(error, "The email or password you entered is incorrect."),
    };
  }

  return {
    success: false,
    message: "We could not sign you in.",
  };
}

export async function signOutAction() {
  await signOutSessionServer();
  redirect("/login");
}

export async function forgotPasswordAction(_prevState: AuthActionState, formData: FormData): Promise<AuthActionState> {
  const values: ForgotPasswordValues = {
    email: String(formData.get("email") ?? ""),
  };

  const parsed = forgotPasswordSchema.safeParse(values);

  if (!parsed.success) {
    return {
      success: false,
      message: "Please enter a valid email address.",
      fieldErrors: toFieldErrors(parsed.error.flatten().fieldErrors),
    };
  }

  try {
    await sendPasswordResetEmailServer(parsed.data, `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/reset-password`);

    return {
      success: true,
      message: "If an account exists for that email, a reset link has been sent.",
    };
  } catch (error) {
    return {
      success: false,
      message: getErrorMessage(error, "We could not send the reset instructions right now."),
    };
  }
}

export async function resetPasswordAction(_prevState: AuthActionState, formData: FormData): Promise<AuthActionState> {
  const values: ResetPasswordValues = {
    newPassword: String(formData.get("newPassword") ?? ""),
    confirmPassword: String(formData.get("confirmPassword") ?? ""),
  };
  const code = String(formData.get("code") ?? "");

  const parsed = resetPasswordSchema.safeParse(values);

  if (!parsed.success) {
    return {
      success: false,
      message: "Please enter a strong password and confirm it.",
      fieldErrors: toFieldErrors(parsed.error.flatten().fieldErrors),
    };
  }

  try {
    await updatePassword(parsed.data, code || undefined);
    redirect("/login");
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }

    return {
      success: false,
      message: getErrorMessage(error, "We could not update your password right now."),
    };
  }

  return {
    success: false,
    message: "We could not update your password right now.",
  };
}
