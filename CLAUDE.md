# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Development Commands

```bash
npm run dev      # Start development server (localhost:3000)
npm run build    # Production build
npm run start    # Start production server
```

No test suite is currently configured.

## Tech Stack

- **Framework:** Next.js 14.1.0 with App Router, TypeScript, React 18
- **Database:** Supabase (PostgreSQL) - direct client queries, no ORM
- **Auth:** Supabase Auth with email/password
- **Payments:** Stripe (5% commission model)
- **Notifications:** Twilio WhatsApp
- **Styling:** Tailwind CSS (green primary, orange accent)

## Architecture Overview

FleteAgro is a two-sided agricultural logistics marketplace connecting:
- **Shippers (shipper):** Producers who publish loads for transport
- **Drivers (driver):** Transporters who accept loads and publish routes

### Key Directories

```
/app
  /api/checkout          # Stripe payment sessions
  /api/whatsapp          # Twilio WhatsApp messaging
  /auth/register         # User registration with role selection
  /dashboard/shipper     # Producer: publish loads (/publicar, /programar)
  /dashboard/driver      # Transporter: view loads, manage routes (/rutas)
  /matching              # Intelligent load-route matching algorithm
  /calificar             # Rating system

/lib/supabaseClient.ts   # Supabase client initialization
```

### Database Tables

- `users` - Profiles with name, email, phone, role (shipper/driver)
- `loads` - Immediate shipments (cargo_type, weight_tons, origin, destination, pickup_date, offered_price, status)
- `scheduled_loads` - Future scheduled shipments
- `scheduled_routes` - Driver-published routes

Load status flow: `pending` → `matched` → `in_transit` → `delivered`

### Key Patterns

**Supabase Queries:** Direct client calls from components
```typescript
const { data } = await supabase.from("loads").select("*").eq("user_id", userId);
```

**Matching Algorithm:** `calcularCompatibilidad(ruta, carga)` in `/app/matching/page.tsx` scores route-load compatibility (minimum 50 to match)

**Don Flete AI:** `getDonFleteInsights()` provides market predictions based on day, month, and seasonal agricultural patterns (pecan Aug-Oct, chile Mar-May, apples Jun-Aug)

**All pages use "use client"** - client-side rendering throughout

## Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
NEXT_PUBLIC_SITE_URL
STRIPE_SECRET_KEY
TWILIO_ACCOUNT_SID
TWILIO_AUTH_TOKEN
TWILIO_WHATSAPP_NUMBER
```

## Spanish Language Codebase

Variable names, functions, and UI text are in Spanish (target market: Mexico). Examples:
- `calcularCompatibilidad` (calculate compatibility)
- `carga` (load), `ruta` (route), `ofertar` (offer)
- Agricultural products: pecan (nuez), chile, manzana (apple), tomate
