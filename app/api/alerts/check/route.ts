import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST() {
  const supabase = await createClient()

  try {
    // Get all active watchlists
    const { data: watchlists, error: watchlistError } = await supabase
      .from("watchlists")
      .select("*")
      .order("created_at", { ascending: false })

    if (watchlistError) throw watchlistError

    if (!watchlists || watchlists.length === 0) {
      return NextResponse.json({ message: "No watchlists to check", alertsCreated: 0 })
    }

    let alertsCreated = 0

    // For each watchlist, find matching deals
    for (const watchlist of watchlists) {
      let query = supabase
        .from("deals")
        .select("*")
        .eq("departure_city", watchlist.departure_city)
        .eq("destination_city", watchlist.destination_city)
        .in("cabin_class", watchlist.cabin_classes)

      if (watchlist.max_price_aud) {
        query = query.lte("price_aud", watchlist.max_price_aud)
      }

      const { data: matchingDeals, error: dealsError } = await query

      if (dealsError) {
        console.error("Error fetching deals:", dealsError)
        continue
      }

      if (!matchingDeals || matchingDeals.length === 0) continue

      // Check user preferences
      const { data: preferences } = await supabase
        .from("user_preferences")
        .select("*")
        .eq("user_id", watchlist.user_id)
        .single()

      if (!preferences?.email_notifications) continue

      // Create alerts for matching deals that haven't been alerted yet
      for (const deal of matchingDeals) {
        // Check if alert already exists
        const { data: existingAlert } = await supabase
          .from("alerts")
          .select("id")
          .eq("user_id", watchlist.user_id)
          .eq("watchlist_id", watchlist.id)
          .eq("deal_id", deal.id)
          .single()

        if (existingAlert) continue

        // Create new alert
        const { error: alertError } = await supabase.from("alerts").insert({
          user_id: watchlist.user_id,
          watchlist_id: watchlist.id,
          deal_id: deal.id,
          alert_type: "new_deal",
          is_sent: false,
        })

        if (!alertError) {
          alertsCreated++
        }
      }
    }

    return NextResponse.json({
      message: "Alert check completed",
      alertsCreated,
      watchlistsChecked: watchlists.length,
    })
  } catch (error) {
    console.error("Alert check error:", error)
    return NextResponse.json({ error: "Failed to check alerts" }, { status: 500 })
  }
}
