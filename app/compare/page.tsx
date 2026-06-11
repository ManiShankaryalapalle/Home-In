"use client";

import { useCompareListings } from "@/components/context/CompareListingsContext";
import { mockListings } from "@/data/mockListings";

export default function ComparePage() {
  const { compareIds } = useCompareListings();

  const listings = mockListings.filter((l) =>
    compareIds.includes(l.id)
  );

  if (listings.length === 0) {
    return (
      <main className="min-h-screen bg-slate-950 px-6 py-12 text-white text-center">
        <h1 className="text-3xl font-bold">Compare Listings</h1>
        <p className="mt-4 text-slate-400">
          Select listings to compare.
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-3xl font-bold">Compare Listings</h1>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {listings.map((listing) => (
            <div
              key={listing.id}
              className="rounded-3xl border border-white/10 bg-white/5 p-6"
            >
              <h2 className="text-lg font-semibold">{listing.title}</h2>

              <p className="mt-2">${listing.price}/mo</p>
              <p>{listing.neighborhood}</p>
              <p>{listing.bedrooms} bed</p>
              <p>{listing.bathrooms} bath</p>
              <p>{listing.sqft} sqft</p>
              <p>{listing.aiMatchScore}% match</p>
              <p>{listing.priceInsight}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}