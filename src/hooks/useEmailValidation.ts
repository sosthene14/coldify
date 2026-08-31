import type { Attachment } from "#/components/ComposeEmail/ComposeEmailPage"
import { EMAIL_CONSTANTS } from "#/configs/emailFilters.config"
import { useTranslation } from 'react-i18next'


export const useEmailValidation = () => {
  const { t } = useTranslation()

  const validateEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const validateForm = (formData: {
    mailboxId: string
    to: string[]
    cc: string[]
    bcc: string[]
    subject: string
    htmlContent: string
    scheduledAt?: Date | null
  }): string | null => {
    if (!formData.mailboxId) return t('select_mailbox_required')
    if (formData.to.length === 0) return t('enter_recipient_required')

    for (const email of formData.to) {
      if (!validateEmail(email)) return t('invalid_email_address', { email })
    }

    for (const email of formData.cc) {
      if (!validateEmail(email)) return t('invalid_cc_email', { email })
    }

    for (const email of formData.bcc) {
      if (!validateEmail(email)) return t('invalid_bcc_email', { email })
    }

    if (!formData.subject.trim()) return t('enter_subject_required')
    if (!formData.htmlContent.trim()) return t('enter_email_content_required')

    if (formData.scheduledAt) {
      const scheduledDate = formData.scheduledAt instanceof Date 
        ? formData.scheduledAt 
        : new Date(formData.scheduledAt)
      if (scheduledDate <= new Date()) {
        return t('scheduled_time_future')
      }
    }

    return null
  }

  const validateAttachments = (attachments: Attachment[]) => {
    const errors: string[] = []
    let totalSize = 0

    for (const attachment of attachments) {
      if (attachment.size > EMAIL_CONSTANTS.MAX_ATTACHMENT_SIZE) {
        errors.push(t('file_size_exceeds', { name: attachment.name }))
      }

      const ext = attachment.name.toLowerCase().match(/\.[^.]+$/)?.[0]
      if (ext && EMAIL_CONSTANTS.DANGEROUS_EXTENSIONS.includes(ext as any)) {
        errors.push(t('file_type_not_allowed', { name: attachment.name, ext }))
      }

      totalSize += attachment.size
    }

    if (totalSize > EMAIL_CONSTANTS.MAX_ATTACHMENT_SIZE) {
      errors.push(t('total_attachments_exceeds'))
    }

    return errors
  }

  return { validateEmail, validateForm, validateAttachments }
}