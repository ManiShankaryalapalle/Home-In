"use client";

import { useState } from "react";

export default function ListingImageCarousel({
  images,
  title,
}: {
  images: string[];
  title: string;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const goPrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <>
      <div className="space-y-4">
        <div className="relative overflow-hidden rounded-3xl">
          <button
            onClick={() => setIsFullscreen(true)}
            className="block w-full"
          >
            <img
              src={images[currentIndex]}
              alt={`${title} image ${currentIndex + 1}`}
              className="h-[420px] w-full object-cover"
            />
          </button>

          {images.length > 1 && (
            <>
              <button
                onClick={goPrev}
                className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/50 px-4 py-2 text-white transition hover:bg-black/70"
              >
                ‹
              </button>

              <button
                onClick={goNext}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/50 px-4 py-2 text-white transition hover:bg-black/70"
              >
                ›
              </button>
            </>
          )}

          <div className="absolute bottom-3 right-3 rounded-full bg-black/60 px-3 py-1 text-xs text-white">
            {currentIndex + 1} / {images.length}
          </div>
        </div>

        {images.length > 1 && (
          <div className="grid grid-cols-4 gap-3">
            {images.slice(0, 4).map((image, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`overflow-hidden rounded-2xl border ${
                  currentIndex === index
                    ? "border-cyan-400"
                    : "border-white/10"
                }`}
              >
                <img
                  src={image}
                  alt={`${title} thumbnail ${index + 1}`}
                  className="h-20 w-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {isFullscreen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-6">
          <button
            onClick={() => setIsFullscreen(false)}
            className="absolute right-6 top-6 rounded-full bg-white/10 px-4 py-2 text-white hover:bg-white/20"
          >
            ✕
          </button>

          {images.length > 1 && (
            <>
              <button
                onClick={goPrev}
                className="absolute left-6 top-1/2 -translate-y-1/2 rounded-full bg-white/10 px-4 py-2 text-white hover:bg-white/20"
              >
                ‹
              </button>

              <button
                onClick={goNext}
                className="absolute right-6 top-1/2 -translate-y-1/2 rounded-full bg-white/10 px-4 py-2 text-white hover:bg-white/20"
              >
                ›
              </button>
            </>
          )}

          <img
            src={images[currentIndex]}
            alt={`${title} fullscreen ${currentIndex + 1}`}
            className="max-h-[85vh] max-w-[90vw] rounded-3xl object-contain"
          />

          <div className="absolute bottom-6 rounded-full bg-white/10 px-4 py-2 text-sm text-white">
            {currentIndex + 1} / {images.length}
          </div>
        </div>
      )}
    </>
  );
}