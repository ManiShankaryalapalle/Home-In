"use client";

import { useEffect, useMemo, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;

type NearbyPlace = {
  name: string;
  category: string;
  categoryLabel: string;
  address?: string;
  coordinates?: {
    lat: number;
    lng: number;
  } | null;
};

function getMarkerColor() {
  return "#9ca3af";
}

export default function MapView({
  lng,
  lat,
  nearbyPlaces = [],
  selectedCategory = "",
}: {
  lng: number;
  lat: number;
  nearbyPlaces?: NearbyPlace[];
  selectedCategory?: string;
}) {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);

  const filteredPlaces = useMemo(() => {
    if (!selectedCategory) return [];
    return nearbyPlaces.filter((place) => place.category === selectedCategory);
  }, [nearbyPlaces, selectedCategory]);

  useEffect(() => {
    if (!mapContainer.current) return;

    if (!mapRef.current) {
      mapRef.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/dark-v11",
        center: [lng, lat],
        zoom: 13,
      });

      mapRef.current.addControl(new mapboxgl.NavigationControl(), "top-right");
    }

    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    const listingMarker = new mapboxgl.Marker({ color: "#ef4444" })
      .setLngLat([lng, lat])
      .setPopup(
        new mapboxgl.Popup().setHTML(`
          <div style="color:black;">
            <strong>🏠 Listing Location</strong>
          </div>
        `)
      )
      .addTo(mapRef.current);

    markersRef.current.push(listingMarker);

    filteredPlaces.forEach((place) => {
      if (!place.coordinates) return;

      const marker = new mapboxgl.Marker({
        color: getMarkerColor(),
      })
        .setLngLat([place.coordinates.lng, place.coordinates.lat])
        .setPopup(
          new mapboxgl.Popup().setHTML(`
            <div style="color:black;">
              <strong>${place.name}</strong><br/>
              <span style="font-size:12px;">${place.categoryLabel}</span>
            </div>
          `)
        )
        .addTo(mapRef.current!);

      markersRef.current.push(marker);
    });

    mapRef.current.flyTo({
      center: [lng, lat],
      zoom: 13,
      essential: true,
    });
  }, [lng, lat, filteredPlaces]);

  useEffect(() => {
    return () => {
      markersRef.current.forEach((marker) => marker.remove());
      mapRef.current?.remove();
      markersRef.current = [];
      mapRef.current = null;
    };
  }, []);

  return (
    <div className="space-y-3">
      <div ref={mapContainer} className="h-80 w-full rounded-3xl" />

      <div className="flex flex-wrap items-center gap-4 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-300">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-red-500" />
          <span>Listing location</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-gray-400" />
          <span>Selected nearby places</span>
        </div>
      </div>
    </div>
  );
}