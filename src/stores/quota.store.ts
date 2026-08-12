import { create } from 'zustand'
import { quotaService, type QuotaStats } from '../services/quota.service'

interface QuotaState {
  stats: QuotaStats | null
  loading: boolean
  error: string | null
  
  // Actions
  fetchStats: () => Promise<void>
  updateLimits: (limits: { dailyLimit?: number; monthlyLimit?: number | null }) => Promise<void>
}

export const useQuotaStore = create<QuotaState>((set, get) => ({
  stats: null,
  loading: false,
  error: null,

  fetchStats: async () => {
    set({ loading: true, error: null })
    try {
      const stats = await quotaService.getStats()
      set({ stats, loading: false })
    } catch (error: any) {
      set({ error: error.message, loading: false })
    }
  },

  updateLimits: async (limits) => {
    set({ loading: true, error: null })
    try {
      await quotaService.updateLimits(limits)
      // Refresh stats after update
      await get().fetchStats()
    } catch (error: any) {
      set({ error: error.message, loading: false })
      throw error
    }
  },
}))
