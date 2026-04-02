"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Bell, MapPin, TrendingUp, Star, Sparkles } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { useJourney } from "@/lib/contexts/journey-context"
import { MOCK_DEALS, MOCK_WATCHLISTS, MOCK_ALERTS } from "@/lib/mock-data"
import { JourneyTooltip } from "@/components/journey-tooltip"
import { DemoBanner } from "@/components/demo-banner"
import { JourneyCompleteModal } from "@/components/journey-complete-modal"
import type { Deal, Watchlist, Alert } from "@/lib/types/deal"

export default function DashboardPage() {
  const [user, setUser] = useState<{ id: string; email: string } | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [watchlists, setWatchlists] = useState<Watchlist[]>([])
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [recentDeals, setRecentDeals] = useState<Deal[]>([])
  const router = useRouter()
  const { isDemoMode, currentStep, nextStep } = useJourney()

  // Auto-progress journey when user visits dashboard
  useEffect(() => {
    if (currentStep === "compare") {
      nextStep() // Move to "watchlist" step
    }
  }, [currentStep, nextStep])

  useEffect(() => {
    checkAuth()
  }, [])

  useEffect(() => {
    if (user || isDemoMode) {
      fetchData()
    }
  }, [user, isDemoMode])

  const checkAuth = async () => {
    const supabase = createClient()
    const { data: { user: authUser } } = await supabase.auth.getUser()
    
    if (!authUser && !isDemoMode) {
      // Allow demo mode access without auth
      if (localStorage.getItem("premium-deal-finder-demo") === "true") {
        setUser({ id: "demo-user", email: "demo@example.com" })
      } else {
        router.push("/login")
        return
      }
    } else if (authUser) {
      setUser({ id: authUser.id, email: authUser.email || "" })
    } else {
      setUser({ id: "demo-user", email: "demo@example.com" })
    }
    setIsLoading(false)
  }

  const fetchData = async () => {
    if (isDemoMode || user?.id === "demo-user") {
      setWatchlists(MOCK_WATCHLISTS)
      setAlerts(MOCK_ALERTS.filter(a => !a.is_sent))
      setRecentDeals(MOCK_DEALS.slice(0, 3))
      return
    }

    const supabase = createClient()
    
    try {
      const [watchlistRes, alertRes, dealsRes] = await Promise.all([
        supabase.from("watchlists").select("*").eq("user_id", user?.id),
        supabase.from("alerts").select("*").eq("user_id", user?.id).eq("is_sent", false),
        supabase.from("deals").select("*").order("created_at", { ascending: false }).limit(3)
      ])

      setWatchlists(watchlistRes.data || MOCK_WATCHLISTS)
      setAlerts(alertRes.data || MOCK_ALERTS.filter(a => !a.is_sent))
      setRecentDeals(dealsRes.data || MOCK_DEALS.slice(0, 3))
    } catch (error) {
      // Fallback to mock data
      setWatchlists(MOCK_WATCHLISTS)
      setAlerts(MOCK_ALERTS.filter(a => !a.is_sent))
      setRecentDeals(MOCK_DEALS.slice(0, 3))
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation isLoggedIn={true} />
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-6xl mx-auto space-y-6">
            <div className="h-12 w-64 bg-muted animate-pulse rounded-lg" />
            <div className="grid gap-6 md:grid-cols-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-32 bg-muted animate-pulse rounded-lg" />
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation isLoggedIn={true} />
      <JourneyCompleteModal />
      <DemoBanner />

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold font-space mb-2">Welcome back!</h1>
            <p className="text-muted-foreground">{"Here's what's happening with your flight deals"}</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
            <Card className="relative">
              <JourneyTooltip
                step="watchlist"
                title="Your Watchlists"
                description="Watchlists help you track specific routes. When a deal matches your criteria, you'll get notified!"
                position="bottom"
              />
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Watchlists</CardTitle>
                <Bell className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold font-space">{watchlists.length}</div>
                <p className="text-xs text-muted-foreground">Routes being monitored</p>
              </CardContent>
            </Card>

            <Card className="relative">
              <JourneyTooltip
                step="alerts"
                title="Deal Alerts"
                description="Alerts notify you when deals match your watchlists. Check here regularly for new opportunities!"
                position="bottom"
              />
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">New Alerts</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold font-space">{alerts.length}</div>
                <p className="text-xs text-muted-foreground">Unread notifications</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Available Deals</CardTitle>
                <Star className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold font-space">{recentDeals.length}+</div>
                <p className="text-xs text-muted-foreground">Latest opportunities</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="font-space">Quick Actions</CardTitle>
                <CardDescription>Manage your flight deal tracking</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button asChild className="w-full justify-start bg-transparent" variant="outline">
                  <Link href="/dashboard/watchlists">
                    <Bell className="h-4 w-4 mr-2" />
                    Manage Watchlists
                  </Link>
                </Button>
                <Button asChild className="w-full justify-start bg-transparent" variant="outline">
                  <Link href="/dashboard/alerts">
                    <Sparkles className="h-4 w-4 mr-2" />
                    View Alerts
                  </Link>
                </Button>
                <Button asChild className="w-full justify-start bg-transparent" variant="outline">
                  <Link href="/">
                    <MapPin className="h-4 w-4 mr-2" />
                    Browse All Deals
                  </Link>
                </Button>
                <Button asChild className="w-full justify-start bg-transparent" variant="outline">
                  <Link href="/dashboard/settings">
                    <Star className="h-4 w-4 mr-2" />
                    Alert Settings
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-space">Recent Deals</CardTitle>
                <CardDescription>Latest premium cabin opportunities</CardDescription>
              </CardHeader>
              <CardContent>
                {recentDeals.length > 0 ? (
                  <div className="space-y-4">
                    {recentDeals.map((deal) => (
                      <div
                        key={deal.id}
                        className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0"
                      >
                        <div>
                          <p className="font-medium">
                            {deal.departure_city} → {deal.destination_city}
                          </p>
                          <p className="text-sm text-muted-foreground">{deal.airline}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-primary">${deal.price_aud.toLocaleString()}</p>
                          {deal.discount_percentage && (
                            <p className="text-xs text-accent">{deal.discount_percentage}% off</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No recent deals available</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
