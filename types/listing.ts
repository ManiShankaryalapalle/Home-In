export type Listing = {
  id: string;
  title: string;
  price: number;
  city: string;
  neighborhood: string;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  image: string;
  images?: string[];
  source: string;
  verified: boolean;
  aiMatchScore: number;
  aiReasons?: string[];
  priceInsight: "underpriced" | "fair" | "overpriced";
  coordinates: {
    lat: number;
    lng: number;
  };
  nearbyPlaces: {
    groceries: number;
    gyms: number;
    transit: number;
    restaurants: number;
    hospitals: number;
  };
};