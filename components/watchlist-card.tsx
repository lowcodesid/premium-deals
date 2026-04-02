"use client"

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Plane, Trash2, Edit } from "lucide-react"
import type { Watchlist } from "@/lib/types/deal"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { useState } from "react"

interface WatchlistCardProps {
  watchlist: Watchlist
  onDelete?: () => void
}

export function WatchlistCard({ watchlist, onDelete }: WatchlistCardProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isDeleting, setIsDeleting] = useState(false)

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

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this watchlist?")) {
      return
    }

    setIsDeleting(true)

    // If custom onDelete handler provided (for demo mode)
    if (onDelete) {
      onDelete()
      toast({
        title: "Watchlist deleted",
        description: "Your watchlist has been removed.",
      })
      setIsDeleting(false)
      return
    }

    const supabase = createClient()

    try {
      const { error } = await supabase.from("watchlists").delete().eq("id", watchlist.id)

      if (error) throw error

      toast({
        title: "Watchlist deleted",
        description: "Your watchlist has been removed.",
      })

      router.refresh()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete watchlist. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Card className="transition-all hover:shadow-lg border-2">
      <CardHeader>
        <CardTitle className="font-space text-xl flex items-center gap-2">
          <MapPin className="h-5 w-5 text-primary" />
          {watchlist.departure_city}
          <Plane className="h-4 w-4 text-accent rotate-90" />
          <MapPin className="h-5 w-5 text-accent" />
          {watchlist.destination_city}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div>
          <p className="text-sm font-medium mb-2">Cabin Classes</p>
          <div className="flex flex-wrap gap-2">
            {watchlist.cabin_classes.map((cabin) => (
              <Badge key={cabin} variant="secondary">
                {getCabinClassLabel(cabin)}
              </Badge>
            ))}
          </div>
        </div>

        {watchlist.max_price_aud && (
          <div>
            <p className="text-sm font-medium mb-1">Max Price</p>
            <p className="text-lg font-bold text-primary font-space">${watchlist.max_price_aud.toLocaleString()}</p>
          </div>
        )}

        <div className="flex items-center gap-2">
          <Badge variant={watchlist.flexible_dates ? "default" : "outline"}>
            {watchlist.flexible_dates ? "Flexible Dates" : "Specific Dates"}
          </Badge>
        </div>

        {watchlist.preferred_months && watchlist.preferred_months.length > 0 && (
          <div>
            <p className="text-sm font-medium mb-1">Preferred Months</p>
            <p className="text-sm text-muted-foreground">{watchlist.preferred_months.join(", ")}</p>
          </div>
        )}
      </CardContent>

      <CardFooter className="gap-2">
        <Button variant="outline" className="flex-1 bg-transparent" size="sm" disabled>
          <Edit className="h-4 w-4 mr-2" />
          Edit
        </Button>
        <Button variant="outline" size="sm" onClick={handleDelete} disabled={isDeleting}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  )
}
