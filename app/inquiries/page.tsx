"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  fetchAllReceivedInquiries,
  fetchSentInquiries,
} from "@/lib/supabase-listings";

export default function InquiriesPage() {
  const [activeTab, setActiveTab] = useState<"received" | "sent">("received");
  const [received, setReceived] = useState<any[]>([]);
  const [sent, setSent] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadInquiries() {
      const receivedData = await fetchAllReceivedInquiries();
      const sentData = await fetchSentInquiries();

      setReceived(receivedData);
      setSent(sentData);
      setLoading(false);
    }

    loadInquiries();
  }, []);

  const currentList = activeTab === "received" ? received : sent;

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
        <h1 className="text-3xl font-bold">Inquiries</h1>
        <p className="mt-2 text-slate-400">
          View messages you received and messages you sent.
        </p>

        <div className="mt-6 flex gap-3">
          <button
            onClick={() => setActiveTab("received")}
            className={`rounded-2xl px-4 py-2 text-sm transition ${
              activeTab === "received"
                ? "bg-white text-slate-950"
                : "border border-white/10 bg-white/5 text-slate-300"
            }`}
          >
            Received ({received.length})
          </button>

          <button
            onClick={() => setActiveTab("sent")}
            className={`rounded-2xl px-4 py-2 text-sm transition ${
              activeTab === "sent"
                ? "bg-white text-slate-950"
                : "border border-white/10 bg-white/5 text-slate-300"
            }`}
          >
            Sent ({sent.length})
          </button>
        </div>

        {currentList.length === 0 ? (
          <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-8 text-slate-400">
            No {activeTab} inquiries yet.
          </div>
        ) : (
          <div className="mt-8 space-y-4">
            {currentList.map((inquiry) => (
              <div
                key={inquiry.id}
                className="rounded-3xl border border-white/10 bg-white/5 p-6"
              >
                <div className="flex flex-wrap justify-between gap-4">
                  <div>
                    <p className="text-sm text-cyan-300">
                      {activeTab === "received" ? "Received for" : "Sent about"}
                    </p>

                    <h2 className="mt-1 text-lg font-semibold">
                      {inquiry.listings?.title ?? "Listing"}
                    </h2>

                    <p className="mt-1 text-sm text-slate-400">
                      {inquiry.listings?.city}
                    </p>
                  </div>

                  <p className="text-sm text-slate-500">
                    {new Date(inquiry.created_at).toLocaleString()}
                  </p>
                </div>

                <div className="mt-4 rounded-2xl bg-slate-900/60 p-4">
                  <p className="text-sm text-slate-400">
                    {activeTab === "received" ? "From" : "You sent as"}:
                  </p>
                  <p className="mt-1 text-sm text-white">
                    {inquiry.name} — {inquiry.email}
                  </p>

                  <p className="mt-4 whitespace-pre-line text-sm leading-6 text-slate-300">
                    {inquiry.message}
                  </p>
                </div>

                <Link
                  href={`/listing/${inquiry.listing_id}`}
                  className="mt-4 inline-block rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200 transition hover:bg-white/10"
                >
                  View Listing
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}