# USTA League Statistics Dashboard

A comprehensive analytics dashboard for USTA tennis leagues across the United States, built with Next.js, TypeScript, and PostgreSQL.

## Features

- **Real-time Statistics**: View player counts, section distributions, gender breakdowns, and rating distributions
- **Advanced Filtering**: Filter data by section, district, area, gender, and rating
- **Interactive Charts**: Beautiful visualizations using Chart.js
- **Responsive Design**: Modern UI that works on all devices
- **Real-time Updates**: Data refreshes automatically when filters change

## Filtering Capabilities

The dashboard supports comprehensive filtering:

- **Section**: Filter by USTA sections (e.g., USTA/EASTERN, USTA/FLORIDA)
- **District**: Filter by districts within sections
- **Area**: Filter by specific areas within districts
- **Gender**: Filter by Male, Female, or Mixed
- **Rating**: Filter by player rating (2.5 to 5.5)

All filters work together to provide precise data insights. The statistics update in real-time as you apply or modify filters.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Technical Details

- **Frontend**: Next.js 15 with TypeScript, Tailwind CSS, and Chart.js
- **Backend**: Next.js API routes with PostgreSQL database
- **State Management**: React Query for server state management
- **UI Components**: Custom UI components built with Radix UI primitives
- **Database**: PostgreSQL with optimized queries for filtering

## API Endpoints

- `GET /api/stats` - Returns filtered statistics based on query parameters
- `GET /api/filters` - Returns available filter options (sections, districts, areas)

## Database Schema

The application connects to a PostgreSQL database with the following main tables:
- `players` - Player information including gender, rating, state, country
- `player_sections` - Player-section relationships
- `sections` - Section information
- Additional tables for districts and areas

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
