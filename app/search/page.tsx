"use client";

import { useEffect, useMemo, useState } from "react";
import ListingCard from "@/components/listings/ListingCard";
import {
  SearchTopBar,
  SearchSidebar,
} from "@/components/filters/SearchFilters";
import { fetchListings } from "@/lib/supabase-listings";

function normalizeListing(listing: any) {
  return {
    id: listing.id,
    title: listing.title,
    price: listing.price,
    city: listing.city,
    neighborhood: listing.neighborhood,
    bedrooms: listing.bedrooms,
    bathrooms: listing.bathrooms,
    sqft: listing.sqft,
    image: listing.image,
    images: listing.images,
    source: listing.source,
    verified: listing.verified,
    aiMatchScore: listing.ai_match_score ?? 90,
    priceInsight: listing.price_insight ?? "fair",
    coordinates: {
      lat: listing.latitude ?? 45.5017,
      lng: listing.longitude ?? -73.5673,
    },
    nearbyPlaces: {
      groceries: 2,
      gyms: 2,
      transit: 1,
      restaurants: 5,
      hospitals: 1,
    },
  };
}

function calculateMatchScoreAndReasons({
  listing,
  budgetFilter,
  bedroomFilter,
  bathroomFilter,
  verifiedOnly,
  underpricedOnly,
}: {
  listing: any;
  budgetFilter: string;
  bedroomFilter: string;
  bathroomFilter: string;
  verifiedOnly: boolean;
  underpricedOnly: boolean;
}) {
  let score = 60;
  const reasons: string[] = [];

  const budgetMatch =
    budgetFilter === "any" ||
    (budgetFilter === "under-1300" && listing.price < 1300) ||
    (budgetFilter === "1300-1700" &&
      listing.price >= 1300 &&
      listing.price <= 1700) ||
    (budgetFilter === "1700-plus" && listing.price > 1700);

  if (budgetMatch) {
    score += 15;
    reasons.push("Budget match");
  }

  const bedroomMatch =
    bedroomFilter === "any" ||
    (bedroomFilter === "studio" && listing.bedrooms === 0) ||
    (bedroomFilter === "1" && listing.bedrooms === 1) ||
    (bedroomFilter === "2" && listing.bedrooms === 2) ||
    (bedroomFilter === "3+" && listing.bedrooms >= 3);

  if (bedroomMatch) {
    score += 10;
    reasons.push("Bedroom fit");
  }

  const bathroomMatch =
    bathroomFilter === "any" ||
    (bathroomFilter === "1" && listing.bathrooms === 1) ||
    (bathroomFilter === "2" && listing.bathrooms === 2) ||
    (bathroomFilter === "3+" && listing.bathrooms >= 3);

  if (bathroomMatch) {
    score += 5;
    reasons.push("Bathroom fit");
  }

  if (listing.verified) {
    score += 5;
    reasons.push("Verified listing");
  }

  if (listing.priceInsight === "underpriced") {
    score += 5;
    reasons.push("Underpriced");
  }

  if (verifiedOnly && listing.verified) {
    score += 5;
  }

  if (underpricedOnly && listing.priceInsight === "underpriced") {
    score += 5;
  }

  return {
    score: Math.min(score, 99),
    reasons,
  };
}

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("best-match");
  const [budgetFilter, setBudgetFilter] = useState("any");
  const [bedroomFilter, setBedroomFilter] = useState("any");
  const [bathroomFilter, setBathroomFilter] = useState("any");
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [underpricedOnly, setUnderpricedOnly] = useState(false);
  const [databaseListings, setDatabaseListings] = useState<any[]>([]);

  useEffect(() => {
    async function loadListings() {
      const listings = await fetchListings();
      setDatabaseListings(listings);
    }

    loadListings();
  }, []);

  const filteredListings = useMemo(() => {
    let filtered = databaseListings
      .map(normalizeListing)
      .map((listing) => {
        const ai = calculateMatchScoreAndReasons({
          listing,
          budgetFilter,
          bedroomFilter,
          bathroomFilter,
          verifiedOnly,
          underpricedOnly,
        });

        return {
          ...listing,
          dynamicMatchScore: ai.score,
          dynamicReasons: ai.reasons,
        };
      })
      .filter((listing) => {
        const query = searchTerm.toLowerCase();

        const matchesSearch =
          listing.title.toLowerCase().includes(query) ||
          listing.city.toLowerCase().includes(query) ||
          listing.neighborhood.toLowerCase().includes(query);

        const matchesBudget =
          budgetFilter === "any" ||
          (budgetFilter === "under-1300" && listing.price < 1300) ||
          (budgetFilter === "1300-1700" &&
            listing.price >= 1300 &&
            listing.price <= 1700) ||
          (budgetFilter === "1700-plus" && listing.price > 1700);

        const matchesBedroom =
          bedroomFilter === "any" ||
          (bedroomFilter === "studio" && listing.bedrooms === 0) ||
          (bedroomFilter === "1" && listing.bedrooms === 1) ||
          (bedroomFilter === "2" && listing.bedrooms === 2) ||
          (bedroomFilter === "3+" && listing.bedrooms >= 3);

        const matchesBathroom =
          bathroomFilter === "any" ||
          (bathroomFilter === "1" && listing.bathrooms === 1) ||
          (bathroomFilter === "2" && listing.bathrooms === 2) ||
          (bathroomFilter === "3+" && listing.bathrooms >= 3);

        const matchesVerified = !verifiedOnly || listing.verified;
        const matchesUnderpriced =
          !underpricedOnly || listing.priceInsight === "underpriced";

        return (
          matchesSearch &&
          matchesBudget &&
          matchesBedroom &&
          matchesBathroom &&
          matchesVerified &&
          matchesUnderpriced
        );
      });

    if (sortOption === "low-price") {
      filtered = [...filtered].sort((a, b) => a.price - b.price);
    } else if (sortOption === "high-price") {
      filtered = [...filtered].sort((a, b) => b.price - a.price);
    } else {
      filtered = [...filtered].sort(
        (a, b) => b.dynamicMatchScore - a.dynamicMatchScore
      );
    }

    return filtered;
  }, [
    databaseListings,
    searchTerm,
    sortOption,
    budgetFilter,
    bedroomFilter,
    bathroomFilter,
    verifiedOnly,
    underpricedOnly,
  ]);

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Search Listings</h1>
          <p className="mt-2 text-slate-400">
            Explore rental listings matched to your preferences.
          </p>
        </div>

        <SearchTopBar
          searchTerm={searchTerm}
          onSearchTermChange={setSearchTerm}
          sortOption={sortOption}
          onSortOptionChange={setSortOption}
          budgetFilter={budgetFilter}
          onBudgetFilterChange={setBudgetFilter}
        />

        <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
          <SearchSidebar
            bedroomFilter={bedroomFilter}
            onBedroomFilterChange={setBedroomFilter}
            bathroomFilter={bathroomFilter}
            onBathroomFilterChange={setBathroomFilter}
            verifiedOnly={verifiedOnly}
            onVerifiedOnlyChange={setVerifiedOnly}
            underpricedOnly={underpricedOnly}
            onUnderpricedOnlyChange={setUnderpricedOnly}
          />

          <section>
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm text-slate-400">
                Showing {filteredListings.length} listings
              </p>
            </div>

            {filteredListings.length === 0 ? (
              <div className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center text-slate-400">
                No listings found.
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-2">
                {filteredListings.map((listing) => (
                  <ListingCard
                    key={listing.id}
                    listing={{
                      ...listing,
                      aiMatchScore: listing.dynamicMatchScore,
                      aiReasons: listing.dynamicReasons,
                    }}
                  />
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}