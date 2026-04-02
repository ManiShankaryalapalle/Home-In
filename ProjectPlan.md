# 🏠 Home-in — Project Plan & Goal Document

## 📌 Project Overview

**Home-in** is an intelligent, AI-powered rental discovery platform designed to simplify and enhance the house-hunting experience. The platform aggregates rental listings from multiple sources such as Facebook Marketplace, Rentals.ca, and other regional websites into a unified system, removes duplicates, and delivers a personalized, data-driven experience for users.

The goal is to enable users to find the most suitable and affordable homes faster, with greater confidence, through intelligent recommendations, price insights, and location-based livability analysis.

---

## 🎯 Vision Statement

To build a smart rental discovery platform that acts as a **personal real estate assistant**, helping users make faster, safer, and more informed housing decisions using AI, data aggregation, and real-world insights.

---

## 🚀 Core Objectives

* Aggregate rental listings from multiple platforms into one place
* Eliminate duplicate listings using intelligent matching
* Provide personalized recommendations based on user preferences
* Identify underpriced and overpriced properties using price intelligence
* Enhance listings with neighborhood and lifestyle insights
* Detect scams and improve listing trustworthiness
* Enable fast comparison and decision-making
* Deliver a seamless and intuitive user experience

---

## 🧱 MVP Scope (Phase 1)

The initial version of Home-in will focus on building a strong foundation with the following features:

### Core Features

* Search rentals across a unified dataset
* Filter by price, bedrooms, location, and basic criteria
* View listing cards with essential information
* Open detailed property pages
* Save favorite listings
* Compare multiple listings side-by-side

### UI Components

* Homepage with search functionality
* Search results page
* Listing details page
* Saved listings page
* Compare listings page

### Data (Initial)

* Use mock JSON data to simulate listings
* No real scraping or API integrations initially

---

## 🧠 Future Intelligent Features (Post-MVP)

### AI & Data Features

* AI-based recommendation engine (budget, commute, lifestyle)
* Price intelligence (underpriced / overpriced detection)
* Duplicate listing detection across platforms
* Scam detection using pattern recognition
* Real-time alerts for new/high-demand listings

### Location Intelligence

* Nearby grocery stores
* Gyms and fitness centers
* Public transportation
* Restaurants and cafes
* Hospitals and emergency services
* Popular landmarks

---

## 🛠️ Technology Stack

### Frontend

* Next.js (React framework)
* TypeScript
* Tailwind CSS

### Backend (Later Phases)

* Node.js / Next.js API routes

### Database (Later Phases)

* PostgreSQL / Supabase

### AI & Data Processing (Advanced Phase)

* Python (FastAPI) or Node-based ML services

### Maps & Location Services

* Google Maps API or Mapbox

### Version Control & Deployment

* Git & GitHub
* Vercel (for deployment)

---

## 📂 Project Structure (Planned)

```
home-in/
├─ public/
├─ src/
│  ├─ app/
│  │  ├─ page.tsx
│  │  ├─ search/
│  │  ├─ listing/[id]/
│  │  ├─ compare/
│  │  └─ saved/
│  ├─ components/
│  │  ├─ layout/
│  │  ├─ listings/
│  │  ├─ filters/
│  │  └─ ui/
│  ├─ data/
│  │  └─ mockListings.ts
│  ├─ types/
│  └─ lib/
```

---

## 🔄 Development Roadmap

### Phase 1 — UI & Mock Data

* Set up project using Next.js
* Build homepage and navigation
* Create listing cards using mock data
* Implement search and filters
* Build listing details page
* Implement compare functionality

### Phase 2 — Backend Integration

* Set up database (Supabase/PostgreSQL)
* Store listings and user data
* Add authentication (optional)
* Enable favorites and saved searches

### Phase 3 — Data Aggregation

* Integrate listing sources
* Build ingestion pipelines
* Implement duplicate detection logic

### Phase 4 — Intelligence Layer

* Recommendation engine
* Price analysis system
* Scam detection algorithms

### Phase 5 — Advanced Features

* Real-time alerts
* Notification system
* Personalized dashboards
* Performance optimization

---

## 📊 Data Model (Initial)

Each listing will include:

* id
* title
* price
* city
* neighborhood
* bedrooms
* bathrooms
* sqft
* images
* source
* verified status
* AI match score
* price insight (underpriced/fair/overpriced)
* nearby places (groceries, gyms, transit, etc.)

---

## 🧭 Development Approach

The project will follow a **progressive enhancement approach**:

1. Build UI first
2. Use mock data to simulate real scenarios
3. Add backend and persistence
4. Introduce aggregation and pipelines
5. Layer intelligence (AI/ML) on top

This ensures faster progress, better learning, and a production-like system.

---

## 🏁 Success Criteria

The project will be considered successful when:

* Users can search and discover listings easily
* Listings are clean (no duplicates) and informative
* Recommendations feel personalized and useful
* Price insights help users make decisions
* Users can compare and shortlist properties efficiently
* Platform reduces time to find a suitable rental

---

## 🔥 Long-Term Goal

Transform Home-in into a **full-scale AI rental ecosystem** that not only helps users find homes but also:

* predicts market trends
* assists in negotiations
* integrates with landlord systems
* becomes a trusted rental intelligence platform

---

## 🧠 Final Note

Home-in is not just a website — it is a **product-level project** that combines:

* data engineering
* frontend development
* backend systems
* machine learning
* real-world user experience

This project is designed to showcase end-to-end capability and evolve into a portfolio-defining system.

---
