"use client"

import { format } from "date-fns"
import { Calendar, MapPin, Plane, TrendingDown, ExternalLink, Star, Plus, Check } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Deal } from "@/lib/types/deal"
import { cn } from "@/lib/utils"
import { useComparison } from "@/lib/hooks/use-comparison"
import { useToast } from "@/hooks/use-toast"
import { JourneyTooltip } from "@/components/journey-tooltip"

interface DealCardProps {
  deal: Deal
  onAddToWatchlist?: (deal: Deal) => void
  showCompare?: boolean
  isFirstDeal?: boolean
}

export function DealCard({ deal, onAddToWatchlist, showCompare = true, isFirstDeal = false }: DealCardProps) {
  const { addDeal, removeDeal, hasDeal, deals } = useComparison()
  const { toast } = useToast()
  const isInComparison = hasDeal(deal.id)

  const getDealTypeColor = (type: string) => {
    switch (type) {
      case "mistake_fare":
        return "bg-red-500 text-white"
      case "sale":
        return "bg-blue-500 text-white"
      case "points_redemption":
        return "bg-purple-500 text-white"
      default:
        return "bg-green-500 text-white"
    }
  }

  const getCabinClassLabel = (cabin: string) => {
    switch (cabin) {
      case "business":
        return "Business"
      case "first":
        return "First"
      case "premium_economy":
        return "Premium Economy"
      default:
        return cabin
    }
  }

  const formatDealType = (type: string) => {
    return type
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  const isExpiringSoon = deal.expires_at
    ? new Date(deal.expires_at).getTime() - Date.now() < 3 * 24 * 60 * 60 * 1000
    : false

  const handleCompareToggle = () => {
    if (isInComparison) {
      removeDeal(deal.id)
      toast({
        title: "Removed from comparison",
        description: "Deal removed from comparison list",
      })
    } else {
      if (deals.length >= 4) {
        toast({
          title: "Comparison limit reached",
          description: "You can compare up to 4 deals at once",
          variant: "destructive",
        })
        return
      }
      addDeal(deal)
      toast({
        title: "Added to comparison",
        description: "Deal added to comparison list",
      })
    }
  }

  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg border-2 relative">
      {isFirstDeal && (
        <JourneyTooltip
          step="filter"
          title="Explore Deals"
          description="Browse through premium deals! Click the + button to add deals to your comparison list, or Book Now to go directly to the airline."
          position="right"
          className="md:left-full md:ml-4 left-1/2 -translate-x-1/2 md:translate-x-0 top-4 md:top-1/2 md:-translate-y-1/2"
        />
      )}
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <Badge className={cn("font-semibold", getDealTypeColor(deal.deal_type))}>
                {formatDealType(deal.deal_type)}
              </Badge>
              <Badge variant="outline" className="font-medium">
                {getCabinClassLabel(deal.cabin_class)}
              </Badge>
              {deal.alliance !== "none" && (
                <Badge variant="secondary" className="capitalize">
                  {deal.alliance}
                </Badge>
              )}
              {isExpiringSoon && (
                <Badge variant="destructive" className="animate-pulse">
                  Expiring Soon
                </Badge>
              )}
            </div>
            <h3 className="font-space text-xl font-bold text-foreground">{deal.airline}</h3>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pb-3">
        <div className="flex items-center gap-3 text-muted-foreground mb-4">
          <div className="flex items-center gap-1">
            <MapPin className="h-4 w-4 text-primary" />
            <span className="font-medium text-foreground">
              {deal.departure_city} ({deal.departure_airport})
            </span>
          </div>
          <Plane className="h-4 w-4 text-accent rotate-90" />
          <div className="flex items-center gap-1">
            <MapPin className="h-4 w-4 text-accent" />
            <span className="font-medium text-foreground">
              {deal.destination_city} ({deal.destination_airport})
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
          <Calendar className="h-4 w-4" />
          <span>
            {format(new Date(deal.departure_date), "MMM d, yyyy")}
            {deal.return_date && ` - ${format(new Date(deal.return_date), "MMM d, yyyy")}`}
          </span>
        </div>

        <div className="flex items-baseline gap-2">
          {deal.deal_type === "points_redemption" ? (
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-primary font-space">
                {deal.points_required?.toLocaleString()}
              </span>
              <span className="text-sm text-muted-foreground">{deal.points_currency}</span>
            </div>
          ) : (
            <>
              <span className="text-3xl font-bold text-primary font-space">${deal.price_aud.toLocaleString()}</span>
              {deal.original_price_aud && (
                <>
                  <span className="text-lg text-muted-foreground line-through">
                    ${deal.original_price_aud.toLocaleString()}
                  </span>
                  <div className="flex items-center gap-1 text-accent font-semibold">
                    <TrendingDown className="h-4 w-4" />
                    <span>{deal.discount_percentage}% off</span>
                  </div>
                </>
              )}
            </>
          )}
        </div>

        {deal.availability_count && (
          <p className="text-xs text-muted-foreground mt-2">
            {deal.availability_count} {deal.availability_count === 1 ? "seat" : "seats"} available
          </p>
        )}
      </CardContent>

      <CardFooter className="pt-3 gap-2">
        <Button asChild className="flex-1">
          <a href={deal.booking_url} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="h-4 w-4 mr-2" />
            Book Now
          </a>
        </Button>
        {showCompare && (
          <Button
            variant={isInComparison ? "default" : "outline"}
            size="icon"
            onClick={handleCompareToggle}
            className={cn(isInComparison && "bg-accent hover:bg-accent/90")}
          >
            {isInComparison ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          </Button>
        )}
        {onAddToWatchlist && (
          <Button variant="outline" size="icon" onClick={() => onAddToWatchlist(deal)}>
            <Star className="h-4 w-4" />
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
