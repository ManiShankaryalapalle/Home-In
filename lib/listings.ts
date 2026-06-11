import { Listing } from "@/types/listing";
import { mockListings } from "@/data/mockListings";

const USER_LISTINGS_KEY = "home-in-user-listings";

export function getUserListings(): Listing[] {
  if (typeof window === "undefined") return [];

  const stored = localStorage.getItem(USER_LISTINGS_KEY);

  return stored ? JSON.parse(stored) : [];
}

export function saveUserListing(listing: Listing) {
  const existing = getUserListings();

  localStorage.setItem(
    USER_LISTINGS_KEY,
    JSON.stringify([listing, ...existing])
  );
}

export function getAllListings(): Listing[] {
  return [...getUserListings(), ...mockListings];
}