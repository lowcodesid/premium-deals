"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Navigation } from "@/components/navigation"
import { createClient } from "@/lib/supabase/client"
import { AlertCard } from "@/components/alert-card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Bell } from "lucide-react"
import { useJourney } from "@/lib/contexts/journey-context"
import { MOCK_ALERTS } from "@/lib/mock-data"
import { DemoBanner } from "@/components/demo-banner"
import { JourneyCompleteModal } from "@/components/journey-complete-modal"
import type { Alert, Deal, Watchlist } from "@/lib/types/deal"

type AlertWithRelations = Alert & { deals?: Deal | null; watchlists?: Watchlist | null }

export default function AlertsPage() {
  const [user, setUser] = useState<{ id: string } | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [alerts, setAlerts] = useState<AlertWithRelations[]>([])
  const router = useRouter()
  const { isDemoMode, currentStep, nextStep } = useJourney()
  
  // Auto-progress journey when user visits alerts
  useEffect(() => {
    if (currentStep === "alerts") {
      nextStep() // Move to "complete" step
    }
  }, [currentStep, nextStep])

  useEffect(() => {
    checkAuth()
  }, [])

  useEffect(() => {
    if (user || isDemoMode) {
      fetchAlerts()
    }
  }, [user, isDemoMode])

  const checkAuth = async () => {
    const supabase = createClient()
    const { data: { user: authUser } } = await supabase.auth.getUser()
    
    if (!authUser && !isDemoMode) {
      if (localStorage.getItem("premium-deal-finder-demo") === "true") {
        setUser({ id: "demo-user" })
      } else {
        router.push("/login")
        return
      }
    } else if (authUser) {
      setUser({ id: authUser.id })
    } else {
      setUser({ id: "demo-user" })
    }
    setIsLoading(false)
  }

  const fetchAlerts = async () => {
    if (isDemoMode || user?.id === "demo-user") {
      setAlerts(MOCK_ALERTS)
      return
    }

    const supabase = createClient()
    
    try {
      const { data, error } = await supabase
        .from("alerts")
        .select(`
          *,
          deals (*),
          watchlists (*)
        `)
        .eq("user_id", user?.id)
        .order("created_at", { ascending: false })

      if (error) throw error
      setAlerts(data || MOCK_ALERTS)
    } catch (error) {
      setAlerts(MOCK_ALERTS)
    }
  }

  const unreadCount = alerts.filter(a => !a.is_sent).length

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation isLoggedIn={true} />
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto space-y-4">
            <div className="h-12 w-48 bg-muted animate-pulse rounded-lg" />
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-muted animate-pulse rounded-lg" />
            ))}
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
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl md:text-4xl font-bold font-space">Alerts</h1>
                {unreadCount > 0 && (
                  <Badge className="bg-accent text-accent-foreground">{unreadCount} new</Badge>
                )}
              </div>
              <p className="text-muted-foreground">Deals matching your watchlists</p>
            </div>
          </div>

          {alerts.length > 0 ? (
            <div className="space-y-4">
              {alerts.map((alert) => (
                <AlertCard key={alert.id} alert={alert} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="flex items-center justify-center mb-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                  <Bell className="h-8 w-8 text-muted-foreground" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2">No alerts yet</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto leading-relaxed">
                When deals match your watchlists, {"you'll"} see them here. Make sure you have active watchlists set up.
              </p>
              <Button asChild>
                <a href="/dashboard/watchlists">View Watchlists</a>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
