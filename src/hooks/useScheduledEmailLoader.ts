
// hooks/useScheduledEmailLoader.ts
import { useEffect } from 'react'
import axios from 'axios'
import { notifications } from '@mantine/notifications'
import type { EmailFormData } from '#/components/ComposeEmail/ComposeEmailPage.tsx';
import { API_URL } from '#/configs/emailFilters.config.ts';


export const useScheduledEmailLoader = (
  editingId: string | null,
  onLoad: (data: Partial<EmailFormData>) => void
) => {
  useEffect(() => {
    if (!editingId) return

    const loadScheduledEmail = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/scheduled-emails/${editingId}`,
          { withCredentials: true }
        )
        
        const email = response.data
        
        onLoad({
          to: email.to || [],
          cc: email.cc || [],
          bcc: email.bcc || [],
          subject: email.subject || '',
          htmlContent: email.htmlContent || '',
          scheduledAt: email.scheduledAt ? new Date(email.scheduledAt) : null,
          mailboxId: email.mailboxId || null
        })

        notifications.show({
          title: 'Loaded',
          message: 'Scheduled email loaded for editing',
          color: 'blue',
        })
      } catch (error) {
        console.error('Failed to load scheduled email:', error)
        notifications.show({
          title: 'Error',
          message: 'Failed to load scheduled email',
          color: 'red',
        })
      }
    }

    loadScheduledEmail()
  }, [editingId])
}
