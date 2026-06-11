"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useAuth } from "@/components/context/AuthContext";
import { createListing } from "@/lib/supabase-listings";
import AddressSearch from "@/components/map/AddressSearch";

export default function PostListingPage() {
  const router = useRouter();
  const { isLoggedIn } = useAuth();

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

  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);

  if (!isLoggedIn) {
    return (
      <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
        <div className="mx-auto max-w-xl rounded-3xl border border-white/10 bg-white/5 p-8 text-center">
          <h1 className="text-3xl font-bold">Post Listing</h1>
          <p className="mt-4 text-slate-400">Please sign in first.</p>
        </div>
      </main>
    );
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    try {
      setUploading(true);

      const uploadedUrls = await Promise.all(
        files.map(async (file) => {
          const { uploadListingImage } = await import(
            "@/lib/supabase-storage"
          );

          return uploadListingImage(file);
        })
      );

      setImages((prev) => [...prev, ...uploadedUrls]);
    } catch (error) {
      console.error(error);
      toast.error("Failed to upload images.");
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (
      !title ||
      !price ||
      !city ||
      !address ||
      !bedrooms ||
      !bathrooms ||
      !latitude ||
      !longitude
    ) {
      toast.error("Please fill all required fields and select an address.", {
        id: "post-listing-toast",
      });
      return;
    }

    try {
      await createListing({
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
        sqft: 0,

        image:
          images[0] ||
          "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85",

        images,
        source: "Home-in",
        verified: false,
        ai_match_score: 90,
        price_insight: "fair",
        latitude,
        longitude,
      });

      toast.success("Listing posted successfully.", {
        id: "post-listing-toast",
      });

      router.push("/search");
    } catch (error) {
      console.error(error);
      toast.error("Failed to post listing.", {
        id: "post-listing-toast",
      });
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
      <div className="mx-auto max-w-3xl rounded-3xl border border-white/10 bg-white/5 p-8">
        <h1 className="text-3xl font-bold">Post a Listing</h1>

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

            <div className="space-y-3 md:col-span-2">
              <label className="text-sm font-medium text-slate-300">
                Property Address
              </label>

              <AddressSearch
  value={address}
  onChange={(value) => {
    setAddress(value);
  }}
  onSelect={(selectedAddress, lat, lng) => {
    setAddress(selectedAddress);
    setLatitude(lat);
    setLongitude(lng);
  }}
/>

              {latitude && longitude && (
                <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-3 text-sm text-emerald-300">
                  Location selected successfully
                  <br />
                  Lat: {latitude.toFixed(5)}
                  <br />
                  Lng: {longitude.toFixed(5)}
                </div>
              )}
            </div>

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

          <div>
            <label className="mb-3 block text-sm text-slate-300">
              Upload Images
            </label>

            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              className="block w-full text-sm text-slate-300"
            />

            {uploading && (
              <p className="mt-3 text-sm text-cyan-300">
                Uploading images...
              </p>
            )}

            {images.length > 0 && (
              <div className="mt-4 grid grid-cols-3 gap-3">
                {images.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt="Uploaded"
                    className="h-24 w-full rounded-2xl object-cover"
                  />
                ))}
              </div>
            )}
          </div>

          <button
            type="submit"
            className="rounded-2xl bg-white px-5 py-3 font-medium text-slate-950"
          >
            Post Listing
          </button>
        </form>
      </div>
    </main>
  );
}