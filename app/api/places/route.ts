function toRadians(value: number) {
  return (value * Math.PI) / 180;
}

function getDistanceKm(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
) {
  const R = 6371;
  const dLat = toRadians(lat2 - lat1);
  const dLng = toRadians(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

const CATEGORY_CONFIG = [
  { key: "restaurant", label: "Restaurants" },
  { key: "cafe", label: "Cafes" },
  { key: "grocery_store", label: "Grocery Stores" },
  { key: "supermarket", label: "Supermarkets" },
  { key: "gym", label: "Gyms" },
  { key: "pharmacy", label: "Pharmacies" },
  { key: "hospital", label: "Hospitals" },
  { key: "movie_theater", label: "Movie Theaters" },
  { key: "shopping_mall", label: "Shopping Malls" },
  { key: "convenience_store", label: "Convenience Stores" },
  { key: "clothing_store", label: "Clothing Stores" },
  { key: "park", label: "Parks" },
  { key: "bank", label: "Banks" },
  { key: "atm", label: "ATMs" },
  { key: "bus_station", label: "Bus Stops" },
  { key: "subway_station", label: "Subway Stations" },
  { key: "beauty_salon", label: "Beauty Salons" },
  { key: "barber_shop", label: "Barber Shops" },
] as const;

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;

  if (!lat || !lng || !apiKey) {
    return Response.json(
      { error: "Missing lat, lng, or API key" },
      { status: 400 }
    );
  }

  const baseLat = Number(lat);
  const baseLng = Number(lng);

  async function fetchCategory(type: string, label: string) {
    const res = await fetch(
      "https://places.googleapis.com/v1/places:searchNearby",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": apiKey,
          "X-Goog-FieldMask":
            "places.displayName,places.rating,places.formattedAddress,places.location",
        },
        body: JSON.stringify({
          includedTypes: [type],
          maxResultCount: 10,
          locationRestriction: {
            circle: {
              center: {
                latitude: baseLat,
                longitude: baseLng,
              },
              radius: 5000,
            },
          },
        }),
      }
    );

    const data = await res.json();

    const places =
      data.places?.map((place: any) => {
        const placeLat = place.location?.latitude;
        const placeLng = place.location?.longitude;

        const distanceKm =
          typeof placeLat === "number" && typeof placeLng === "number"
            ? getDistanceKm(baseLat, baseLng, placeLat, placeLng)
            : null;

        const distanceMeters =
          distanceKm != null ? Math.round(distanceKm * 1000) : null;

        return {
          name: place.displayName?.text ?? "Unknown place",
          rating: place.rating ?? null,
          address: place.formattedAddress ?? "",
          distanceKm:
            distanceKm != null ? Number(distanceKm.toFixed(2)) : null,
          distanceMeters,
          category: type,
          categoryLabel: label,
          coordinates:
            typeof placeLat === "number" && typeof placeLng === "number"
              ? {
                  lat: placeLat,
                  lng: placeLng,
                }
              : null,
        };
      }) ?? [];

    return places.sort((a: any, b: any) => {
      const da = a.distanceMeters ?? Number.MAX_SAFE_INTEGER;
      const db = b.distanceMeters ?? Number.MAX_SAFE_INTEGER;
      return da - db;
    });
  }

  const results = await Promise.all(
    CATEGORY_CONFIG.map(async (category) => {
      const places = await fetchCategory(category.key, category.label);
      return {
        key: category.key,
        label: category.label,
        places,
      };
    })
  );

  const availableCategories = results
    .filter((item) => item.places.length > 0)
    .map((item) => ({
      key: item.key,
      label: item.label,
    }));

  const placesByCategory = results.reduce<Record<string, any[]>>((acc, item) => {
    if (item.places.length > 0) {
      acc[item.key] = item.places;
    }
    return acc;
  }, {});

  return Response.json({
    availableCategories,
    placesByCategory,
  });
}