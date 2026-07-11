import { AppError } from "@/src/lib/errors";
import { createClient } from "@/src/lib/supabase/client";
import type { Database } from "@/src/types/database";

export type UserProfileRow = Database["public"]["Tables"]["user_profiles"]["Row"];

async function getCurrentUser() {
  const supabase = createClient();
  const { data } = await supabase.auth.getUser();

  if (!data.user) {
    throw new AppError("Please sign in to continue.", 401);
  }

  return data.user;
}

export async function getUserProfile() {
  const user = await getCurrentUser();
  const supabase = createClient();
  const { data, error } = await supabase.from("user_profiles").select("*").eq("user_id", user.id).maybeSingle();

  if (error) {
    throw error;
  }

  if (data) {
    return { ...data, email: user.email ?? "" };
  }

  const fallback = {
    user_id: user.id,
    full_name: user.user_metadata?.full_name ?? user.email?.split("@")[0] ?? "",
    phone: null,
    avatar_url: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  } satisfies UserProfileRow;

  const { data: inserted, error: insertError } = await supabase.from("user_profiles").upsert(fallback).select("*").single();

  if (insertError) {
    throw insertError;
  }

  return { ...inserted, email: user.email ?? "" };
}

export async function updateUserProfile(values: { full_name: string; phone?: string | null; avatar_url?: string | null }) {
  const user = await getCurrentUser();
  const supabase = createClient();

  const payload: Database["public"]["Tables"]["user_profiles"]["Update"] = {
    full_name: values.full_name,
    phone: values.phone ?? null,
  };

  if (typeof values.avatar_url !== "undefined") {
    payload.avatar_url = values.avatar_url;
  }

  const { data, error } = await supabase
    .from("user_profiles")
    .upsert({ user_id: user.id, ...payload })
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return { ...data, email: user.email ?? "" };
}

export async function uploadAvatar(file: File) {
  const user = await getCurrentUser();
  const supabase = createClient();
  const extension = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
  const filePath = `${user.id}/${Date.now()}-${Math.random().toString(36).slice(2)}.${extension}`;

  const candidateBuckets = ["avatars", "product-images"];
  let uploadedBucket: string | null = null;
  let lastUploadError: { message?: string } | null = null;

  for (const bucket of candidateBuckets) {
    const { error: uploadError } = await supabase.storage.from(bucket).upload(filePath, file, {
      cacheControl: "3600",
      upsert: true,
    });

    if (!uploadError) {
      uploadedBucket = bucket;
      break;
    }

    lastUploadError = uploadError;

    if (!uploadError.message?.toLowerCase().includes("bucket not found")) {
      throw uploadError;
    }
  }

  if (!uploadedBucket) {
    if (lastUploadError) {
      throw new AppError(lastUploadError.message || "Avatar bucket is not available.", 400);
    }

    throw new AppError("Avatar bucket is not available.", 400);
  }

  const { data } = supabase.storage.from(uploadedBucket).getPublicUrl(filePath);

  if (!data.publicUrl) {
    throw new AppError("Avatar upload completed but URL could not be generated.", 500);
  }

  const updated = await updateUserProfile({
    full_name: user.user_metadata?.full_name ?? user.email?.split("@")[0] ?? "",
    avatar_url: data.publicUrl,
  });

  return updated;
}
