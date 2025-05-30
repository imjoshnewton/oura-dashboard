# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an Oura Sleep Dashboard built with Next.js, React, TypeScript, and Tailwind CSS. It visualizes sleep data from the Oura ring API with charts and metrics.

## Tech Stack

- **Framework**: Next.js 14 (Pages Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS with shadcn/ui components
- **Charts**: Recharts
- **Icons**: Lucide React
- **Package Manager**: Bun

## Commands

### Development
```bash
bun run dev        # Start development server on http://localhost:3000
```

### Build & Production
```bash
bun run build      # Build for production
bun run start      # Start production server
```

### Code Quality
```bash
bun run lint       # Run ESLint
bun run typecheck  # Run TypeScript type checking
```

### Adding UI Components
```bash
bunx shadcn@latest add <component-name>  # Add new shadcn/ui components
```

## Architecture

The dashboard is a single-page application with the following structure:

- **`/components/OuraSleepDashboard.tsx`**: Main dashboard component containing all the visualization logic
- **`/components/ui/`**: shadcn/ui components (Card, Table, Tabs, Tooltip)
- **`/lib/utils.ts`**: Utility functions including the `cn()` helper for className merging
- **`/pages/`**: Next.js pages directory (using Pages Router, not App Router)
- **`/styles/globals.css`**: Global styles with Tailwind CSS and CSS variables

The dashboard displays:
- Overview metrics (average sleep, efficiency, readiness score, heart rate, HRV)
- Sleep trends chart (duration, efficiency, readiness over time)
- Sleep stages visualization (pie chart and stacked bar chart)
- Vitals trends (heart rate and HRV)
- Detailed daily log table

Data is currently using sample data embedded in the component. To connect to real Oura API data, you would need to replace the `sampleSleepData` array with API calls.