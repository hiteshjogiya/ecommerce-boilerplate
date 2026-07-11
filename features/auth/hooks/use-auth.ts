"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import type { ForgotPasswordValues, LoginValues, RegisterValues, ResetPasswordValues } from "@/features/auth/schemas";
import {
  getCurrentUser,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOutSession,
  signUpWithEmailAndPassword,
  updatePassword,
} from "@/features/auth/services/auth.service";

export function useAuth() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshSession = useCallback(async () => {
    setIsLoading(true);
    const currentUser = await getCurrentUser();
    setUser(currentUser);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    let isMounted = true;

    void (async () => {
      setIsLoading(true);
      const currentUser = await getCurrentUser();

      if (isMounted) {
        setUser(currentUser);
        setIsLoading(false);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, []);

  const signIn = useCallback(
    async (values: LoginValues) => {
      setError(null);
      setIsLoading(true);

      try {
        await signInWithEmailAndPassword(values);
        await refreshSession();
        router.push("/");
        return { success: true as const };
      } catch (authError) {
        const message = authError instanceof Error ? authError.message : "We could not sign you in.";
        setError(message);
        return { success: false as const, message };
      } finally {
        setIsLoading(false);
      }
    },
    [refreshSession, router],
  );

  const signUp = useCallback(
    async (values: RegisterValues) => {
      setError(null);
      setIsLoading(true);

      try {
        await signUpWithEmailAndPassword(values);
        return { success: true as const, message: "Check your inbox to verify your email address." };
      } catch (authError) {
        const message = authError instanceof Error ? authError.message : "We could not create your account.";
        setError(message);
        return { success: false as const, message };
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  const signOut = useCallback(async () => {
    setError(null);

    try {
      await signOutSession();
      setUser(null);
      router.push("/login");
    } catch (authError) {
      const message = authError instanceof Error ? authError.message : "We could not sign you out.";
      setError(message);
    }
  }, [router]);

  const resetPassword = useCallback(async (values: ForgotPasswordValues) => {
    setError(null);

    try {
      await sendPasswordResetEmail(values, `${window.location.origin}/reset-password`);
      return { success: true as const, message: "If an account exists, reset instructions have been sent." };
    } catch (authError) {
      const message = authError instanceof Error ? authError.message : "We could not send the reset instructions.";
      setError(message);
      return { success: false as const, message };
    }
  }, []);

  const completePasswordReset = useCallback(async (values: ResetPasswordValues, code?: string) => {
    setError(null);

    try {
      await updatePassword(values, code);
      router.push("/login");
      return { success: true as const };
    } catch (authError) {
      const message = authError instanceof Error ? authError.message : "We could not update your password.";
      setError(message);
      return { success: false as const, message };
    }
  }, [router]);

  return {
    user,
    isLoading,
    error,
    signIn,
    signUp,
    signOut,
    resetPassword,
    completePasswordReset,
    refreshSession,
  };
}

export function useCurrentUser() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    void (async () => {
      const currentUser = await getCurrentUser();

      if (isMounted) {
        setUser(currentUser);
        setIsLoading(false);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, []);

  return { user, isLoading };
}
