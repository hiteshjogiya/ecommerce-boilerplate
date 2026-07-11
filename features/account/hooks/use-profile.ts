"use client";

import { useCallback, useEffect, useState } from "react";
import { useToast } from "@/components/ui/toast";
import { getUserProfile, updateUserProfile, uploadAvatar } from "@/src/services/profile.service";
import type { ProfileFormValues } from "@/features/account/schemas/profile-schema";

function getMessage(error: unknown, fallback: string) {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
}

interface ProfileState {
  user_id: string;
  full_name: string | null;
  phone: string | null;
  avatar_url: string | null;
  email: string;
}

export function useProfile(initialProfile?: ProfileState | null) {
  const { toast } = useToast();
  const [profile, setProfile] = useState<ProfileState | null>(initialProfile ?? null);
  const [loading, setLoading] = useState(!initialProfile);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadProfile = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getUserProfile();
      setProfile(data);
    } catch (error) {
      setError(getMessage(error, "We could not load your profile."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (initialProfile) {
      return;
    }

    let cancelled = false;

    void (async () => {
      await Promise.resolve();
      if (!cancelled) {
        await loadProfile();
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [initialProfile, loadProfile]);

  const saveProfile = useCallback(
    async (values: ProfileFormValues) => {
      setSaving(true);
      setError(null);

      try {
        const updated = await updateUserProfile(values);
        setProfile(updated);
        toast({ title: "Profile updated", variant: "success" });
        return { success: true as const };
      } catch (error) {
        const message = getMessage(error, "We could not update your profile.");
        setError(message);
        toast({ title: "Profile error", description: message, variant: "error" });
        return { success: false as const, message };
      } finally {
        setSaving(false);
      }
    },
    [toast],
  );

  const saveAvatar = useCallback(
    async (file: File) => {
      setUploading(true);
      setError(null);

      try {
        const updated = await uploadAvatar(file);
        setProfile(updated);
        toast({ title: "Avatar updated", variant: "success" });
        return { success: true as const };
      } catch (error) {
        const message = getMessage(error, "We could not upload your avatar.");
        setError(message);
        toast({ title: "Upload error", description: message, variant: "error" });
        return { success: false as const, message };
      } finally {
        setUploading(false);
      }
    },
    [toast],
  );

  return {
    profile,
    loading,
    saving,
    uploading,
    error,
    loadProfile,
    saveProfile,
    saveAvatar,
  };
}
