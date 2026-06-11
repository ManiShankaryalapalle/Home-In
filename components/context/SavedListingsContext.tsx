"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type SavedListingsContextType = {
  savedIds: string[];
  toggleSaved: (id: string) => void;
  isSaved: (id: string) => boolean;
};

const SavedListingsContext = createContext<SavedListingsContextType | undefined>(
  undefined
);

export function SavedListingsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [savedIds, setSavedIds] = useState<string[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("home-in-saved-listings");
    if (stored) {
      setSavedIds(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("home-in-saved-listings", JSON.stringify(savedIds));
  }, [savedIds]);

  const toggleSaved = (id: string) => {
    setSavedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const isSaved = (id: string) => savedIds.includes(id);

  const value = useMemo(
    () => ({
      savedIds,
      toggleSaved,
      isSaved,
    }),
    [savedIds]
  );

  return (
    <SavedListingsContext.Provider value={value}>
      {children}
    </SavedListingsContext.Provider>
  );
}

export function useSavedListings() {
  const context = useContext(SavedListingsContext);

  if (!context) {
    throw new Error("useSavedListings must be used within SavedListingsProvider");
  }

  return context;
}