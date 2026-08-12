import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

export interface Mailbox {
  id: string
  organizationId: string
  memberId: string
  email: string
  provider: 'gmail' | 'outlook' | 'smtp'
  status: 'connected' | 'error' | 'pending' | 'disconnected'
  lastError: string | null
  lastSyncAt: Date | null
  dailyLimit: number
  dailySent: number
  lastResetAt: Date
  warmupEnabled: boolean
  warmupProgress: number
  warmupStartDate: Date | null
  signature: string | null
  createdAt: Date
  updatedAt: Date
}

export const mailboxService = {
  /**
   * Get all mailboxes for the organization
   */
  async getAll(): Promise<Mailbox[]> {
    const response = await axios.get(`${API_URL}/mailboxes`, {
      withCredentials: true,
    })
    return response.data
  },

  /**
   * Get mailbox by ID
   */
  async getById(id: string): Promise<Mailbox> {
    const response = await axios.get(`${API_URL}/mailboxes/${id}`, {
      withCredentials: true,
    })
    return response.data
  },

  /**
   * Initiate Gmail OAuth flow
   */
  async connectGmail(): Promise<{ authUrl: string }> {
    const response = await axios.get(`${API_URL}/mailboxes/gmail/connect`, {
      withCredentials: true,
    })
    return response.data
  },

  /**
   * Connect SMTP mailbox
   */
  async connectSmtp(config: {
    email: string
    displayName?: string
    smtpHost: string
    smtpPort: number
    smtpUsername: string
    smtpPassword: string
    smtpSecure: boolean
  }): Promise<{ success: boolean; mailbox: Mailbox }> {
    const response = await axios.post(
      `${API_URL}/mailboxes/smtp/connect`,
      config,
      { withCredentials: true }
    )
    return response.data
  },

  /**
   * Update SMTP mailbox
   */
  async updateSmtp(
    id: string,
    config: {
      displayName?: string
      smtpHost?: string
      smtpPort?: number
      smtpUsername?: string
      smtpPassword?: string
      smtpSecure?: boolean
    }
  ): Promise<{ success: boolean; mailbox: Mailbox }> {
    const response = await axios.patch(
      `${API_URL}/mailboxes/${id}/smtp`,
      config,
      { withCredentials: true }
    )
    return response.data
  },

  /**
   * Disconnect mailbox
   */
  async disconnect(id: string): Promise<void> {
    await axios.delete(`${API_URL}/mailboxes/${id}`, {
      withCredentials: true,
    })
  },

  /**
   * Update signature
   */
  async updateSignature(id: string, signature: string): Promise<Mailbox> {
    const response = await axios.patch(
      `${API_URL}/mailboxes/${id}/signature`,
      { signature },
      { withCredentials: true }
    )
    return response.data
  },

  /**
   * Update daily limit
   */
  async updateDailyLimit(id: string, dailyLimit: number): Promise<Mailbox> {
    const response = await axios.patch(
      `${API_URL}/mailboxes/${id}/daily-limit`,
      { dailyLimit },
      { withCredentials: true }
    )
    return response.data
  },

  /**
   * Test mailbox connection
   */
  async testConnection(id: string): Promise<{ success: boolean; message?: string }> {
    const response = await axios.post(
      `${API_URL}/mailboxes/${id}/test`,
      {},
      { withCredentials: true }
    )
    return response.data
  },
}
