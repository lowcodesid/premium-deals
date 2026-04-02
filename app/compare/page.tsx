"use client"

import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useComparison } from "@/lib/hooks/use-comparison"
import { ArrowLeft, Calendar, MapPin, Plane, ExternalLink, X, TrendingDown } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { DemoBanner } from "@/components/demo-banner"

export default function ComparePage() {
  const { deals, removeDeal, clearDeals } = useComparison()

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

  if (deals.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation isLoggedIn={false} />
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto text-center py-16">
            <h1 className="text-3xl font-bold mb-4 font-space">No Deals to Compare</h1>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              Add deals from the homepage to compare prices, routes, and cabin classes side by side.
            </p>
            <Button asChild>
              <Link href="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Browse Deals
              </Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation isLoggedIn={false} />
      <DemoBanner />

      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Button asChild variant="ghost" className="mb-4">
              <Link href="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Deals
              </Link>
            </Button>
            <h1 className="text-3xl md:text-4xl font-bold font-space">Compare Deals</h1>
            <p className="text-muted-foreground mt-2">Side-by-side comparison of {deals.length} deals</p>
          </div>
          <Button variant="outline" onClick={clearDeals}>
            Clear All
          </Button>
        </div>

        {/* Mobile View - Stacked Cards */}
        <div className="lg:hidden space-y-6">
          {deals.map((deal) => (
            <Card key={deal.id} className="relative">
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 z-10"
                onClick={() => removeDeal(deal.id)}
              >
                <X className="h-4 w-4" />
              </Button>

              <CardHeader>
                <div className="flex items-center gap-2 flex-wrap mb-2">
                  <Badge className={cn("font-semibold", getDealTypeColor(deal.deal_type))}>
                    {formatDealType(deal.deal_type)}
                  </Badge>
                  <Badge variant="outline">{getCabinClassLabel(deal.cabin_class)}</Badge>
                </div>
                <CardTitle className="font-space">{deal.airline}</CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 text-primary" />
                    <span className="font-medium text-foreground">
                      {deal.departure_city} ({deal.departure_airport})
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Plane className="h-4 w-4 text-accent rotate-90" />
                    <span className="font-medium text-foreground">
                      {deal.destination_city} ({deal.destination_airport})
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {format(new Date(deal.departure_date), "MMM d, yyyy")}
                    {deal.return_date && ` - ${format(new Date(deal.return_date), "MMM d, yyyy")}`}
                  </span>
                </div>

                <div className="pt-2 border-t">
                  {deal.deal_type === "points_redemption" ? (
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold text-primary font-space">
                        {deal.points_required?.toLocaleString()}
                      </span>
                      <span className="text-sm text-muted-foreground">{deal.points_currency}</span>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-baseline gap-2 mb-1">
                        <span className="text-2xl font-bold text-primary font-space">
                          ${deal.price_aud.toLocaleString()}
                        </span>
                        {deal.original_price_aud && (
                          <span className="text-sm text-muted-foreground line-through">
                            ${deal.original_price_aud.toLocaleString()}
                          </span>
                        )}
                      </div>
                      {deal.discount_percentage && (
                        <div className="flex items-center gap-1 text-accent font-semibold text-sm">
                          <TrendingDown className="h-4 w-4" />
                          <span>{deal.discount_percentage}% off</span>
                        </div>
                      )}
                    </>
                  )}
                </div>

                <Button asChild className="w-full">
                  <a href={deal.booking_url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Book This Deal
                  </a>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Desktop View - Comparison Table */}
        <div className="hidden lg:block overflow-x-auto">
          <div className="grid grid-cols-[200px_repeat(auto-fit,minmax(250px,1fr))] gap-4">
            {/* Row Headers */}
            <div className="space-y-4">
              <div className="h-20" />
              <Card className="p-4 font-semibold text-sm">Airline</Card>
              <Card className="p-4 font-semibold text-sm">Deal Type</Card>
              <Card className="p-4 font-semibold text-sm">Cabin Class</Card>
              <Card className="p-4 font-semibold text-sm">Route</Card>
              <Card className="p-4 font-semibold text-sm">Dates</Card>
              <Card className="p-4 font-semibold text-sm">Price</Card>
              <Card className="p-4 font-semibold text-sm">Savings</Card>
              <Card className="p-4 font-semibold text-sm">Alliance</Card>
              <Card className="p-4 font-semibold text-sm">Availability</Card>
              <Card className="p-4 font-semibold text-sm">Action</Card>
            </div>

            {/* Deal Columns */}
            {deals.map((deal) => (
              <div key={deal.id} className="space-y-4">
                <Card className="p-4 h-20 relative">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={() => removeDeal(deal.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </Card>
                <Card className="p-4 font-semibold">{deal.airline}</Card>
                <Card className="p-4">
                  <Badge className={cn("font-semibold", getDealTypeColor(deal.deal_type))}>
                    {formatDealType(deal.deal_type)}
                  </Badge>
                </Card>
                <Card className="p-4">{getCabinClassLabel(deal.cabin_class)}</Card>
                <Card className="p-4 text-sm">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-primary" />
                      <span>
                        {deal.departure_city} ({deal.departure_airport})
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-accent" />
                      <span>
                        {deal.destination_city} ({deal.destination_airport})
                      </span>
                    </div>
                  </div>
                </Card>
                <Card className="p-4 text-sm">
                  {format(new Date(deal.departure_date), "MMM d, yyyy")}
                  {deal.return_date && (
                    <>
                      <br />
                      {format(new Date(deal.return_date), "MMM d, yyyy")}
                    </>
                  )}
                </Card>
                <Card className="p-4">
                  {deal.deal_type === "points_redemption" ? (
                    <div>
                      <div className="text-xl font-bold text-primary font-space">
                        {deal.points_required?.toLocaleString()}
                      </div>
                      <div className="text-xs text-muted-foreground">{deal.points_currency}</div>
                    </div>
                  ) : (
                    <div className="text-xl font-bold text-primary font-space">${deal.price_aud.toLocaleString()}</div>
                  )}
                </Card>
                <Card className="p-4">
                  {deal.original_price_aud ? (
                    <div>
                      <div className="text-sm line-through text-muted-foreground">
                        ${deal.original_price_aud.toLocaleString()}
                      </div>
                      <div className="text-accent font-semibold">{deal.discount_percentage}% off</div>
                    </div>
                  ) : (
                    <span className="text-muted-foreground">-</span>
                  )}
                </Card>
                <Card className="p-4 capitalize">{deal.alliance !== "none" ? deal.alliance : "-"}</Card>
                <Card className="p-4">
                  {deal.availability_count} {deal.availability_count === 1 ? "seat" : "seats"}
                </Card>
                <Card className="p-4">
                  <Button asChild className="w-full" size="sm">
                    <a href={deal.booking_url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4 mr-1" />
                      Book
                    </a>
                  </Button>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
