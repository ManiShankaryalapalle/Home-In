"use client";

import { useEffect, useState } from "react";
import { notFound, useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  fetchListingById,
  updateListing,
} from "@/lib/supabase-listings";

function getDescriptionOnly(description: string | null) {
  if (!description) return "";
  return description.split("Furnishing:")[0].trim();
}

function getFurnishing(description: string | null) {
  if (!description) return "fully furnished";
  const match = description.match(/Furnishing:\s*(.*)/i);
  return match?.[1]?.split("\n")[0]?.trim() || "fully furnished";
}

function hasAmenity(description: string | null, amenity: string) {
  if (!description) return false;
  return description.toLowerCase().includes(amenity.toLowerCase());
}

export default function EditListingPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [bedrooms, setBedrooms] = useState("");
  const [bathrooms, setBathrooms] = useState("");
  const [description, setDescription] = useState("");

  const [furnishing, setFurnishing] = useState("fully furnished");

  const [hotWaterIncluded, setHotWaterIncluded] = useState(false);
  const [wifiIncluded, setWifiIncluded] = useState(false);
  const [parkingIncluded, setParkingIncluded] = useState(false);
  const [electricityIncluded, setElectricityIncluded] = useState(false);

  useEffect(() => {
    async function loadListing() {
      const listing = await fetchListingById(params.id);

      if (!listing) {
        setLoading(false);
        return;
      }

      setTitle(listing.title ?? "");
      setPrice(String(listing.price ?? ""));
      setCity(listing.city ?? "");
      setAddress(listing.neighborhood ?? "");
      setBedrooms(String(listing.bedrooms ?? ""));
      setBathrooms(String(listing.bathrooms ?? ""));
      setDescription(getDescriptionOnly(listing.description));
      setFurnishing(getFurnishing(listing.description));

      setHotWaterIncluded(hasAmenity(listing.description, "Hot Water Included"));
      setWifiIncluded(hasAmenity(listing.description, "WiFi Included"));
      setParkingIncluded(hasAmenity(listing.description, "Parking Included"));
      setElectricityIncluded(
        hasAmenity(listing.description, "Electricity Included")
      );

      setLoading(false);
    }

    loadListing();
  }, [params.id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!title || !price || !city || !address || !bedrooms || !bathrooms) {
      toast.error("Please fill all required fields.", {
        id: "edit-listing-toast",
      });
      return;
    }

    try {
      setSaving(true);

      await updateListing(params.id, {
        title,
        description: `
${description}

Furnishing: ${furnishing}

Amenities:
${hotWaterIncluded ? "• Hot Water Included\n" : ""}
${wifiIncluded ? "• WiFi Included\n" : ""}
${parkingIncluded ? "• Parking Included\n" : ""}
${electricityIncluded ? "• Electricity Included\n" : ""}
`,
        price: Number(price),
        city,
        neighborhood: address,
        bedrooms: Number(bedrooms),
        bathrooms: Number(bathrooms),
      });

      toast.success("Listing updated successfully.", {
        id: "edit-listing-toast",
      });

      router.push("/my-listings");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update listing.", {
        id: "edit-listing-toast",
      });
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
        Loading listing...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
      <div className="mx-auto max-w-3xl rounded-3xl border border-white/10 bg-white/5 p-8">
        <h1 className="text-3xl font-bold">Edit Listing</h1>
        <p className="mt-2 text-slate-400">
          Update your property details.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <input
            type="text"
            placeholder="Listing title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3"
          />

          <textarea
            placeholder="Description"
            rows={5}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3"
          />

          <div className="grid gap-4 md:grid-cols-2">
            <input
              type="number"
              placeholder="Price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="rounded-2xl border border-white/10 bg-slate-900 px-4 py-3"
            />

            <input
              type="text"
              placeholder="City"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="rounded-2xl border border-white/10 bg-slate-900 px-4 py-3"
            />

            <input
              type="text"
              placeholder="Full address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="rounded-2xl border border-white/10 bg-slate-900 px-4 py-3"
            />

            <input
              type="number"
              placeholder="Bedrooms"
              value={bedrooms}
              onChange={(e) => setBedrooms(e.target.value)}
              className="rounded-2xl border border-white/10 bg-slate-900 px-4 py-3"
            />

            <input
              type="number"
              placeholder="Bathrooms"
              value={bathrooms}
              onChange={(e) => setBathrooms(e.target.value)}
              className="rounded-2xl border border-white/10 bg-slate-900 px-4 py-3"
            />

            <select
              value={furnishing}
              onChange={(e) => setFurnishing(e.target.value)}
              className="rounded-2xl border border-white/10 bg-slate-900 px-4 py-3"
            >
              <option value="fully furnished">Fully Furnished</option>
              <option value="semi furnished">Semi Furnished</option>
              <option value="not furnished">Not Furnished</option>
            </select>
          </div>

          <div className="space-y-3 rounded-2xl border border-white/10 bg-slate-900/50 p-4">
            <h3 className="text-sm font-medium text-white">
              Included Amenities
            </h3>

            <label className="flex items-center gap-3 text-sm text-slate-300">
              <input
                type="checkbox"
                checked={hotWaterIncluded}
                onChange={(e) => setHotWaterIncluded(e.target.checked)}
              />
              Hot Water Included
            </label>

            <label className="flex items-center gap-3 text-sm text-slate-300">
              <input
                type="checkbox"
                checked={wifiIncluded}
                onChange={(e) => setWifiIncluded(e.target.checked)}
              />
              WiFi Included
            </label>

            <label className="flex items-center gap-3 text-sm text-slate-300">
              <input
                type="checkbox"
                checked={parkingIncluded}
                onChange={(e) => setParkingIncluded(e.target.checked)}
              />
              Parking Provided
            </label>

            <label className="flex items-center gap-3 text-sm text-slate-300">
              <input
                type="checkbox"
                checked={electricityIncluded}
                onChange={(e) => setElectricityIncluded(e.target.checked)}
              />
              Electricity Bill Included
            </label>
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={saving}
              className="rounded-2xl bg-white px-5 py-3 font-medium text-slate-950 disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>

            <button
              type="button"
              onClick={() => router.push("/my-listings")}
              className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-slate-200"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}