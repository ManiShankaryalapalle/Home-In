import { supabase } from "@/lib/supabase";

export async function fetchListings() {
  const { data, error } = await supabase
    .from("listings")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return [];
  }

  return data || [];
}

export async function createListing(listing: any) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not authenticated");
  }

  const { data, error } = await supabase
    .from("listings")
    .insert([
      {
        ...listing,
        user_id: user.id,
      },
    ])
    .select()
    .single();

  if (error) {
    console.error(error);
    throw error;
  }

  return data;
}
export async function fetchListingById(id: string) {
  const { data, error } = await supabase
    .from("listings")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error(error);
    return null;
  }

  return data;
}
export async function fetchMyListings() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return [];

  const { data, error } = await supabase
    .from("listings")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return [];
  }

  return data || [];
}
export async function deleteListing(id: string, imageUrls: string[] = []) {
  const { error } = await supabase.from("listings").delete().eq("id", id);

  if (error) {
    console.error(error);
    throw error;
  }

  const filePaths = imageUrls
    .filter((url) => url.includes("/listing-images/"))
    .map((url) => url.split("/listing-images/")[1]);

  if (filePaths.length > 0) {
    await supabase.storage.from("listing-images").remove(filePaths);
  }
}
export async function updateListing(id: string, updates: any) {
  const { data, error } = await supabase
    .from("listings")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error(error);
    throw error;
  }

  return data;
}
export async function createInquiry({
  listingId,
  name,
  email,
  message,
}: {
  listingId: string;
  name: string;
  email: string;
  message: string;
}) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("User not authenticated");

  const { data, error } = await supabase
    .from("inquiries")
    .insert([
      {
        listing_id: listingId,
        sender_id: user.id,
        name,
        email,
        message,
      },
    ])
    .select()
    .single();

  if (error) throw error;

  return data;
}

export async function fetchReceivedInquiries(listingId: string) {
  const { data, error } = await supabase
    .from("inquiries")
    .select("*")
    .eq("listing_id", listingId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return [];
  }

  return data || [];
}
export async function fetchSentInquiries() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return [];

  const { data, error } = await supabase
    .from("inquiries")
    .select(`
      *,
      listings (
        id,
        title,
        city,
        image
      )
    `)
    .eq("sender_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return [];
  }

  return data || [];
}

export async function fetchAllReceivedInquiries() {
  const { data, error } = await supabase
    .from("inquiries")
    .select(`
      *,
      listings (
        id,
        title,
        city,
        image,
        user_id
      )
    `)
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return [];
  }

  return data || [];
}