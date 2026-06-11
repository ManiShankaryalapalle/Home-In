"use client";

import { useEffect, useRef, useState } from "react";

export default function AddressSearch({
  value,
  onChange,
  onSelect,
}: {
  value: string;
  onChange: (value: string) => void;
  onSelect: (address: string, lat: number, lng: number) => void;
}) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  const [query, setQuery] = useState(value);
  const [results, setResults] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setQuery(value);
  }, [value]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setResults([]);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (query.length < 3) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    const timeout = setTimeout(async () => {
      const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

      const res = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          query
        )}.json?access_token=${token}&limit=5&country=ca`
      );

      const data = await res.json();
      setResults(data.features || []);
      setIsOpen(true);
    }, 300);

    return () => clearTimeout(timeout);
  }, [query]);

  return (
    <div ref={wrapperRef} className="relative">
      <input
        type="text"
        value={query}
        onChange={(e) => {
          const newValue = e.target.value;
          setQuery(newValue);
          onChange(newValue);
        }}
        onFocus={() => {
          if (results.length > 0) setIsOpen(true);
        }}
        placeholder="Type full address with house number..."
        className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3"
      />

      {isOpen && results.length > 0 && (
        <div className="absolute z-50 mt-2 max-h-64 w-full overflow-auto rounded-2xl border border-white/10 bg-slate-950 shadow-xl">
          {results.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                onSelect(item.place_name, item.center[1], item.center[0]);
                setQuery(item.place_name);
                setResults([]);
                setIsOpen(false);
              }}
              className="block w-full border-b border-white/5 px-4 py-3 text-left text-sm text-white hover:bg-white/5"
            >
              {item.place_name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}