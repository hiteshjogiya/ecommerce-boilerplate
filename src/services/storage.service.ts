import { createServerSupabaseClient } from "@/src/lib/supabase/server";

const BUCKET_NAME = "product-images";

export async function uploadProductImage(file: File, fileName: string) {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.storage.from(BUCKET_NAME).upload(fileName, file, {
    cacheControl: "3600",
    upsert: true,
  });

  if (error) {
    throw error;
  }

  return data;
}

export async function deleteProductImage(filePath: string) {
  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.storage.from(BUCKET_NAME).remove([filePath]);

  if (error) {
    throw error;
  }
}
