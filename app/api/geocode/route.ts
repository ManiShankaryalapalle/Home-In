export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const address = searchParams.get("address");

  const apiKey = process.env.GOOGLE_PLACES_API_KEY;

  if (!address || !apiKey) {
    return Response.json(
      { error: "Missing address or API key" },
      { status: 400 }
    );
  }

  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
    address
  )}&key=${apiKey}`;

  const res = await fetch(url);
  const data = await res.json();

  const result = data.results?.[0];

  if (!result) {
    return Response.json(
      { error: "Address not found" },
      { status: 404 }
    );
  }

  return Response.json({
    formattedAddress: result.formatted_address,
    lat: result.geometry.location.lat,
    lng: result.geometry.location.lng,
  });
}