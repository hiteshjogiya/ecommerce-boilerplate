"use client";

import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { profileSchema, type ProfileFormValues } from "@/features/account/schemas/profile-schema";
import { useProfile } from "@/features/account/hooks/use-profile";
import { AvatarImage } from "@/components/ui/avatar-image";

interface ProfileFormProps {
  initialProfile?: {
    user_id: string;
    full_name: string | null;
    phone: string | null;
    avatar_url: string | null;
    email: string;
  } | null;
}

export function ProfileForm({ initialProfile = null }: ProfileFormProps) {
  const { profile, loading, saving, uploading, error, saveProfile, saveAvatar } = useProfile(initialProfile);

  const defaultValues = useMemo<ProfileFormValues>(() => ({
    full_name: profile?.full_name ?? "",
    phone: profile?.phone ?? "",
  }), [profile?.full_name, profile?.phone]);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    values: defaultValues,
  });

  const onSubmit = form.handleSubmit(async (values) => {
    await saveProfile(values);
  });

  if (loading) {
    return <p className="text-sm text-slate-600">Loading profile...</p>;
  }

  return (
    <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
      <h1 className="text-2xl font-semibold text-slate-900">Profile</h1>
      <p className="mt-1 text-sm text-slate-600">Manage your account information and avatar.</p>

      {error ? <p className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p> : null}

      <form className="mt-5 space-y-4" onSubmit={onSubmit}>
        <div>
          <label className="text-sm font-medium text-slate-700">Full name</label>
          <Input className="mt-1" {...form.register("full_name")} />
          {form.formState.errors.full_name ? <p className="mt-1 text-xs text-rose-600">{form.formState.errors.full_name.message}</p> : null}
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700">Email</label>
          <Input className="mt-1" value={profile?.email ?? ""} readOnly aria-readonly="true" />
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700">Phone number</label>
          <Input className="mt-1" {...form.register("phone")} />
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700">Avatar</label>
          <div className="mt-2 flex items-center gap-3">
            <AvatarImage src={profile?.avatar_url} alt="Profile avatar" size={56} className="h-14 w-14" fallbackLabel={profile?.full_name ?? undefined} />
            <p className="text-xs text-slate-500">PNG/JPG up to a few MB recommended.</p>
          </div>
          <input
            type="file"
            accept="image/*"
            className="mt-1 block w-full rounded-xl border border-slate-200 p-2 text-sm"
            aria-label="Upload avatar"
            disabled={uploading || saving || form.formState.isSubmitting}
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) {
                void saveAvatar(file);
              }
            }}
          />
          {uploading ? <p className="mt-1 text-xs text-slate-500">Uploading avatar...</p> : null}
        </div>

        <Button type="submit" variant="secondary" disabled={uploading || saving || form.formState.isSubmitting}>
          {saving ? "Saving..." : "Save profile"}
        </Button>
      </form>
    </div>
  );
}
