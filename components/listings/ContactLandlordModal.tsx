"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "@/components/context/AuthContext";
import { createInquiry } from "@/lib/supabase-listings";

export default function ContactLandlordModal({
  isOpen,
  onClose,
  listingId,
  listingTitle,
}: {
  isOpen: boolean;
  onClose: () => void;
  listingId: string;
  listingTitle: string;
}) {
  const { user } = useAuth();
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setMessage(
        `Hi, I’m interested in "${listingTitle}". Is it still available?`
      );
    }
  }, [isOpen, listingTitle]);

  useEffect(() => {
    if (!isOpen) return;

    function handleEsc(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen || !user) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!message.trim()) {
      toast.error("Please enter a message.", { id: "contact-toast" });
      return;
    }

    try {
      setSending(true);

      await createInquiry({
        listingId,
        name: user.name,
        email: user.email,
        message,
      });

      toast.success("Message sent to landlord.", { id: "contact-toast" });
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Failed to send message.", { id: "contact-toast" });
    } finally {
      setSending(false);
    }
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
            disabled={sending}
            className="rounded-full bg-white/10 px-3 py-1 text-white transition hover:bg-white/20 disabled:opacity-50"
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
          <div>
            <label className="mb-2 block text-sm text-slate-300">Message</label>
            <textarea
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={sending}
              className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200 transition hover:bg-white/10 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={sending}
              className="rounded-2xl bg-white px-4 py-3 text-sm font-medium text-slate-950 transition hover:scale-[1.01] disabled:opacity-50"
            >
              {sending ? "Sending..." : "Send Message"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}