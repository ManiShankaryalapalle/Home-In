"use client";

export default function DeleteListingModal({
  isOpen,
  listingTitle,
  isDeleting,
  onClose,
  onConfirm,
}: {
  isOpen: boolean;
  listingTitle: string;
  isDeleting: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-slate-950 p-6 text-white shadow-2xl">
        <h2 className="text-2xl font-semibold">Delete Listing</h2>

        <p className="mt-4 text-sm leading-6 text-slate-300">
          Are you sure you want to delete{" "}
          <span className="font-semibold text-white">"{listingTitle}"</span>?
          This action cannot be undone.
        </p>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200 transition hover:bg-white/10 disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="rounded-2xl border border-red-400/30 bg-red-400/10 px-4 py-2 text-sm text-red-300 transition hover:bg-red-400/20 disabled:opacity-50"
          >
            {isDeleting ? "Deleting..." : "Delete Listing"}
          </button>
        </div>
      </div>
    </div>
  );
}