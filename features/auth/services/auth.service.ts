import type { User } from "@supabase/supabase-js";
import { AppError } from "@/src/lib/errors";
import { createClient } from "@/src/lib/supabase/client";
import { createServerSupabaseClient } from "@/src/lib/supabase/server";
import type { ForgotPasswordValues, LoginValues, RegisterValues, ResetPasswordValues } from "@/features/auth/schemas";

function getAuthErrorMessage(error: { message?: string } | null | undefined, fallback: string) {
  if (!error?.message) {
    return fallback;
  }

  return error.message;
}

export async function signUpWithEmailAndPassword(values: RegisterValues) {
  const supabase = createClient();
  const { data, error } = await supabase.auth.signUp({
    email: values.email,
    password: values.password,
    options: {
      data: {
        full_name: values.fullName,
      },
    },
  });

  if (error) {
    throw new AppError(getAuthErrorMessage(error, "Unable to create your account right now."), 400);
  }

  return data;
}

export async function signInWithEmailAndPassword(values: LoginValues) {
  const supabase = createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email: values.email,
    password: values.password,
  });

  if (error) {
    throw new AppError(getAuthErrorMessage(error, "We could not sign you in."), 401);
  }

  return data;
}

export async function signOutSession() {
  const supabase = createClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    throw new AppError(getAuthErrorMessage(error, "We could not sign you out."), 400);
  }
}

export async function sendPasswordResetEmail(values: ForgotPasswordValues, redirectTo?: string) {
  const supabase = createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(values.email, {
    redirectTo,
  });

  if (error) {
    throw new AppError(getAuthErrorMessage(error, "We could not send the reset email."), 400);
  }
}

export async function updatePassword(values: ResetPasswordValues, code?: string) {
  const supabase = await createServerSupabaseClient();

  if (code) {
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

    if (exchangeError) {
      throw new AppError("This password reset link is invalid or has expired.", 400);
    }
  }

  const { error } = await supabase.auth.updateUser({ password: values.newPassword });

  if (error) {
    throw new AppError(getAuthErrorMessage(error, "We could not update your password."), 400);
  }
}

export async function getCurrentUser(): Promise<User | null> {
  const supabase = createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error) {
    return null;
  }

  return data.user;
}

export async function signUpWithEmailAndPasswordServer(values: RegisterValues, redirectTo?: string) {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.auth.signUp({
    email: values.email,
    password: values.password,
    options: {
      data: {
        full_name: values.fullName,
      },
      emailRedirectTo: redirectTo,
    },
  });

  if (error) {
    throw new AppError(getAuthErrorMessage(error, "Unable to create your account right now."), 400);
  }

  return data;
}

export async function signInWithEmailAndPasswordServer(values: LoginValues) {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email: values.email,
    password: values.password,
  });

  if (error) {
    throw new AppError(getAuthErrorMessage(error, "We could not sign you in."), 401);
  }

  return data;
}

export async function signOutSessionServer() {
  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    throw new AppError(getAuthErrorMessage(error, "We could not sign you out."), 400);
  }
}

export async function sendPasswordResetEmailServer(values: ForgotPasswordValues, redirectTo?: string) {
  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.auth.resetPasswordForEmail(values.email, {
    redirectTo,
  });

  if (error) {
    throw new AppError(getAuthErrorMessage(error, "We could not send the reset email."), 400);
  }
}
