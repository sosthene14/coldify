import axios from 'axios'
import { notifications } from '@mantine/notifications'
import { IconCheck, IconClock } from '@tabler/icons-react'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

export interface SendEmailParams {
  mailboxId: string
  to: string[]
  cc?: string[]
  bcc?: string[]
  subject: string
  html: string
  text?: string
  replyTo?: string
  templateId?: string // Track which template was used
  attachments?: Array<{
    filename: string
    mimeType: string
    objectKey: string
    size: number
  }>
}

// Alias utilisé par EmailSenderService (n'existait pas dans le fichier d'origine)
export type EmailParams = SendEmailParams

export interface UploadAttachmentParams {
  filename: string
  mimeType: string
  content: string // Base64
}

export const emailService = {
  /**
   * Upload attachment to server
   */
  async uploadAttachment(
    params: UploadAttachmentParams
  ): Promise<{ objectKey: string; url: string }> {
    const response = await axios.post(
      `${API_URL}/mailboxes/upload-attachment`,
      params,
      { withCredentials: true }
    )
    return response.data
  },

  /**
   * Send email immediately
   */
  async sendEmail(
    params: SendEmailParams
  ): Promise<{
    success: boolean
    messageId?: string
    messageIds?: string[]
    totalSent?: number
    error?: string
  }> {
    const response = await axios.post(
      `${API_URL}/mailboxes/send`,
      params,
      { withCredentials: true }
    )
    return response.data
  },

  /**
   * Schedule email for later
   */
  async scheduleEmail(
    params: SendEmailParams & { scheduledAt: string }
  ): Promise<{
    success: boolean
    scheduledId?: string
    error?: string
  }> {
    const response = await axios.post(
      `${API_URL}/mailboxes/schedule`,
      params,
      { withCredentials: true }
    )
    return response.data
  },

  /**
   * Convert File to Base64
   */
  fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => {
        const result = reader.result as string
        // Remove data:...;base64, prefix
        const base64 = result.split(',')[1]
        resolve(base64)
      }
      reader.onerror = (error) => reject(error)
    })
  },
}

export class EmailSenderService {
  static async sendEmail(emailParams: EmailParams) {
    const result = await emailService.sendEmail(emailParams)

    // Corrigé : on vérifie success et on lève une erreur si échec,
    // comme le fait déjà scheduleEmail (incohérence dans l'original)
    if (!result.success) {
      throw new Error(result.error || 'Failed to send email')
    }

    if (result.totalSent && result.totalSent > 1) {
      notifications.show({
        title: 'Success',
        message: `${result.totalSent} emails sent successfully (one to each recipient)`,
        color: 'green',
        icon: <IconCheck size={16} />,
      })
    } else {
      notifications.show({
        title: 'Success',
        message: 'Email sent successfully',
        color: 'green',
        icon: <IconCheck size={16} />,
      })
    }
  }

  static async scheduleEmail(emailParams: EmailParams, scheduledAt: Date) {
    const result = await emailService.scheduleEmail({
      ...emailParams,
      scheduledAt: scheduledAt.toISOString(),
    })

    if (!result.success) {
      throw new Error(result.error || 'Failed to schedule email')
    }

    notifications.show({
      title: 'Scheduled!',
      message: `Email scheduled for ${scheduledAt.toLocaleString()}`,
      color: 'blue',
      icon: <IconClock size={16} />,
    })
  }

  static async updateScheduledEmail(
    editingId: string,
    emailParams: EmailParams,
    scheduledAt: Date
  ) {
    const result = await axios.patch(
      `${API_URL}/scheduled-emails/${editingId}`,
      {
        ...emailParams,
        scheduledAt: scheduledAt.toISOString(),
      },
      { withCredentials: true }
    )

    if (!result.data.success) {
      throw new Error(result.data.error || 'Failed to update scheduled email')
    }

    notifications.show({
      title: 'Updated!',
      message: `Scheduled email updated for ${scheduledAt.toLocaleString()}`,
      color: 'green',
      icon: <IconCheck size={16} />,
    })
  }
}