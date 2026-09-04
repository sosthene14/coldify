// hooks/useEmailForm.ts
import { useState, useEffect } from 'react'
import { useMailboxStore } from '../stores/mailbox.store'
import { useTemplateStore } from '../stores/template.store'
import type { EmailFormData } from '#/components/ComposeEmail/ComposeEmailPage'

export const useEmailForm = () => {
  const { mailboxes, loading: mailboxLoading, fetchMailboxes } = useMailboxStore()
  const { templates, fetchTemplates } = useTemplateStore()

  const [formData, setFormData] = useState<EmailFormData>({
    mailboxId: '',
    to: [],
    cc: [],
    bcc: [],
    subject: '',
    htmlContent: '',
    attachments: [],
    scheduledAt: null,
    templateId: null
  })

  const [uiState, setUiState] = useState({
    mode: 'compose' as 'compose' | 'template',
    showCc: false,
    showBcc: false,
    sending: false,
    editingScheduledId: null as string | null
  })

  useEffect(() => {
    fetchMailboxes()
    fetchTemplates()
  }, [])

  useEffect(() => {
    const connectedMailbox = mailboxes.find((mb) => mb.status === 'connected')
    if (connectedMailbox && !formData.mailboxId) {
      setFormData(prev => ({ ...prev, mailboxId: connectedMailbox.id }))
    }
  }, [mailboxes, formData.mailboxId])

  const updateField = <K extends keyof EmailFormData>(
    field: K,
    value: EmailFormData[K]
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const updateUiState = (updates: Partial<typeof uiState>) => {
    setUiState(prev => ({ ...prev, ...updates }))
  }

  const resetForm = () => {
    setFormData({
      mailboxId: formData.mailboxId,
      to: [],
      cc: [],
      bcc: [],
      subject: '',
      htmlContent: '',
      attachments: [],
      scheduledAt: null,
      templateId: null
    })
    setUiState({
      ...uiState,
      showCc: false,
      showBcc: false
    })
  }

  return {
    formData,
    uiState,
    mailboxes,
    templates,
    mailboxLoading,
    updateField,
    updateUiState,
    resetForm,
    setUiState,
    setFormData
  }
}
