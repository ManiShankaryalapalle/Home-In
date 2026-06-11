"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type CompareListingsContextType = {
  compareIds: string[];
  toggleCompare: (id: string) => void;
  isCompared: (id: string) => boolean;
};

const CompareListingsContext = createContext<
  CompareListingsContextType | undefined
>(undefined);

export function CompareListingsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [compareIds, setCompareIds] = useState<string[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("home-in-compare-listings");
    if (stored) {
      setCompareIds(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("home-in-compare-listings", JSON.stringify(compareIds));
  }, [compareIds]);

  const toggleCompare = (id: string) => {
    setCompareIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      }

      if (prev.length >= 3) return prev;

      return [...prev, id];
    });
  };

  const isCompared = (id: string) => compareIds.includes(id);

  const value = useMemo(
    () => ({
      compareIds,
      toggleCompare,
      isCompared,
    }),
    [compareIds]
  );

  return (
    <CompareListingsContext.Provider value={value}>
      {children}
    </CompareListingsContext.Provider>
  );
}

export function useCompareListings() {
  const context = useContext(CompareListingsContext);

  if (!context) {
    throw new Error("useCompareListings must be used within provider");
  }

  return context;
}