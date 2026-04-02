"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { AUSTRALIAN_CITIES, POPULAR_DESTINATIONS, CABIN_CLASSES, MONTHS } from "@/lib/constants"
import { createClient } from "@/lib/supabase/client"
import { useToast } from "@/hooks/use-toast"
import type { CabinClass } from "@/lib/types/deal"

interface WatchlistFormProps {
  userId: string
}

export function WatchlistForm({ userId }: WatchlistFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const [departureCity, setDepartureCity] = useState("")
  const [destinationCity, setDestinationCity] = useState("")
  const [cabinClasses, setCabinClasses] = useState<CabinClass[]>(["business"])
  const [maxPrice, setMaxPrice] = useState("")
  const [flexibleDates, setFlexibleDates] = useState(true)
  const [preferredMonths, setPreferredMonths] = useState<string[]>([])

  const toggleCabinClass = (value: CabinClass) => {
    setCabinClasses((prev) => (prev.includes(value) ? prev.filter((c) => c !== value) : [...prev, value]))
  }

  const toggleMonth = (month: string) => {
    setPreferredMonths((prev) => (prev.includes(month) ? prev.filter((m) => m !== month) : [...prev, month]))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!departureCity || !destinationCity) {
      toast({
        title: "Missing information",
        description: "Please select both departure and destination cities.",
        variant: "destructive",
      })
      return
    }

    if (cabinClasses.length === 0) {
      toast({
        title: "Missing information",
        description: "Please select at least one cabin class.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    const supabase = createClient()

    try {
      const { error } = await supabase.from("watchlists").insert({
        user_id: userId,
        departure_city: departureCity,
        destination_city: destinationCity,
        cabin_classes: cabinClasses,
        max_price_aud: maxPrice ? Number.parseFloat(maxPrice) : null,
        flexible_dates: flexibleDates,
        preferred_months: preferredMonths.length > 0 ? preferredMonths : null,
      })

      if (error) throw error

      toast({
        title: "Watchlist created!",
        description: "You'll receive alerts when deals match your criteria.",
      })

      router.push("/dashboard/watchlists")
      router.refresh()
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create watchlist. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle className="font-space">Route Details</CardTitle>
          <CardDescription>Choose the route you want to monitor</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="departure">Departure City *</Label>
              <Select value={departureCity} onValueChange={setDepartureCity} required>
                <SelectTrigger id="departure">
                  <SelectValue placeholder="Select city" />
                </SelectTrigger>
                <SelectContent>
                  {AUSTRALIAN_CITIES.map((city) => (
                    <SelectItem key={city.code} value={city.name}>
                      {city.name} ({city.airport})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="destination">Destination City *</Label>
              <Select value={destinationCity} onValueChange={setDestinationCity} required>
                <SelectTrigger id="destination">
                  <SelectValue placeholder="Select city" />
                </SelectTrigger>
                <SelectContent>
                  {POPULAR_DESTINATIONS.map((city) => (
                    <SelectItem key={city.code} value={city.name}>
                      {city.name} ({city.airport})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Cabin Classes *</Label>
            <div className="flex flex-col gap-3 pt-2">
              {CABIN_CLASSES.map((cabin) => (
                <div key={cabin.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={cabin.value}
                    checked={cabinClasses.includes(cabin.value as CabinClass)}
                    onCheckedChange={() => toggleCabinClass(cabin.value as CabinClass)}
                  />
                  <label
                    htmlFor={cabin.value}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {cabin.label}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="maxPrice">Maximum Price (AUD)</Label>
            <Input
              id="maxPrice"
              type="number"
              placeholder="e.g., 5000"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              min="0"
              step="100"
            />
            <p className="text-sm text-muted-foreground">Leave empty to see all prices</p>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="flexible">Flexible Dates</Label>
              <p className="text-sm text-muted-foreground">Get alerts for any travel dates</p>
            </div>
            <Switch id="flexible" checked={flexibleDates} onCheckedChange={setFlexibleDates} />
          </div>

          <div className="space-y-2">
            <Label>Preferred Months (Optional)</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 pt-2">
              {MONTHS.map((month) => (
                <div key={month} className="flex items-center space-x-2">
                  <Checkbox
                    id={month}
                    checked={preferredMonths.includes(month)}
                    onCheckedChange={() => toggleMonth(month)}
                  />
                  <label
                    htmlFor={month}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {month}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? "Creating..." : "Create Watchlist"}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.back()} disabled={isLoading}>
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  )
}
