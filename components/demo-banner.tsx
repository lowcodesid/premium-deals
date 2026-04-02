"use client"

import { useJourney } from "@/lib/contexts/journey-context"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FlaskConical, X, RotateCcw } from "lucide-react"

export function DemoBanner() {
  const { isDemoMode, disableDemo, startJourney } = useJourney()

  if (!isDemoMode) return null

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-auto z-40">
      <div className="flex items-center gap-3 rounded-lg border bg-background/95 backdrop-blur-sm px-4 py-3 shadow-lg">
        <Badge variant="outline" className="bg-accent/10 text-accent border-accent/20">
          <FlaskConical className="h-3 w-3 mr-1" />
          Demo Mode
        </Badge>
        <span className="text-sm text-muted-foreground hidden md:inline">
          Viewing sample data
        </span>
        <div className="flex items-center gap-2 ml-auto">
          <Button
            variant="ghost"
            size="sm"
            onClick={startJourney}
            className="text-xs"
          >
            <RotateCcw className="h-3 w-3 mr-1" />
            Restart Tour
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={disableDemo}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Exit demo mode</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
