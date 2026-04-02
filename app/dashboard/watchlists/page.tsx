"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { WatchlistCard } from "@/components/watchlist-card"
import { useJourney } from "@/lib/contexts/journey-context"
import { MOCK_WATCHLISTS } from "@/lib/mock-data"
import { DemoBanner } from "@/components/demo-banner"
import type { Watchlist } from "@/lib/types/deal"

export default function WatchlistsPage() {
  const [user, setUser] = useState<{ id: string } | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [watchlists, setWatchlists] = useState<Watchlist[]>([])
  const router = useRouter()
  const { isDemoMode, currentStep, nextStep } = useJourney()
  
  // Auto-progress journey when user visits watchlists
  useEffect(() => {
    if (currentStep === "watchlist") {
      nextStep() // Move to "alerts" step
    }
  }, [currentStep, nextStep])

  useEffect(() => {
    checkAuth()
  }, [])

  useEffect(() => {
    if (user || isDemoMode) {
      fetchWatchlists()
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

  const fetchWatchlists = async () => {
    if (isDemoMode || user?.id === "demo-user") {
      setWatchlists(MOCK_WATCHLISTS)
      return
    }

    const supabase = createClient()
    
    try {
      const { data, error } = await supabase
        .from("watchlists")
        .select("*")
        .eq("user_id", user?.id)
        .order("created_at", { ascending: false })

      if (error) throw error
      setWatchlists(data || MOCK_WATCHLISTS)
    } catch (error) {
      setWatchlists(MOCK_WATCHLISTS)
    }
  }

  const handleDelete = async (id: string) => {
    if (isDemoMode || user?.id === "demo-user") {
      setWatchlists(prev => prev.filter(w => w.id !== id))
      return
    }

    const supabase = createClient()
    await supabase.from("watchlists").delete().eq("id", id)
    fetchWatchlists()
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation isLoggedIn={true} />
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-6xl mx-auto space-y-6">
            <div className="h-12 w-48 bg-muted animate-pulse rounded-lg" />
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-48 bg-muted animate-pulse rounded-lg" />
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
      <DemoBanner />

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold font-space mb-2">My Watchlists</h1>
              <p className="text-muted-foreground">Get notified when deals match your saved routes</p>
            </div>
            <Button asChild>
              <Link href="/dashboard/watchlists/new">
                <Plus className="h-4 w-4 mr-2" />
                Add Watchlist
              </Link>
            </Button>
          </div>

          {watchlists.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {watchlists.map((watchlist) => (
                <WatchlistCard 
                  key={watchlist.id} 
                  watchlist={watchlist} 
                  onDelete={() => handleDelete(watchlist.id)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="max-w-md mx-auto">
                <h3 className="text-xl font-semibold mb-2">No watchlists yet</h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  Create your first watchlist to receive alerts when premium deals match your preferred routes.
                </p>
                <Button asChild>
                  <Link href="/dashboard/watchlists/new">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Watchlist
                  </Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
