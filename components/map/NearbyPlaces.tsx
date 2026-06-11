"use client";

import { useEffect, useMemo, useState } from "react";

export type Place = {
  name: string;
  rating?: number | null;
  address?: string;
  distanceKm?: number | null;
  distanceMeters?: number | null;
  category: string;
  categoryLabel: string;
  coordinates?: {
    lat: number;
    lng: number;
  } | null;
};

export type CategoryOption = {
  key: string;
  label: string;
};

export type PlacesResponse = {
  availableCategories: CategoryOption[];
  placesByCategory: Record<string, Place[]>;
};

function formatDistance(place: Place) {
  if (place.distanceMeters == null) return "—";
  if (place.distanceMeters < 1000) return `${place.distanceMeters} m`;
  return `${place.distanceKm} km`;
}

function CategorySection({
  title,
  places,
}: {
  title: string;
  places: Place[];
}) {
  const sortedPlaces = [...places].sort((a, b) => {
    const da = a.distanceMeters ?? Number.MAX_SAFE_INTEGER;
    const db = b.distanceMeters ?? Number.MAX_SAFE_INTEGER;
    return da - db;
  });

  return (
    <div className="rounded-2xl bg-slate-900/50 p-4">
      <h3 className="text-sm font-semibold text-white">{title}</h3>

      <div className="mt-3 space-y-2 text-sm">
        {sortedPlaces.length === 0 ? (
          <p className="text-slate-400">No places found.</p>
        ) : (
          sortedPlaces.map((place, i) => (
            <div
              key={`${title}-${i}`}
              className="rounded-xl bg-slate-950/60 px-3 py-2"
            >
              <div className="flex items-center justify-between gap-3">
                <span>{place.name}</span>
                <div className="flex items-center gap-3">
                  <span className="text-slate-300">{formatDistance(place)}</span>
                  <span className="text-yellow-400">{place.rating ?? "—"}</span>
                </div>
              </div>

              {place.address ? (
                <p className="mt-1 text-xs text-slate-400">{place.address}</p>
              ) : null}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default function NearbyPlaces({
  lat,
  lng,
  onPlacesLoaded,
  onCategoryChange,
}: {
  lat: number;
  lng: number;
  onPlacesLoaded?: (data: PlacesResponse) => void;
  onCategoryChange?: (category: string) => void;
}) {
  const [data, setData] = useState<PlacesResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    async function fetchPlaces() {
      try {
        setLoading(true);
        const res = await fetch(`/api/places?lat=${lat}&lng=${lng}`);
        const json = await res.json();
        setData(json);
        onPlacesLoaded?.(json);
        setSelectedCategory("");
      } catch (error) {
        console.error("Failed to fetch nearby places:", error);
        setData(null);
      } finally {
        setLoading(false);
      }
    }

    fetchPlaces();
  }, [lat, lng, onPlacesLoaded]);

  useEffect(() => {
    onCategoryChange?.(selectedCategory);
  }, [selectedCategory, onCategoryChange]);

  const selectedPlaces = useMemo(() => {
    if (!data || !selectedCategory) return [];
    return data.placesByCategory[selectedCategory] ?? [];
  }, [data, selectedCategory]);

  const selectedLabel =
    data?.availableCategories.find((item) => item.key === selectedCategory)?.label ?? "";

  return (
    <div className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-6">
      <h2 className="text-xl font-semibold">Nearby Places</h2>

      {loading ? (
        <p className="mt-4 text-slate-400">Loading nearby places...</p>
      ) : (
        <>
          <div className="mt-4">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full max-w-sm rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-white outline-none"
            >
              <option value="">Select nearby category</option>
              {data?.availableCategories.map((option) => (
                <option key={option.key} value={option.key}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {selectedCategory ? (
            <div className="mt-6">
              <CategorySection title={selectedLabel} places={selectedPlaces} />
            </div>
          ) : null}
        </>
      )}
    </div>
  );
}