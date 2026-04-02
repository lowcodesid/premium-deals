"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

type JourneyStep =
  | "welcome"
  | "search"
  | "filter"
  | "compare"
  | "watchlist"
  | "alerts"
  | "complete"
  | null

interface JourneyContextType {
  currentStep: JourneyStep
  isJourneyActive: boolean
  isDemoMode: boolean
  startJourney: () => void
  nextStep: () => void
  skipJourney: () => void
  goToStep: (step: JourneyStep) => void
  enableDemo: () => void
  disableDemo: () => void
}

const JourneyContext = createContext<JourneyContextType | undefined>(undefined)

const JOURNEY_STEPS: JourneyStep[] = [
  "welcome",
  "search",
  "filter",
  "compare",
  "watchlist",
  "alerts",
  "complete",
]

export function JourneyProvider({ children }: { children: ReactNode }) {
  const [currentStep, setCurrentStep] = useState<JourneyStep>(null)
  const [isJourneyActive, setIsJourneyActive] = useState(false)
  const [isDemoMode, setIsDemoMode] = useState(false)

  useEffect(() => {
    // Check if demo mode is enabled
    const demo = localStorage.getItem("premium-deal-finder-demo") === "true"
    setIsDemoMode(demo)
    
    // Check if journey was in progress
    const savedStep = localStorage.getItem("premium-deal-finder-journey-step") as JourneyStep
    if (savedStep && JOURNEY_STEPS.includes(savedStep)) {
      setCurrentStep(savedStep)
      setIsJourneyActive(true)
    }
  }, [])

  const startJourney = () => {
    setCurrentStep("welcome")
    setIsJourneyActive(true)
    localStorage.setItem("premium-deal-finder-journey-step", "welcome")
  }

  const nextStep = () => {
    const currentIndex = JOURNEY_STEPS.indexOf(currentStep)
    if (currentIndex < JOURNEY_STEPS.length - 1) {
      const next = JOURNEY_STEPS[currentIndex + 1]
      setCurrentStep(next)
      localStorage.setItem("premium-deal-finder-journey-step", next || "")
    } else {
      skipJourney()
    }
  }

  const skipJourney = () => {
    setCurrentStep(null)
    setIsJourneyActive(false)
    localStorage.removeItem("premium-deal-finder-journey-step")
    localStorage.setItem("premium-deal-finder-journey-complete", "true")
  }

  const goToStep = (step: JourneyStep) => {
    setCurrentStep(step)
    if (step) {
      setIsJourneyActive(true)
      localStorage.setItem("premium-deal-finder-journey-step", step)
    } else {
      setIsJourneyActive(false)
      localStorage.removeItem("premium-deal-finder-journey-step")
    }
  }

  const enableDemo = () => {
    setIsDemoMode(true)
    localStorage.setItem("premium-deal-finder-demo", "true")
  }

  const disableDemo = () => {
    setIsDemoMode(false)
    localStorage.removeItem("premium-deal-finder-demo")
  }

  return (
    <JourneyContext.Provider
      value={{
        currentStep,
        isJourneyActive,
        isDemoMode,
        startJourney,
        nextStep,
        skipJourney,
        goToStep,
        enableDemo,
        disableDemo,
      }}
    >
      {children}
    </JourneyContext.Provider>
  )
}

export function useJourney() {
  const context = useContext(JourneyContext)
  if (context === undefined) {
    throw new Error("useJourney must be used within a JourneyProvider")
  }
  return context
}
