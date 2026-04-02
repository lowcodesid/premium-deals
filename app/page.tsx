"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { SearchForm, type SearchFilters } from "@/components/search-form"
import { DealCard } from "@/components/deal-card"
import { ComparisonBar } from "@/components/comparison-bar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sparkles, TrendingUp, Zap } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import type { Deal } from "@/lib/types/deal"
import { useToast } from "@/hooks/use-toast"
import { useJourney } from "@/lib/contexts/journey-context"
import { MOCK_DEALS } from "@/lib/mock-data"
import { WelcomeModal } from "@/components/welcome-modal"
import { DemoBanner } from "@/components/demo-banner"
import { JourneyTooltip } from "@/components/journey-tooltip"
import { JourneyCompleteModal } from "@/components/journey-complete-modal"

export default function HomePage() {
  const [deals, setDeals] = useState<Deal[]>([])
  const [filteredDeals, setFilteredDeals] = useState<Deal[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeFilters, setActiveFilters] = useState<SearchFilters>({
    cabinClasses: ["business", "first", "premium_economy"],
    dealTypes: [],
  })
  const [isFirstVisit, setIsFirstVisit] = useState(false)
  const { toast } = useToast()
  const { isDemoMode, startJourney } = useJourney()

  useEffect(() => {
    // Check if first visit
    const hasVisited = localStorage.getItem("premium-deal-finder-visited")
    if (!hasVisited) {
      setIsFirstVisit(true)
      localStorage.setItem("premium-deal-finder-visited", "true")
      startJourney()
    }
    fetchDeals()
  }, [])

  // Re-fetch when demo mode changes
  useEffect(() => {
    fetchDeals()
  }, [isDemoMode])

  const fetchDeals = async () => {
    setIsLoading(true)

    // If demo mode, use mock data
    if (isDemoMode) {
      setDeals(MOCK_DEALS)
      setFilteredDeals(MOCK_DEALS)
      setIsLoading(false)
      return
    }

    const supabase = createClient()

    try {
      const { data, error } = await supabase.from("deals").select("*").order("created_at", { ascending: false })

      if (error) throw error

      // If no data from DB, fallback to mock data for demo
      if (!data || data.length === 0) {
        setDeals(MOCK_DEALS)
        setFilteredDeals(MOCK_DEALS)
      } else {
        setDeals(data)
        setFilteredDeals(data)
      }
    } catch (error) {
      // Fallback to mock data on error
      setDeals(MOCK_DEALS)
      setFilteredDeals(MOCK_DEALS)
      toast({
        title: "Using demo data",
        description: "Showing sample deals for demonstration.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = (filters: SearchFilters) => {
    setActiveFilters(filters)

    let filtered = [...deals]

    if (filters.departure) {
      filtered = filtered.filter((deal) => deal.departure_city === filters.departure)
    }

    if (filters.destination) {
      filtered = filtered.filter((deal) => deal.destination_city === filters.destination)
    }

    if (filters.cabinClasses.length > 0) {
      filtered = filtered.filter((deal) => filters.cabinClasses.includes(deal.cabin_class))
    }

    setFilteredDeals(filtered)
  }

  const filterByDealType = (dealType: string) => {
    const filtered = deals.filter((deal) => deal.deal_type === dealType)
    setFilteredDeals(filtered)
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation isLoggedIn={false} />

      {/* Journey Components */}
      <WelcomeModal />
      <JourneyCompleteModal />
      <DemoBanner />

      {/* Hero Section */}
      <section className="relative overflow-hidden border-b bg-gradient-to-br from-background via-background to-primary/5">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <Badge className="bg-primary/10 text-primary border-primary/20 mb-4">
              <Sparkles className="h-3 w-3 mr-1" />
              Live Deal Feed
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-balance font-space">
              Find Premium Flight Deals from <span className="text-primary">Australia</span>
            </h1>
            <p className="text-xl text-muted-foreground text-balance max-w-2xl mx-auto leading-relaxed">
              Track business and first class deals, set alerts for your dream routes, and never miss a premium cabin
              opportunity.
            </p>
          </div>

          <div className="max-w-5xl mx-auto mt-12">
            <SearchForm onSearch={handleSearch} />
          </div>

          <div className="flex items-center justify-center gap-3 mt-8 flex-wrap">
            <Button variant="outline" size="sm" onClick={() => filterByDealType("mistake_fare")}>
              <Zap className="h-4 w-4 mr-1" />
              Mistake Fares
            </Button>
            <Button variant="outline" size="sm" onClick={() => filterByDealType("sale")}>
              <TrendingUp className="h-4 w-4 mr-1" />
              Sales
            </Button>
            <Button variant="outline" size="sm" onClick={() => setFilteredDeals(deals)}>
              All Deals
            </Button>
          </div>
        </div>
      </section>

      {/* Deals Grid */}
      <section className="container mx-auto px-4 py-12 pb-32">
        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-80 rounded-xl bg-muted animate-pulse" />
            ))}
          </div>
        ) : filteredDeals.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-xl text-muted-foreground">No deals found matching your criteria.</p>
            <Button
              onClick={() => handleSearch({ cabinClasses: ["business", "first", "premium_economy"], dealTypes: [] })}
              className="mt-4"
            >
              Clear Filters
            </Button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold font-space">
                {filteredDeals.length} {filteredDeals.length === 1 ? "Deal" : "Deals"} Found
              </h2>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredDeals.map((deal, index) => (
                <DealCard key={deal.id} deal={deal} isFirstDeal={index === 0} />
              ))}
            </div>
          </>
        )}
      </section>

      {/* Comparison Bar */}
      <ComparisonBar />
    </div>
  )
}
