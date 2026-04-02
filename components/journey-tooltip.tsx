"use client"

import { useJourney } from "@/lib/contexts/journey-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { X, ArrowRight, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

interface JourneyTooltipProps {
  step: string
  title: string
  description: string
  position?: "top" | "bottom" | "left" | "right"
  showSkip?: boolean
  className?: string
}

export function JourneyTooltip({
  step,
  title,
  description,
  position = "bottom",
  showSkip = true,
  className,
}: JourneyTooltipProps) {
  const { currentStep, nextStep, skipJourney } = useJourney()

  if (currentStep !== step) return null

  const positionClasses = {
    top: "bottom-full mb-3 left-1/2 -translate-x-1/2",
    bottom: "top-full mt-3 left-1/2 -translate-x-1/2",
    left: "right-full mr-3 top-1/2 -translate-y-1/2",
    right: "left-full ml-3 top-1/2 -translate-y-1/2",
  }

  const arrowClasses = {
    top: "top-full left-1/2 -translate-x-1/2 border-t-primary border-x-transparent border-b-transparent",
    bottom: "bottom-full left-1/2 -translate-x-1/2 border-b-primary border-x-transparent border-t-transparent",
    left: "left-full top-1/2 -translate-y-1/2 border-l-primary border-y-transparent border-r-transparent",
    right: "right-full top-1/2 -translate-y-1/2 border-r-primary border-y-transparent border-l-transparent",
  }

  return (
    <div className={cn("absolute z-50 w-80", positionClasses[position], className)}>
      <Card className="border-primary shadow-lg shadow-primary/20 animate-in fade-in slide-in-from-bottom-2 duration-300">
        <div
          className={cn(
            "absolute w-0 h-0 border-8",
            arrowClasses[position]
          )}
        />
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              {title}
            </CardTitle>
            {showSkip && (
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={skipJourney}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Skip tour</span>
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="pb-3">
          <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
        </CardContent>
        <CardFooter className="pt-0">
          <Button size="sm" onClick={nextStep} className="w-full">
            Continue
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
