"use client";

import ListingCard from "@/components/listings/ListingCard";
import { useSavedListings } from "@/components/context/SavedListingsContext";
import { mockListings } from "@/data/mockListings";

export default function SavedPage() {
  const { savedIds } = useSavedListings();

  const savedListings = mockListings.filter((listing) =>
    savedIds.includes(listing.id)
  );

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
      <div className="mx-auto max-w-7xl">
        <h1 className="text-3xl font-bold">Saved Listings</h1>
        <p className="mt-2 text-slate-400">
          Your shortlisted homes will appear here.
        </p>

        <p className="mt-4 text-sm text-yellow-300">
          Saved IDs: {savedIds.length > 0 ? savedIds.join(", ") : "none"}
        </p>

        {savedListings.length === 0 ? (
          <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-10 text-center text-slate-400">
            No saved listings yet.
          </div>
        ) : (
          <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {savedListings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}