import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plane, Bell, Search, Star, TrendingDown, Zap } from "lucide-react"

export default function GuidePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation isLoggedIn={false} />

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="space-y-6 mb-12">
          <Badge className="bg-accent/10 text-accent border-accent/20">
            <Star className="h-3 w-3 mr-1" />
            Premium Travel Guide
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold font-space text-balance">
            How to Find & Book Premium Flight Deals
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Your complete guide to discovering and securing business and first class flights at unbeatable prices.
          </p>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Search className="h-5 w-5" />
                </div>
                <CardTitle className="font-space">Understanding Deal Types</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-red-500" />
                  <h3 className="font-semibold">Mistake Fares</h3>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  Pricing errors by airlines or booking systems. These are extremely rare but offer the deepest
                  discounts (often 50-90% off). Act fast as airlines may cancel bookings.
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <TrendingDown className="h-5 w-5 text-blue-500" />
                  <h3 className="font-semibold">Sales</h3>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  Official airline promotions with 20-50% discounts. More common than mistake fares and bookings are
                  guaranteed. Great for planned trips.
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-purple-500" />
                  <h3 className="font-semibold">Points Redemptions</h3>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  Premium cabin award availability using frequent flyer points. Best value when transferring points from
                  credit cards to airline partners.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                  <Bell className="h-5 w-5" />
                </div>
                <CardTitle className="font-space">Setting Up Watchlists</CardTitle>
              </div>
              <CardDescription>Never miss a deal on your favorite routes</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-muted-foreground leading-relaxed">
                Create a free account to set up watchlists for specific routes. You'll receive instant email
                notifications when new deals match your criteria:
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span>Choose your departure city and dream destination</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span>Select cabin classes (Business, First, or Premium Economy)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span>Set a maximum price threshold</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span>Enable flexible dates for more opportunities</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-chart-2 text-white">
                  <Plane className="h-5 w-5" />
                </div>
                <CardTitle className="font-space">Booking Tips</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-accent font-bold">1.</span>
                  <span className="leading-relaxed">
                    <strong className="text-foreground">Act Quickly:</strong> Premium deals can disappear in hours,
                    especially mistake fares
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent font-bold">2.</span>
                  <span className="leading-relaxed">
                    <strong className="text-foreground">Book Direct:</strong> Always book through the airline's official
                    website when possible
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent font-bold">3.</span>
                  <span className="leading-relaxed">
                    <strong className="text-foreground">Check Visa Requirements:</strong> Ensure you can legally travel
                    to your destination
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent font-bold">4.</span>
                  <span className="leading-relaxed">
                    <strong className="text-foreground">Consider Travel Insurance:</strong> Especially for mistake fares
                    that might be cancelled
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent font-bold">5.</span>
                  <span className="leading-relaxed">
                    <strong className="text-foreground">Join Airline Alliances:</strong> Maximize benefits with Star
                    Alliance, Oneworld, or SkyTeam memberships
                  </span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
