// hooks/useAttachmentManager.ts
import { useState } from 'react'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { emailService } from '../services/email.service'
import { useEmailValidation } from './useEmailValidation'
import type { Attachment } from '#/components/ComposeEmail/ComposeEmailPage.tsx';

export const useAttachmentManager = () => {
  const { t } = useTranslation()
  const [attachments, setAttachments] = useState<Attachment[]>([])
  const { validateAttachments } = useEmailValidation()

  const addAttachments = (files: File[]) => {
    const newAttachments: Attachment[] = []

    for (const file of files) {
      const attachment: Attachment = {
        file,
        size: file.size,
        name: file.name
      }
      newAttachments.push(attachment)
    }

    const validationErrors = validateAttachments([...attachments, ...newAttachments])
    
    if (validationErrors.length > 0) {
      toast.error(validationErrors.join('\n'))
      return
    }

    setAttachments([...attachments, ...newAttachments])
  }

  const removeAttachment = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index))
  }

  const uploadAttachments = async (): Promise<Array<{
    filename: string
    mimeType: string
    objectKey: string
    size: number
  }>> => {
    const uploadedAttachments = []

    for (const attachment of attachments) {
      const toastId = toast.loading(t('uploading_file', { name: attachment.name }))

      try {
        const base64Content = await emailService.fileToBase64(attachment.file)
        const result = await emailService.uploadAttachment({
          filename: attachment.name,
          mimeType: attachment.file.type || 'application/octet-stream',
          content: base64Content,
        })

        uploadedAttachments.push({
          filename: attachment.name,
          mimeType: attachment.file.type || 'application/octet-stream',
          objectKey: result.objectKey,
          size: attachment.size,
        })

        toast.success(t('file_uploaded', { name: attachment.name }), {
          id: toastId,
        })
      } catch (error: any) {
        toast.error(t('failed_upload_file', { name: attachment.name, error: error.message }), {
          id: toastId,
        })
        throw new Error(t('failed_upload_file_throw', { name: attachment.name }))
      }
    }

    return uploadedAttachments
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  return {
    attachments,
    addAttachments,
    removeAttachment,
    uploadAttachments,
    formatFileSize
  }
}