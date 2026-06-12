"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import {
  deleteListing,
  fetchMyListings,
} from "@/lib/supabase-listings";
import DeleteListingModal from "@/components/modals/DeleteListingModal";

export default function MyListingsPage() {
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [listingToDelete, setListingToDelete] = useState<any | null>(null);

  async function loadListings() {
    const data = await fetchMyListings();
    setListings(data);
    setLoading(false);
  }

  useEffect(() => {
    loadListings();
  }, []);

  async function confirmDelete() {
    if (!listingToDelete) return;

    try {
      setDeletingId(listingToDelete.id);

      const imageUrls = [
        listingToDelete.image,
        ...(listingToDelete.images ?? []),
      ].filter(Boolean);

      await deleteListing(listingToDelete.id, imageUrls);

      toast.success("Listing deleted.", { id: "delete-listing-toast" });
      setListingToDelete(null);
      await loadListings();
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete listing.", {
        id: "delete-listing-toast",
      });
    } finally {
      setDeletingId(null);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
        Loading...
      </main>
    );
  }

  return (
    <>
      <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
        <div className="mx-auto max-w-6xl">
          <h1 className="text-3xl font-bold">My Listings</h1>

          {listings.length === 0 ? (
            <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-8">
              No listings posted yet.
            </div>
          ) : (
            <div className="mt-8 grid gap-6 md:grid-cols-2">
              {listings.map((listing) => (
                <div
                  key={listing.id}
                  className="overflow-hidden rounded-3xl border border-white/10 bg-white/5"
                >
                  <img
                    src={listing.image}
                    alt={listing.title}
                    className="h-56 w-full object-cover"
                  />

                  <div className="p-5">
                    <h2 className="text-lg font-semibold">{listing.title}</h2>

                    <p className="mt-2 text-slate-400">{listing.city}</p>

                    <p className="mt-2 font-bold">${listing.price}/mo</p>

                    <div className="mt-4 flex flex-wrap gap-3">
                      <Link
                        href={`/listing/${listing.id}`}
                        className="rounded-2xl bg-white px-4 py-2 text-sm font-medium text-slate-950"
                      >
                        View
                      </Link>
                      <Link
  href={`/edit-listing/${listing.id}`}
  className="rounded-2xl border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-300 transition hover:bg-cyan-400/20"
>
  Edit
</Link>
<Link
  href={`/my-listings/${listing.id}/inquiries`}
  className="rounded-2xl border border-emerald-400/30 bg-emerald-400/10 px-4 py-2 text-sm text-emerald-300 transition hover:bg-emerald-400/20"
>
  Inquiries
</Link>

                      <button
                        onClick={() => setListingToDelete(listing)}
                        disabled={deletingId === listing.id}
                        className="rounded-2xl border border-red-400/30 bg-red-400/10 px-4 py-2 text-sm text-red-300 transition hover:bg-red-400/20 disabled:opacity-50"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <DeleteListingModal
        isOpen={Boolean(listingToDelete)}
        listingTitle={listingToDelete?.title ?? ""}
        isDeleting={Boolean(deletingId)}
        onClose={() => setListingToDelete(null)}
        onConfirm={confirmDelete}
      />
    </>
  );
}