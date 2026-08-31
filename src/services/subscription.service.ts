import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

export type PlanId = 'free' | 'pro' | 'unlimited'

export type SubscriptionStatus =
  | 'active'
  | 'trialing'
  | 'past_due'
  | 'paused'
  | 'canceled'

export interface Plan {
  id: PlanId
  name: string
  paddlePriceIdMonthly: string | null
  emailsPerDay: number | null // null = unlimited
  maxConnectedProviders: number | null // null = unlimited
  historyDays: number | null // null = unlimited
  hasPrioritySupport: boolean
  hasIntegrationApi: boolean
  priceCents: number
}

export interface Subscription {
  id: string
  organizationId: string
  planId: PlanId
  status: SubscriptionStatus
  paddleCustomerId: string | null
  paddleSubscriptionId: string | null
  paddlePriceId: string | null
  currentPeriodStart: Date | null
  currentPeriodEnd: Date | null
  canceledAt: Date | null
  endedAt: Date | null
  createdAt: Date
  updatedAt: Date
  plan: Plan
}

export interface SubscriptionStats {
  plan: Plan
  status: SubscriptionStatus
  currentPeriodEnd: Date | null
  providers: {
    current: number
    max: number | null
    canAdd: boolean
  }
  features: {
    prioritySupport: boolean
    integrationApi: boolean
  }
}

export const subscriptionService = {
  /**
   * Get current organization subscription
   */
  async getCurrentSubscription(): Promise<Subscription> {
    const response = await axios.get(`${API_URL}/subscriptions/current`, {
      withCredentials: true,
    })
    return response.data
  },

  /**
   * Get subscription stats
   */
  async getStats(): Promise<SubscriptionStats> {
    const response = await axios.get(`${API_URL}/subscriptions/stats`, {
      withCredentials: true,
    })
    return response.data
  },

  /**
   * Get all available plans
   */
  async getPlans(): Promise<Plan[]> {
    const response = await axios.get(`${API_URL}/subscriptions/plans`, {
      withCredentials: true,
    })
    return response.data
  },

  /**
   * Check if can add provider
   */
  async canAddProvider(): Promise<{
    allowed: boolean
    reason?: string
    currentCount?: number
    maxAllowed?: number | null
  }> {
    const response = await axios.get(`${API_URL}/subscriptions/can-add-provider`, {
      withCredentials: true,
    })
    return response.data
  },

  /**
   * Get Paddle configuration for frontend
   */
  async getPaddleConfig(): Promise<{
    clientToken: string
    environment: 'sandbox' | 'production'
    customerEmail: string
    organizationId: string
    plans: Array<{ id: string; name: string; priceId: string | null }>
  }> {
    const response = await axios.get(`${API_URL}/subscriptions/paddle-config`, {
      withCredentials: true,
    })
    return response.data
  },
}
