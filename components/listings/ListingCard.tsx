"use client";

import Link from "next/link";
import toast from "react-hot-toast";
import { useCompareListings } from "@/components/context/CompareListingsContext";
import { Listing } from "@/types/listing";
import { useSavedListings } from "@/components/context/SavedListingsContext";

export default function ListingCard({ listing }: { listing: Listing }) {
  const { toggleSaved, isSaved } = useSavedListings();
  const saved = isSaved(listing.id);

  const { toggleCompare, isCompared } = useCompareListings();
  const compared = isCompared(listing.id);

  return (
    <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 transition hover:border-cyan-400/30">
      <Link href={`/listing/${listing.id}`} className="block cursor-pointer">
        <img
          src={listing.image}
          alt={listing.title}
          className="h-56 w-full object-cover"
        />
      </Link>

      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <Link href={`/listing/${listing.id}`} className="block">
              <h2 className="text-lg font-semibold hover:text-cyan-300">
                {listing.title}
              </h2>
            </Link>
            <p className="text-sm text-slate-400">
              {listing.neighborhood}, {listing.city}
            </p>
          </div>

          <div className="text-right">
            <p className="text-lg font-bold">${listing.price}/mo</p>
            <p className="text-xs text-cyan-300">
              {listing.aiMatchScore}% match
            </p>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2 text-xs">
          <span className="rounded-full bg-white/10 px-3 py-1">
            {listing.bedrooms} bed
          </span>
          <span className="rounded-full bg-white/10 px-3 py-1">
            {listing.bathrooms} bath
          </span>
          <span className="rounded-full bg-white/10 px-3 py-1">
            {listing.sqft} sqft
          </span>
          <span className="rounded-full bg-emerald-400/10 px-3 py-1 text-emerald-300">
            {listing.priceInsight}
          </span>
        </div>

        {listing.aiReasons && listing.aiReasons.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {listing.aiReasons.slice(0, 3).map((reason) => (
              <span
                key={reason}
                className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs text-cyan-300"
              >
                {reason}
              </span>
            ))}
          </div>
        )}

        <p className="mt-4 text-sm text-slate-300">
          Source: {listing.source}
        </p>

        <div className="mt-5 flex gap-3">
          <button
            onClick={() => {
              toggleSaved(listing.id);
              toast.success(saved ? "Removed from saved" : "Added to saved", {
                id: "save-toast",
              });
            }}
            className={`rounded-2xl border px-4 py-2 text-sm transition ${
              saved
                ? "border-pink-400/30 bg-pink-400/10 text-pink-300"
                : "border-white/10 bg-white/5 text-slate-200 hover:bg-white/10"
            }`}
          >
            {saved ? "Saved" : "Save"}
          </button>

          <button
            onClick={() => {
              toggleCompare(listing.id);
              toast.success(
                compared ? "Removed from compare" : "Added to compare",
                { id: "compare-toast" }
              );
            }}
            className={`rounded-2xl border px-4 py-2 text-sm transition ${
              compared
                ? "border-cyan-400/30 bg-cyan-400/20 text-cyan-300"
                : "border-cyan-400/20 bg-cyan-400/10 text-cyan-300 hover:bg-cyan-400/20"
            }`}
          >
            {compared ? "Compared" : "Compare"}
          </button>

          <Link
            href={`/listing/${listing.id}`}
            className="rounded-2xl bg-white px-4 py-2 text-sm font-medium text-slate-950 transition hover:scale-[1.02]"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}