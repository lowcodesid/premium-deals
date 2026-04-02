"use client"

import { useState } from "react"
import { Search, MapPin, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { AUSTRALIAN_CITIES, POPULAR_DESTINATIONS, CABIN_CLASSES } from "@/lib/constants"
import { JourneyTooltip } from "@/components/journey-tooltip"

interface SearchFormProps {
  onSearch: (filters: SearchFilters) => void
}

export interface SearchFilters {
  departure?: string
  destination?: string
  cabinClasses: string[]
  dealTypes: string[]
  maxPrice?: number
}

export function SearchForm({ onSearch }: SearchFormProps) {
  const [departure, setDeparture] = useState<string>("")
  const [destination, setDestination] = useState<string>("")
  const [cabinClasses, setCabinClasses] = useState<string[]>(["business", "first", "premium_economy"])

  const handleSearch = () => {
    onSearch({
      departure: departure || undefined,
      destination: destination || undefined,
      cabinClasses,
      dealTypes: [],
    })
  }

  const toggleCabinClass = (value: string) => {
    setCabinClasses((prev) => (prev.includes(value) ? prev.filter((c) => c !== value) : [...prev, value]))
  }

  return (
    <Card className="p-6 bg-card border-2 shadow-lg relative">
      <JourneyTooltip
        step="search"
        title="Search for Deals"
        description="Select your departure city and destination to find premium cabin deals. You can filter by cabin class too!"
        position="top"
      />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-2">
          <Label htmlFor="departure" className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-primary" />
            From
          </Label>
          <Select value={departure} onValueChange={setDeparture}>
            <SelectTrigger id="departure">
              <SelectValue placeholder="Any Australian city" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any city</SelectItem>
              {AUSTRALIAN_CITIES.map((city) => (
                <SelectItem key={city.code} value={city.name}>
                  {city.name} ({city.airport})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="destination" className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-accent" />
            To
          </Label>
          <Select value={destination} onValueChange={setDestination}>
            <SelectTrigger id="destination">
              <SelectValue placeholder="Any destination" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any destination</SelectItem>
              {POPULAR_DESTINATIONS.map((city) => (
                <SelectItem key={city.code} value={city.name}>
                  {city.name} ({city.airport})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            Cabin Class
          </Label>
          <div className="flex flex-col gap-2 pt-2">
            {CABIN_CLASSES.map((cabin) => (
              <div key={cabin.value} className="flex items-center space-x-2">
                <Checkbox
                  id={cabin.value}
                  checked={cabinClasses.includes(cabin.value)}
                  onCheckedChange={() => toggleCabinClass(cabin.value)}
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

        <div className="flex items-end">
          <Button onClick={handleSearch} className="w-full h-11" size="lg">
            <Search className="h-4 w-4 mr-2" />
            Search Deals
          </Button>
        </div>
      </div>
    </Card>
  )
}
