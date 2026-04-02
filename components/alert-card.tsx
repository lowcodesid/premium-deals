"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Plane, Calendar, ExternalLink, TrendingDown } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import type { Alert, Deal, Watchlist } from "@/lib/types/deal"

interface AlertCardProps {
  alert: Alert & {
    deals?: Deal | null
    watchlists?: Watchlist | null
  }
}

export function AlertCard({ alert }: AlertCardProps) {
  const deal = alert.deals
  const watchlist = alert.watchlists
  
  // If no deal data, don't render
  if (!deal || !watchlist) {
    return null
  }

  const getAlertTypeLabel = (type: string) => {
    switch (type) {
      case "new_deal":
        return "New Deal"
      case "price_drop":
        return "Price Drop"
      case "expiring_soon":
        return "Expiring Soon"
      default:
        return type
    }
  }

  const getAlertTypeColor = (type: string) => {
    switch (type) {
      case "new_deal":
        return "bg-blue-500 text-white"
      case "price_drop":
        return "bg-green-500 text-white"
      case "expiring_soon":
        return "bg-red-500 text-white"
      default:
        return "bg-gray-500 text-white"
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

  return (
    <Card className={cn("transition-all hover:shadow-lg", !alert.is_sent && "border-2 border-accent")}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge className={cn("font-semibold", getAlertTypeColor(alert.alert_type))}>
              {getAlertTypeLabel(alert.alert_type)}
            </Badge>
            {!alert.is_sent && (
              <Badge variant="outline" className="border-accent text-accent">
                Unread
              </Badge>
            )}
          </div>
          <span className="text-sm text-muted-foreground whitespace-nowrap">
            {format(new Date(alert.created_at), "MMM d, h:mm a")}
          </span>
        </div>

        <div className="mb-4">
          <p className="text-sm text-muted-foreground mb-2">
            Matching watchlist: {watchlist.departure_city} → {watchlist.destination_city}
          </p>
          <h3 className="text-xl font-bold font-space mb-1">{deal.airline}</h3>
          <Badge variant="outline" className="font-medium">
            {getCabinClassLabel(deal.cabin_class)}
          </Badge>
        </div>

        <div className="grid gap-3 mb-4">
          <div className="flex items-center gap-3 text-sm">
            <MapPin className="h-4 w-4 text-primary flex-shrink-0" />
            <span>
              {deal.departure_city} ({deal.departure_airport})
            </span>
            <Plane className="h-4 w-4 text-accent rotate-90 flex-shrink-0" />
            <span>
              {deal.destination_city} ({deal.destination_airport})
            </span>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>
              {format(new Date(deal.departure_date), "MMM d, yyyy")}
              {deal.return_date && ` - ${format(new Date(deal.return_date), "MMM d, yyyy")}`}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex items-baseline gap-2">
            {deal.deal_type === "points_redemption" ? (
              <>
                <span className="text-2xl font-bold text-primary font-space">
                  {deal.points_required?.toLocaleString()}
                </span>
                <span className="text-sm text-muted-foreground">{deal.points_currency}</span>
              </>
            ) : (
              <>
                <span className="text-2xl font-bold text-primary font-space">${deal.price_aud.toLocaleString()}</span>
                {deal.original_price_aud && (
                  <>
                    <span className="text-sm text-muted-foreground line-through">
                      ${deal.original_price_aud.toLocaleString()}
                    </span>
                    <div className="flex items-center gap-1 text-accent font-semibold text-sm">
                      <TrendingDown className="h-4 w-4" />
                      <span>{deal.discount_percentage}% off</span>
                    </div>
                  </>
                )}
              </>
            )}
          </div>

          <Button asChild>
            <a href={deal.booking_url} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4 mr-2" />
              View Deal
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
