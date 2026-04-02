export type CabinClass = "business" | "first" | "premium_economy"
export type DealType = "mistake_fare" | "sale" | "points_redemption" | "best_available"
export type Alliance = "star" | "oneworld" | "skyteam" | "none"

export interface Deal {
  id: string
  airline: string
  departure_city: string
  departure_airport: string
  destination_city: string
  destination_airport: string
  cabin_class: CabinClass
  price_aud: number
  original_price_aud?: number
  discount_percentage?: number
  departure_date: string
  return_date?: string
  is_return: boolean
  booking_url: string
  deal_type: DealType
  alliance: Alliance
  points_required?: number
  points_currency?: string
  availability_count: number
  expires_at?: string
  created_at: string
  updated_at: string
}

export interface Watchlist {
  id: string
  user_id: string
  departure_city: string
  destination_city: string
  cabin_classes: CabinClass[]
  max_price_aud?: number
  flexible_dates: boolean
  preferred_months?: string[]
  created_at: string
  updated_at: string
}

export interface Alert {
  id: string
  user_id: string
  watchlist_id?: string
  deal_id?: string
  alert_type: "price_drop" | "new_deal" | "expiring_soon"
  is_sent: boolean
  sent_at?: string
  created_at: string
}

export interface UserPreferences {
  user_id: string
  email_notifications: boolean
  notification_frequency: "instant" | "daily" | "weekly"
  created_at: string
  updated_at: string
}
