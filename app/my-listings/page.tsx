"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import {
  deleteListing,
  fetchMyListings,
} from "@/lib/supabase-listings";

export default function MyListingsPage() {
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function loadListings() {
    const data = await fetchMyListings();
    setListings(data);
    setLoading(false);
  }

  useEffect(() => {
    loadListings();
  }, []);

  async function handleDelete(listing: any) {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${listing.title}"?`
    );

    if (!confirmed) return;

    try {
      setDeletingId(listing.id);

      const imageUrls = [
        listing.image,
        ...(listing.images ?? []),
      ].filter(Boolean);

      await deleteListing(listing.id, imageUrls);

      toast.success("Listing deleted.", { id: "delete-listing-toast" });
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

                    <button
                      onClick={() => handleDelete(listing)}
                      disabled={deletingId === listing.id}
                      className="rounded-2xl border border-red-400/30 bg-red-400/10 px-4 py-2 text-sm text-red-300 transition hover:bg-red-400/20 disabled:opacity-50"
                    >
                      {deletingId === listing.id ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}