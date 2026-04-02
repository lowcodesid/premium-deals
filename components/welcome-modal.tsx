"use client"

import { useJourney } from "@/lib/contexts/journey-context"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Plane, Bell, Sparkles, ArrowRight } from "lucide-react"

export function WelcomeModal() {
  const { currentStep, nextStep, skipJourney, enableDemo } = useJourney()

  if (currentStep !== "welcome") return null

  const handleStartTour = () => {
    enableDemo()
    nextStep()
  }

  const handleSkip = () => {
    enableDemo()
    skipJourney()
  }

  return (
    <Dialog open={true} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-lg" onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent">
              <Plane className="h-8 w-8 text-primary-foreground" />
            </div>
          </div>
          <DialogTitle className="text-2xl font-space">
            Welcome to Premium Deal Finder
          </DialogTitle>
          <DialogDescription className="text-base leading-relaxed">
            Discover business and first class flight deals from Australia at incredible prices.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h4 className="font-semibold">Find Premium Deals</h4>
              <p className="text-sm text-muted-foreground">
                Browse mistake fares, sales, and exclusive business/first class deals
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/10">
              <Bell className="h-5 w-5 text-accent" />
            </div>
            <div>
              <h4 className="font-semibold">Set Price Alerts</h4>
              <p className="text-sm text-muted-foreground">
                Create watchlists and get notified when deals match your routes
              </p>
            </div>
          </div>
        </div>

        <DialogFooter className="flex-col gap-2 sm:flex-col">
          <Button onClick={handleStartTour} className="w-full">
            Take a Quick Tour
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
          <Button variant="ghost" onClick={handleSkip} className="w-full">
            Skip and Explore
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
