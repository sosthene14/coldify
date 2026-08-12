import type { Attachment } from "#/components/ComposeEmail/ComposeEmailPage"
import { EMAIL_CONSTANTS } from "#/configs/emailFilters.config"


export const useEmailValidation = () => {
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
    if (!formData.mailboxId) return 'Please select a mailbox'
    if (formData.to.length === 0) return 'Please enter at least one recipient'

    for (const email of formData.to) {
      if (!validateEmail(email)) return `Invalid email address: ${email}`
    }

    for (const email of formData.cc) {
      if (!validateEmail(email)) return `Invalid CC email address: ${email}`
    }

    for (const email of formData.bcc) {
      if (!validateEmail(email)) return `Invalid BCC email address: ${email}`
    }

    if (!formData.subject.trim()) return 'Please enter a subject'
    if (!formData.htmlContent.trim()) return 'Please enter email content'

    if (formData.scheduledAt) {
      const scheduledDate = formData.scheduledAt instanceof Date 
        ? formData.scheduledAt 
        : new Date(formData.scheduledAt)
      if (scheduledDate <= new Date()) {
        return 'Scheduled time must be in the future'
      }
    }

    return null
  }

  const validateAttachments = (attachments: Attachment[]) => {
    const errors: string[] = []
    let totalSize = 0

    for (const attachment of attachments) {
      if (attachment.size > EMAIL_CONSTANTS.MAX_ATTACHMENT_SIZE) {
        errors.push(`${attachment.name}: File size exceeds 25MB limit`)
      }

      const ext = attachment.name.toLowerCase().match(/\.[^.]+$/)?.[0] as typeof DANGEROUS_EXTENSIONS
      if (ext && EMAIL_CONSTANTS.DANGEROUS_EXTENSIONS.includes(ext)) {
        errors.push(`${attachment.name}: File type ${ext} is not allowed`)
      }

      totalSize += attachment.size
    }

    if (totalSize > EMAIL_CONSTANTS.MAX_ATTACHMENT_SIZE) {
      errors.push('Total attachments would exceed 25MB limit')
    }

    return errors
  }

  return { validateEmail, validateForm, validateAttachments }
}