-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Deals table - stores flight deal information
CREATE TABLE IF NOT EXISTS deals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  airline VARCHAR(100) NOT NULL,
  departure_city VARCHAR(100) NOT NULL,
  departure_airport VARCHAR(10) NOT NULL,
  destination_city VARCHAR(100) NOT NULL,
  destination_airport VARCHAR(10) NOT NULL,
  cabin_class VARCHAR(20) NOT NULL CHECK (cabin_class IN ('business', 'first', 'premium_economy')),
  price_aud DECIMAL(10, 2) NOT NULL,
  original_price_aud DECIMAL(10, 2),
  discount_percentage INTEGER,
  departure_date DATE NOT NULL,
  return_date DATE,
  is_return BOOLEAN DEFAULT false,
  booking_url TEXT NOT NULL,
  deal_type VARCHAR(50) NOT NULL CHECK (deal_type IN ('mistake_fare', 'sale', 'points_redemption', 'best_available')),
  alliance VARCHAR(20) CHECK (alliance IN ('star', 'oneworld', 'skyteam', 'none')),
  points_required INTEGER,
  points_currency VARCHAR(20),
  availability_count INTEGER DEFAULT 1,
  expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Watchlists table - stores user route watchlists
CREATE TABLE IF NOT EXISTS watchlists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  departure_city VARCHAR(100) NOT NULL,
  destination_city VARCHAR(100) NOT NULL,
  cabin_classes TEXT[] NOT NULL,
  max_price_aud DECIMAL(10, 2),
  flexible_dates BOOLEAN DEFAULT true,
  preferred_months TEXT[],
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, departure_city, destination_city)
);

-- Alerts table - stores user alert preferences and history
CREATE TABLE IF NOT EXISTS alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  watchlist_id UUID REFERENCES watchlists(id) ON DELETE CASCADE,
  deal_id UUID REFERENCES deals(id) ON DELETE CASCADE,
  alert_type VARCHAR(50) NOT NULL CHECK (alert_type IN ('price_drop', 'new_deal', 'expiring_soon')),
  is_sent BOOLEAN DEFAULT false,
  sent_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- User preferences table - stores email notification settings
CREATE TABLE IF NOT EXISTS user_preferences (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email_notifications BOOLEAN DEFAULT true,
  notification_frequency VARCHAR(20) DEFAULT 'instant' CHECK (notification_frequency IN ('instant', 'daily', 'weekly')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_deals_departure ON deals(departure_city, departure_date);
CREATE INDEX IF NOT EXISTS idx_deals_destination ON deals(destination_city);
CREATE INDEX IF NOT EXISTS idx_deals_price ON deals(price_aud);
CREATE INDEX IF NOT EXISTS idx_deals_cabin ON deals(cabin_class);
CREATE INDEX IF NOT EXISTS idx_deals_created ON deals(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_watchlists_user ON watchlists(user_id);
CREATE INDEX IF NOT EXISTS idx_alerts_user ON alerts(user_id, is_sent);
