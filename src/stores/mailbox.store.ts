import { create } from 'zustand'
import { mailboxService, type Mailbox } from '../services/mailbox.service'

interface MailboxState {
  mailboxes: Mailbox[]
  loading: boolean
  error: string | null
  
  // Actions
  fetchMailboxes: () => Promise<void>
  connectGmail: () => Promise<void>
  connectSmtp: (config: {
    email: string
    displayName?: string
    smtpHost: string
    smtpPort: number
    smtpUsername: string
    smtpPassword: string
    smtpSecure: boolean
  }) => Promise<void>
  updateSmtp: (id: string, config: {
    displayName?: string
    smtpHost?: string
    smtpPort?: number
    smtpUsername?: string
    smtpPassword?: string
    smtpSecure?: boolean
  }) => Promise<void>
  disconnect: (id: string) => Promise<void>
  updateSignature: (id: string, signature: string) => Promise<void>
  updateDailyLimit: (id: string, dailyLimit: number) => Promise<void>
  testConnection: (id: string) => Promise<boolean>
}

export const useMailboxStore = create<MailboxState>((set, get) => ({
  mailboxes: [],
  loading: false,
  error: null,

  fetchMailboxes: async () => {
    set({ loading: true, error: null })
    try {
      const mailboxes = await mailboxService.getAll()
      set({ mailboxes, loading: false })
    } catch (error: any) {
      set({ error: error.message, loading: false })
    }
  },

  connectGmail: async () => {
    try {
      const { authUrl } = await mailboxService.connectGmail()
      // Open Gmail OAuth in new window
      window.location.href = authUrl
    } catch (error: any) {
      set({ error: error.message })
      throw error
    }
  },

  connectSmtp: async (config) => {
    set({ loading: true, error: null })
    try {
      await mailboxService.connectSmtp(config)
      // Refresh mailboxes after successful connection
      await get().fetchMailboxes()
    } catch (error: any) {
      set({ error: error.message, loading: false })
      throw error
    }
  },

  updateSmtp: async (id, config) => {
    set({ loading: true, error: null })
    try {
      await mailboxService.updateSmtp(id, config)
      // Refresh mailboxes after successful update
      await get().fetchMailboxes()
    } catch (error: any) {
      set({ error: error.message, loading: false })
      throw error
    }
  },

  disconnect: async (id: string) => {
    try {
      await mailboxService.disconnect(id)
      const mailboxes = get().mailboxes.filter((mb) => mb.id !== id)
      set({ mailboxes })
    } catch (error: any) {
      set({ error: error.message })
      throw error
    }
  },

  updateSignature: async (id: string, signature: string) => {
    try {
      const updated = await mailboxService.updateSignature(id, signature)
      const mailboxes = get().mailboxes.map((mb) =>
        mb.id === id ? updated : mb
      )
      set({ mailboxes })
    } catch (error: any) {
      set({ error: error.message })
      throw error
    }
  },

  updateDailyLimit: async (id: string, dailyLimit: number) => {
    try {
      const updated = await mailboxService.updateDailyLimit(id, dailyLimit)
      const mailboxes = get().mailboxes.map((mb) =>
        mb.id === id ? updated : mb
      )
      set({ mailboxes })
    } catch (error: any) {
      set({ error: error.message })
      throw error
    }
  },

  testConnection: async (id: string) => {
    try {
      const result = await mailboxService.testConnection(id)
      if (result.success) {
        // Refresh mailboxes to get updated status
        await get().fetchMailboxes()
        return true
      }
      return false
    } catch (error: any) {
      set({ error: error.message })
      return false
    }
  },
}))
