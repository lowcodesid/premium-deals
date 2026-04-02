# Premium Deal Finder

A full-stack flight deal discovery platform for Australian travelers seeking business and first class deals.

## Features

### V0 - Core Features
- **Search & Discovery**: Browse and filter premium cabin deals from Australia
- **Deal Comparison**: Compare up to 4 deals side-by-side
- **Travel Guide**: Comprehensive guide on deal types and booking tips

### V1 - User Features
- **Authentication**: Secure sign up and login with Supabase Auth
- **Watchlists**: Create route-based watchlists with custom filters
  - Select departure and destination cities
  - Filter by cabin class (Business, First, Premium Economy)
  - Set maximum price thresholds
  - Choose flexible dates and preferred months
- **Alert System**: Get notified when deals match your watchlists
- **User Dashboard**: Track watchlists, alerts, and recent deals
- **Notification Settings**: Customize alert frequency (instant, daily, weekly)

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **State Management**: Zustand (for comparison feature)
- **Type Safety**: TypeScript

## Database Schema

- `deals`: Flight deal information with pricing, routes, and availability
- `watchlists`: User-created route monitoring with custom filters
- `alerts`: Notifications for matching deals
- `user_preferences`: Email notification settings

Row Level Security (RLS) is enabled on all tables to protect user data.

## Getting Started

1. Connect your Supabase integration
2. Run the SQL scripts in the `scripts` folder to set up the database
3. Deploy or run locally

## API Routes

- `POST /api/alerts/check`: Match deals to watchlists and create alerts

## Future Enhancements

- Email notifications via Resend or similar service
- Deal expiration tracking
- Price drop alerts
- Saved deals/favorites
- Advanced filtering (airline alliance, specific dates)
- Points calculator
- Deal history and trends
