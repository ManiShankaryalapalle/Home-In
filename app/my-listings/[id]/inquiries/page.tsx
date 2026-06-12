"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { fetchListingById, fetchReceivedInquiries } from "@/lib/supabase-listings";

export default function ListingInquiriesPage() {
  const params = useParams<{ id: string }>();

  const [listing, setListing] = useState<any | null>(null);
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const listingData = await fetchListingById(params.id);
      const inquiryData = await fetchReceivedInquiries(params.id);

      setListing(listingData);
      setInquiries(inquiryData);
      setLoading(false);
    }

    loadData();
  }, [params.id]);

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
        Loading inquiries...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/my-listings"
          className="inline-block rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300"
        >
          ← Back to My Listings
        </Link>

        <h1 className="mt-6 text-3xl font-bold">Listing Inquiries</h1>

        <p className="mt-2 text-slate-400">
          {listing?.title ?? "Selected listing"}
        </p>

        {inquiries.length === 0 ? (
          <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-8 text-slate-400">
            No inquiries received yet.
          </div>
        ) : (
          <div className="mt-8 space-y-4">
            {inquiries.map((inquiry) => (
              <div
                key={inquiry.id}
                className="rounded-3xl border border-white/10 bg-white/5 p-6"
              >
                <div className="flex flex-wrap justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-semibold">{inquiry.name}</h2>
                    <p className="text-sm text-slate-400">{inquiry.email}</p>
                  </div>

                  <p className="text-sm text-slate-500">
                    {new Date(inquiry.created_at).toLocaleString()}
                  </p>
                </div>

                <p className="mt-4 whitespace-pre-line text-sm leading-6 text-slate-300">
                  {inquiry.message}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}