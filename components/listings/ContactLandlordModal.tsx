"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "@/components/context/AuthContext";

type Inquiry = {
  id: string;
  listingTitle: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
};

const INQUIRIES_KEY = "home-in-inquiries";

export default function ContactLandlordModal({
  isOpen,
  onClose,
  listingTitle,
}: {
  isOpen: boolean;
  onClose: () => void;
  listingTitle: string;
}) {
  const { user } = useAuth();
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (isOpen) {
      setMessage(
        `Hi, I’m interested in "${listingTitle}". Is it still available?`
      );
    }
  }, [isOpen, listingTitle]);

  if (!isOpen || !user) return null;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!message.trim()) {
      toast.error("Please enter a message.", { id: "contact-toast" });
      return;
    }

    const existing = localStorage.getItem(INQUIRIES_KEY);
    const inquiries: Inquiry[] = existing ? JSON.parse(existing) : [];

    const newInquiry: Inquiry = {
      id: crypto.randomUUID(),
      listingTitle,
      name: user.name,
      email: user.email,
      message,
      createdAt: new Date().toISOString(),
    };

    localStorage.setItem(
      INQUIRIES_KEY,
      JSON.stringify([newInquiry, ...inquiries])
    );

    toast.success("Message sent to landlord.", { id: "contact-toast" });
    onClose();
  }

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-lg rounded-3xl border border-white/10 bg-slate-950 p-6 text-white shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold">Contact Landlord</h2>
            <p className="mt-1 text-sm text-slate-400">{listingTitle}</p>
          </div>

          <button
            onClick={onClose}
            className="rounded-full bg-white/10 px-3 py-1 text-white transition hover:bg-white/20"
          >
            ✕
          </button>
        </div>

        <div className="mt-6 space-y-2 rounded-2xl bg-slate-900/60 p-4 text-sm">
          <p>
            <span className="text-slate-400">Name:</span> {user.name}
          </p>
          <p>
            <span className="text-slate-400">Email:</span> {user.email}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <textarea
            rows={5}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-white outline-none"
          />

          <button
            type="submit"
            className="w-full rounded-2xl bg-white px-4 py-3 text-sm font-medium text-slate-950 transition hover:scale-[1.01]"
          >
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
}