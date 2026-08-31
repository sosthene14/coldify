import { create } from 'zustand'
import { subscriptionService } from '../services/subscription.service'
import type { SubscriptionStats, Plan } from '../services/subscription.service'

interface SubscriptionState {
  stats: SubscriptionStats | null
  plans: Plan[]
  loading: boolean
  error: string | null
  fetchStats: () => Promise<void>
  fetchPlans: () => Promise<void>
  canAddProvider: () => Promise<boolean>
}

export const useSubscriptionStore = create<SubscriptionState>((set, ) => ({
  stats: null,
  plans: [],
  loading: false,
  error: null,

  fetchStats: async () => {
    set({ loading: true, error: null })
    try {
      const stats = await subscriptionService.getStats()
      set({ stats, loading: false })
    } catch (error: any) {
      set({ error: error.message || 'Failed to fetch subscription stats', loading: false })
    }
  },

  fetchPlans: async () => {
    try {
      const plans = await subscriptionService.getPlans()
      set({ plans })
    } catch (error: any) {
      console.error('Failed to fetch plans:', error)
    }
  },

  canAddProvider: async () => {
    try {
      const result = await subscriptionService.canAddProvider()
      return result.allowed
    } catch (error: any) {
      console.error('Failed to check provider limit:', error)
      return false
    }
  },
}))
