"use client";

import { useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { useCompareListings } from "@/components/context/CompareListingsContext";
import { useSavedListings } from "@/components/context/SavedListingsContext";
import { useAuth } from "@/components/context/AuthContext";
import ContactLandlordModal from "@/components/listings/ContactLandlordModal";

export default function ListingDetailsActions({
  listingId,
  listingTitle,
}: {
  listingId: string;
  listingTitle: string;
}) {
  const { toggleSaved, isSaved } = useSavedListings();
  const { toggleCompare, isCompared } = useCompareListings();
  const { isLoggedIn } = useAuth();

  const [isContactOpen, setIsContactOpen] = useState(false);

  const saved = isSaved(listingId);
  const compared = isCompared(listingId);

  function handleContactClick() {
    if (!isLoggedIn) {
      toast.error("Please sign in to contact the landlord.", {
        id: "contact-auth-toast",
      });
      return;
    }

    setIsContactOpen(true);
  }

  return (
    <>
      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => toggleSaved(listingId)}
          className={`rounded-2xl border px-4 py-2 text-sm transition ${
            saved
              ? "border-pink-400/30 bg-pink-400/10 text-pink-300"
              : "border-white/10 bg-white/5 text-slate-200 hover:bg-white/10"
          }`}
        >
          {saved ? "Saved" : "Save"}
        </button>

        <button
          onClick={() => toggleCompare(listingId)}
          className={`rounded-2xl border px-4 py-2 text-sm transition ${
            compared
              ? "border-cyan-400/30 bg-cyan-400/20 text-cyan-300"
              : "border-cyan-400/20 bg-cyan-400/10 text-cyan-300 hover:bg-cyan-400/20"
          }`}
        >
          {compared ? "Compared" : "Compare"}
        </button>

        <button
          onClick={handleContactClick}
          className="rounded-2xl bg-white px-4 py-2 text-sm font-medium text-slate-950 transition hover:scale-[1.02]"
        >
          Contact Landlord
        </button>

        <Link
          href="/saved"
          className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200 transition hover:bg-white/10"
        >
          Go to Saved
        </Link>

        <Link
          href="/compare"
          className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200 transition hover:bg-white/10"
        >
          Go to Compare
        </Link>
      </div>

      <ContactLandlordModal
  isOpen={isContactOpen}
  onClose={() => setIsContactOpen(false)}
  listingId={listingId}
  listingTitle={listingTitle}
/>
    </>
  );
}