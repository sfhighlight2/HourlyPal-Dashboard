# HourlyPal Admin Dashboard

A read-only admin and team dashboard for the HourlyPal platform, built with **Next.js 16 App Router** and connected to Supabase.

## Features

- 📊 **Overview** — KPI cards, subscription breakdown, booking status charts, recent signups
- 👥 **Users** — searchable/filterable table of all profiles
- ⭐ **Pals** — rich cards with availability calendars, services, languages, and hourly rates
- 📅 **Bookings** — full booking log with client/pal linking and status filters
- 💬 **Messages** — in-booking message log with read/unread status
- ⭐ **Reviews** — star rating distribution and full review table
- 🛠 **Services** — service catalog with pal-count per service

## Tech Stack

- [Next.js 16](https://nextjs.org/) — App Router with Server Components
- [Supabase](https://supabase.com/) — PostgreSQL + RLS (bypassed server-side via service role key)
- [Chart.js](https://www.chartjs.org/) — Data visualizations
- Vanilla CSS — Custom design system (teal `#00C4A7` + navy `#0B1629`)

## Getting Started

```bash
# 1. Clone the repo
git clone git@github.com:sfhighlight2/HourlyPal-Dashboard.git
cd HourlyPal-Dashboard

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env.local
# Edit .env.local with your Supabase URL, anon key, and service role key

# 4. Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Anon/public key (safe for browser) |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key — **server-side only**, bypasses RLS for admin reads. Never prefix with `NEXT_PUBLIC_`. |

> ⚠️ The service role key is stored in `.env.local` only and is never bundled into the browser. It is used exclusively in Next.js Server Components.

## Architecture

```
app/
  page.tsx              ← Overview (SSR)
  users/page.tsx        ← Users list (SSR)
  pals/page.tsx         ← Pals grid (SSR)
  bookings/page.tsx     ← Bookings log (SSR)
  messages/page.tsx     ← Messages log (SSR)
  reviews/page.tsx      ← Reviews + ratings (SSR)
  services/page.tsx     ← Service catalog (SSR)

components/
  Sidebar.tsx           ← Navigation (client)
  UsersTable.tsx        ← Searchable/filterable (client)
  BookingsTable.tsx     ← Filterable table (client)
  OverviewCharts.tsx    ← Chart.js charts (client)

lib/
  supabase.ts           ← Anon client + TypeScript types
  supabase-admin.ts     ← Service role client (server only)
  analytics.ts          ← Aggregation helpers
```

## Notes

- This dashboard is **read-only** — it makes no writes to the database
- Pages use `revalidate = 60` for ISR (data refreshes every 60 seconds)
- The mobile app RLS policies are untouched
