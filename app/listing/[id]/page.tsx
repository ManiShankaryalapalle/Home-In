"use client";
import { useEffect,useMemo, useState } from "react";
import { fetchListingById } from "@/lib/supabase-listings";
import ListingImageCarousel from "@/components/listings/ListingImageCarousel";

import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { mockListings } from "@/data/mockListings";
import ListingDetailsActions from "@/components/listings/ListingDetailsActions";
import MapView from "@/components/map/MapView";
import NearbyPlaces, {
  Place,
  PlacesResponse,
} from "@/components/map/NearbyPlaces";

function getAmenityScore(listing: (typeof mockListings)[number]) {
  return (
    listing.nearbyPlaces.groceries +
    listing.nearbyPlaces.gyms +
    listing.nearbyPlaces.restaurants +
    listing.nearbyPlaces.transit +
    listing.nearbyPlaces.hospitals
  );
}

function getLivabilitySummary(listing: (typeof mockListings)[number]) {
  const amenityScore = getAmenityScore(listing);
  if (amenityScore >= 15) return "Excellent local convenience";
  if (amenityScore >= 8) return "Strong neighborhood access";
  return "Moderate neighborhood access";
}

function getTransitSummary(listing: (typeof mockListings)[number]) {
  if (listing.nearbyPlaces.transit >= 2) return "Very transit-friendly";
  if (listing.nearbyPlaces.transit >= 1) return "Transit available nearby";
  return "Limited transit access";
}

function getListingReasons(listing: (typeof mockListings)[number]) {
  const reasons: string[] = [];

  if (listing.verified) reasons.push("Verified listing");
  if (listing.priceInsight === "underpriced") reasons.push("Underpriced");
  if (listing.bedrooms >= 1) reasons.push("Practical bedroom layout");
  if (listing.bathrooms >= 1) reasons.push("Functional bathroom fit");
  if (listing.nearbyPlaces.transit > 0) reasons.push("Transit access");
  if (listing.nearbyPlaces.groceries > 0) reasons.push("Nearby groceries");

  return reasons;
}

export default function ListingDetailsPage() {
  const params = useParams<{ id: string }>();
  const [placesData, setPlacesData] = useState<PlacesResponse | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("");

  const [databaseListing, setDatabaseListing] = useState<any | null>(null);
const [loading, setLoading] = useState(true);

useEffect(() => {
  async function loadListing() {
    const result = await fetchListingById(params.id);
    setDatabaseListing(result);
    setLoading(false);
  }

  loadListing();
}, [params.id]);

  const allNearbyPlaces: Place[] = useMemo(() => {
    if (!placesData) return [];
    return Object.values(placesData.placesByCategory).flat();
  }, [placesData]);

if (loading) {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
      Loading listing...
    </main>
  );
}

if (!databaseListing) {
  notFound();
}
const listing = {
  id: databaseListing.id,
  title: databaseListing.title,
  price: databaseListing.price,
  city: databaseListing.city,
  neighborhood: databaseListing.neighborhood,
  bedrooms: databaseListing.bedrooms,
  bathrooms: databaseListing.bathrooms,
  sqft: databaseListing.sqft,
  image: databaseListing.image,
  images: databaseListing.images,
  source: databaseListing.source,
  verified: databaseListing.verified,
  aiMatchScore: databaseListing.ai_match_score ?? 90,
  priceInsight: databaseListing.price_insight ?? "fair",
  coordinates: {
    lat: databaseListing.latitude ?? 45.5017,
    lng: databaseListing.longitude ?? -73.5673,
  },
  nearbyPlaces: {
    groceries: 2,
    gyms: 2,
    transit: 1,
    restaurants: 5,
    hospitals: 1,
  },
};

  const aiReasons = getListingReasons(listing);
  const amenityScore = getAmenityScore(listing);
  const livabilitySummary = getLivabilitySummary(listing);
  const transitSummary = getTransitSummary(listing);

  

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
      <div className="mx-auto mb-6 max-w-6xl">
        <Link
          href="/search"
          className="inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300 transition hover:border-cyan-400/30 hover:text-white"
        >
          ← Back to Search
        </Link>
      </div>

      <div className="mx-auto max-w-6xl">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
  <ListingImageCarousel
    images={listing.images && listing.images.length > 0 ? listing.images : [listing.image]}
    title={listing.title}
  />
</div>

          <div>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm text-cyan-300">{listing.source}</p>
                <h1 className="mt-2 text-3xl font-bold">{listing.title}</h1>
                <p className="mt-2 text-slate-400">
                  {listing.neighborhood}, {listing.city}
                </p>
              </div>

              <div className="text-right">
                <p className="text-3xl font-bold">${listing.price}/mo</p>
                <p className="mt-1 text-sm text-emerald-300">
                  {listing.aiMatchScore}% AI match
                </p>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3 text-sm">
              <span className="rounded-full bg-white/10 px-4 py-2">
                {listing.bedrooms} bed
              </span>
              <span className="rounded-full bg-white/10 px-4 py-2">
                {listing.bathrooms} bath
              </span>
              <span className="rounded-full bg-white/10 px-4 py-2">
                {listing.sqft} sqft
              </span>
              <span className="rounded-full bg-emerald-400/10 px-4 py-2 text-emerald-300">
                {listing.priceInsight}
              </span>
              <span className="rounded-full bg-cyan-400/10 px-4 py-2 text-cyan-300">
                {listing.verified ? "Verified" : "Verification Pending"}
              </span>
            </div>

            {aiReasons.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {aiReasons.map((reason) => (
                  <span
                    key={reason}
                    className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs text-cyan-300"
                  >
                    {reason}
                  </span>
                ))}
              </div>
            )}

            <div className="mt-6">
              <ListingDetailsActions
  listingId={listing.id}
  listingTitle={listing.title}
/>
            </div>

            <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-6">
              <h2 className="text-xl font-semibold">Property Overview</h2>
              <p className="mt-4 text-slate-300">
                This rental offers a balanced mix of affordability, convenience,
                and location fit.
              </p>
            </div>

            <div className="mt-6 rounded-3xl border border-emerald-400/20 bg-emerald-400/10 p-6">
              <h2 className="text-xl font-semibold text-emerald-300">
                AI Rental Insight
              </h2>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl bg-slate-950/40 p-4">
                  <p className="text-sm text-slate-400">Price Signal</p>
                  <p className="mt-1 font-semibold text-white">
                    {listing.priceInsight === "underpriced"
                      ? "Strong value opportunity"
                      : listing.priceInsight === "fair"
                      ? "Fair market fit"
                      : "Above market estimate"}
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-950/40 p-4">
                  <p className="text-sm text-slate-400">Trust Signal</p>
                  <p className="mt-1 font-semibold text-white">
                    {listing.verified
                      ? "Verified listing confidence"
                      : "Verification pending"}
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-950/40 p-4">
                  <p className="text-sm text-slate-400">Lifestyle</p>
                  <p className="mt-1 font-semibold text-white">
                    {livabilitySummary}
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-950/40 p-4">
                  <p className="text-sm text-slate-400">Transit</p>
                  <p className="mt-1 font-semibold text-white">
                    {transitSummary}
                  </p>
                </div>
              </div>

              <div className="mt-4 grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl bg-slate-950/40 p-4">
                  <p className="text-sm text-slate-400">Amenity Score</p>
                  <p className="mt-1 font-semibold text-white">
                    {amenityScore}
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-950/40 p-4">
                  <p className="text-sm text-slate-400">Livability</p>
                  <p className="mt-1 font-semibold text-white">
                    {livabilitySummary}
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-950/40 p-4">
                  <p className="text-sm text-slate-400">Commute</p>
                  <p className="mt-1 font-semibold text-white">
                    {transitSummary}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12">
          <MapView
            lat={listing.coordinates.lat}
            lng={listing.coordinates.lng}
            nearbyPlaces={allNearbyPlaces}
            selectedCategory={selectedCategory}
          />
        </div>

        <NearbyPlaces
          lat={listing.coordinates.lat}
          lng={listing.coordinates.lng}
          onPlacesLoaded={setPlacesData}
          onCategoryChange={setSelectedCategory}
        />
      </div>
    </main>
  );
}