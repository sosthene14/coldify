// hooks/useScheduledEmailLoader.ts
import { useEffect } from 'react'
import axios from 'axios'
import { useTranslation } from 'react-i18next'
import type { EmailFormData } from '#/components/ComposeEmail/ComposeEmailPage.tsx';
import { API_URL } from '#/configs/emailFilters.config.ts';
import toast from 'react-hot-toast';


export const useScheduledEmailLoader = (
  editingId: string | null,
  onLoad: (data: Partial<EmailFormData>) => void
) => {
  const { t } = useTranslation()

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

        toast.success(t('scheduled_email_loaded'))
      } catch (error) {
        console.error('Failed to load scheduled email:', error)
        toast.error(t('failed_load_scheduled_email'))
      }
    }

    loadScheduledEmail()
  }, [editingId])
}