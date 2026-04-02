"use client"

import { useEffect } from "react"
import { useComparison } from "@/lib/hooks/use-comparison"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X, ArrowRight } from "lucide-react"
import Link from "next/link"
import { JourneyTooltip } from "@/components/journey-tooltip"
import { useJourney } from "@/lib/contexts/journey-context"

export function ComparisonBar() {
  const { deals, removeDeal, clearDeals } = useComparison()
  const { currentStep, nextStep } = useJourney()
  
  // Auto-progress journey when first deal is added
  useEffect(() => {
    if (deals.length === 1 && currentStep === "filter") {
      nextStep() // Move to "compare" step
    }
  }, [deals.length, currentStep, nextStep])

  if (deals.length === 0) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t bg-card shadow-lg">
      <JourneyTooltip
        step="compare"
        title="Compare Your Deals"
        description="Click Compare to see all your selected deals side-by-side. This helps you evaluate pricing, dates, and airlines at a glance!"
        position="top"
        className="left-1/2 -translate-x-1/2"
      />
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1 overflow-x-auto">
            <span className="text-sm font-semibold whitespace-nowrap">Compare Deals:</span>
            <div className="flex gap-2">
              {deals.map((deal) => (
                <Badge key={deal.id} variant="secondary" className="flex items-center gap-2 pr-1">
                  <span className="truncate max-w-[150px]">
                    {deal.departure_city} → {deal.destination_city}
                  </span>
                  <button
                    onClick={() => removeDeal(deal.id)}
                    className="hover:bg-muted rounded p-0.5 transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={clearDeals}>
              Clear All
            </Button>
            <Button asChild size="sm">
              <Link href="/compare">
                Compare ({deals.length})
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
