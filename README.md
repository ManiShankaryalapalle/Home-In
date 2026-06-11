# Home-in 🏠

Home-in is an AI-powered rental discovery platform that helps renters find the best homes based on location, nearby amenities, and personal preferences.

## Features

### Authentication

* User Sign Up
* User Sign In
* Forgot Password
* Protected Routes

### Rental Listings

* Browse Rental Listings
* Search & Filter Properties
* Listing Details Page
* Save Listings
* Compare Listings

### Landlord Features

* Post New Listings
* Upload Multiple Property Images
* Manage Listings
* Contact Landlord

### Location Intelligence

* Interactive Property Map
* Nearby Restaurants
* Grocery Stores
* Gyms
* Movie Theaters
* Transit Stops
* Dynamic Nearby Categories
* Distance-Based Sorting

### Database & Storage

* Supabase Authentication
* PostgreSQL Database
* Supabase Storage for Images

## Tech Stack

### Frontend

* Next.js
* TypeScript
* Tailwind CSS

### Backend

* Supabase
* PostgreSQL

### APIs

* Google Places API
* Mapbox

## Project Structure

```text
app/
components/
data/
lib/
public/
types/
```

## Installation

```bash
npm install
npm run dev
```

## Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_MAPBOX_TOKEN=
GOOGLE_PLACES_API_KEY=
```

## Future Enhancements

* Edit Listings
* Delete Listings
* AI Rental Recommendations
* Commute Scoring
* Neighborhood Scoring
* Price Prediction
* Saved Search Alerts
* Scam Detection

## Author

Mani Shankar

Built as a full-stack rental marketplace project using Next.js and Supabase.
