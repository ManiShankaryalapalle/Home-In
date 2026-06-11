"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/context/AuthContext";
import Link from "next/link";

type Inquiry = {
  id: string;
  listingTitle: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
};

const INQUIRIES_KEY = "home-in-inquiries";

export default function InquiriesPage() {
  const { isLoggedIn, user } = useAuth();
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(INQUIRIES_KEY);
    const allInquiries: Inquiry[] = stored ? JSON.parse(stored) : [];

    setInquiries(
      allInquiries.filter((inquiry) => inquiry.email === user?.email)
    );
  }, [user?.email]);

  if (!isLoggedIn) {
    return (
      <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
        <div className="mx-auto max-w-3xl rounded-3xl border border-white/10 bg-white/5 p-8 text-center">
          <h1 className="text-3xl font-bold">My Inquiries</h1>
          <p className="mt-3 text-slate-400">
            Please sign in to view your inquiries.
          </p>
          <Link
            href="/signin"
            className="mt-6 inline-block rounded-2xl bg-white px-5 py-3 text-sm font-medium text-slate-950"
          >
            Sign In
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-3xl font-bold">My Inquiries</h1>
        <p className="mt-2 text-slate-400">
          Messages you have sent to landlords.
        </p>

        {inquiries.length === 0 ? (
          <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-10 text-center text-slate-400">
            No inquiries sent yet.
          </div>
        ) : (
          <div className="mt-8 space-y-4">
            {inquiries.map((inquiry) => (
              <div
                key={inquiry.id}
                className="rounded-3xl border border-white/10 bg-white/5 p-6"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-semibold">
                      {inquiry.listingTitle}
                    </h2>
                    <p className="mt-1 text-sm text-slate-400">
                      Sent on{" "}
                      {new Date(inquiry.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>

                <p className="mt-4 text-sm leading-6 text-slate-300">
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