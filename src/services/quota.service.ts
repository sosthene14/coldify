import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

export interface QuotaStats {
  dailyUsed: number
  dailyLimit: number
  dailyRemaining: number
  monthlyUsed: number
  monthlyLimit: number | null
  monthlyRemaining: number | null
  totalSent: number
}

export const quotaService = {
  /**
   * Get organization email quota stats
   */
  async getStats(): Promise<QuotaStats> {
    const response = await axios.get(`${API_URL}/quota`, {
      withCredentials: true,
    })
    return response.data
  },

  /**
   * Update organization email limits (admin only)
   */
  async updateLimits(limits: {
    dailyLimit?: number
    monthlyLimit?: number | null
  }): Promise<{ success: boolean }> {
    const response = await axios.patch(
      `${API_URL}/quota/limits`,
      limits,
      { withCredentials: true }
    )
    return response.data
  },
}
