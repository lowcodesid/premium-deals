"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { Deal } from "@/lib/types/deal"

interface ComparisonStore {
  deals: Deal[]
  addDeal: (deal: Deal) => void
  removeDeal: (dealId: string) => void
  clearDeals: () => void
  hasDeal: (dealId: string) => boolean
}

export const useComparison = create<ComparisonStore>()(
  persist(
    (set, get) => ({
      deals: [],
      addDeal: (deal) => {
        const current = get().deals
        if (current.length >= 4) {
          return
        }
        if (!current.find((d) => d.id === deal.id)) {
          set({ deals: [...current, deal] })
        }
      },
      removeDeal: (dealId) => {
        set({ deals: get().deals.filter((d) => d.id !== dealId) })
      },
      clearDeals: () => set({ deals: [] }),
      hasDeal: (dealId) => get().deals.some((d) => d.id === dealId),
    }),
    {
      name: "deal-comparison",
    },
  ),
)
