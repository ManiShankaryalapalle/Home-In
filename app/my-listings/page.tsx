"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchMyListings } from "@/lib/supabase-listings";

export default function MyListingsPage() {
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadListings() {
      const data = await fetchMyListings();
      setListings(data);
      setLoading(false);
    }

    loadListings();
  }, []);

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
                className="rounded-3xl border border-white/10 bg-white/5 overflow-hidden"
              >
                <img
                  src={listing.image}
                  alt={listing.title}
                  className="h-56 w-full object-cover"
                />

                <div className="p-5">
                  <h2 className="text-lg font-semibold">
                    {listing.title}
                  </h2>

                  <p className="mt-2 text-slate-400">
                    {listing.city}
                  </p>

                  <p className="mt-2 font-bold">
                    ${listing.price}/mo
                  </p>

                  <div className="mt-4 flex gap-3">
                    <Link
                      href={`/listing/${listing.id}`}
                      className="rounded-2xl bg-white px-4 py-2 text-sm font-medium text-slate-950"
                    >
                      View
                    </Link>
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