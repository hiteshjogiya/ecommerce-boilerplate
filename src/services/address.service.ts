import { AppError } from "@/src/lib/errors";
import { createClient } from "@/src/lib/supabase/client";
import type { Database } from "@/src/types/database";

export type AddressRow = Database["public"]["Tables"]["addresses"]["Row"];
export type AddressInsert = Database["public"]["Tables"]["addresses"]["Insert"];
export type AddressUpdate = Database["public"]["Tables"]["addresses"]["Update"];

async function getAuthenticatedUserId() {
  const supabase = createClient();
  const { data } = await supabase.auth.getUser();
  const userId = data.user?.id;

  if (!userId) {
    throw new AppError("Please sign in to continue checkout.", 401);
  }

  return userId;
}

export async function getAddresses() {
  const userId = await getAuthenticatedUserId();
  const supabase = createClient();
  const { data, error } = await supabase
    .from("addresses")
    .select("*")
    .eq("user_id", userId)
    .order("is_default", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return (data ?? []) as AddressRow[];
}

export async function addAddress(input: Omit<AddressInsert, "user_id">) {
  const userId = await getAuthenticatedUserId();
  const supabase = createClient();

  if (input.is_default) {
    const { error: resetError } = await supabase.from("addresses").update({ is_default: false }).eq("user_id", userId);

    if (resetError) {
      throw resetError;
    }
  }

  const { data, error } = await supabase
    .from("addresses")
    .insert({ ...input, user_id: userId })
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return data as AddressRow;
}

export async function updateAddress(addressId: string, input: Omit<AddressUpdate, "user_id">) {
  const userId = await getAuthenticatedUserId();
  const supabase = createClient();

  if (input.is_default) {
    const { error: resetError } = await supabase.from("addresses").update({ is_default: false }).eq("user_id", userId);

    if (resetError) {
      throw resetError;
    }
  }

  const { data, error } = await supabase
    .from("addresses")
    .update(input)
    .eq("id", addressId)
    .eq("user_id", userId)
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return data as AddressRow;
}

export async function deleteAddress(addressId: string) {
  const userId = await getAuthenticatedUserId();
  const supabase = createClient();

  const { data: targetAddress, error: readError } = await supabase
    .from("addresses")
    .select("id, is_default")
    .eq("id", addressId)
    .eq("user_id", userId)
    .maybeSingle();

  if (readError) {
    throw readError;
  }

  if (!targetAddress) {
    return;
  }

  const { error } = await supabase.from("addresses").delete().eq("id", addressId).eq("user_id", userId);

  if (error) {
    throw error;
  }

  if (targetAddress.is_default) {
    const { data: nextDefault, error: nextError } = await supabase
      .from("addresses")
      .select("id")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (nextError) {
      throw nextError;
    }

    if (nextDefault?.id) {
      const { error: setError } = await supabase
        .from("addresses")
        .update({ is_default: true })
        .eq("id", nextDefault.id)
        .eq("user_id", userId);

      if (setError) {
        throw setError;
      }
    }
  }
}

export async function setDefaultAddress(addressId: string) {
  const userId = await getAuthenticatedUserId();
  const supabase = createClient();

  const { error: resetError } = await supabase.from("addresses").update({ is_default: false }).eq("user_id", userId);

  if (resetError) {
    throw resetError;
  }

  const { data, error } = await supabase
    .from("addresses")
    .update({ is_default: true })
    .eq("id", addressId)
    .eq("user_id", userId)
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return data as AddressRow;
}
