import { supabase } from "@/lib/supabase";

export async function uploadListingImage(file: File) {
  const fileExt = file.name.split(".").pop();

  const fileName = `${crypto.randomUUID()}.${fileExt}`;

  const { error } = await supabase.storage
    .from("listing-images")
    .upload(fileName, file);

  if (error) {
    throw error;
  }

  const { data } = supabase.storage
    .from("listing-images")
    .getPublicUrl(fileName);

  return data.publicUrl;
}