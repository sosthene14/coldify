// hooks/useAttachmentManager.ts
import { useState } from 'react'
import { notifications } from '@mantine/notifications'
import { useTranslation } from 'react-i18next'
import { emailService } from '../services/email.service'
import { useEmailValidation } from './useEmailValidation'
import type { Attachment } from '#/components/ComposeEmail/ComposeEmailPage.tsx';
import { IconCheck } from '@tabler/icons-react';

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
      notifications.show({
        title: t('some_files_not_added'),
        message: validationErrors.join('\n'),
        color: 'red',
      })
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
      notifications.show({
        id: `upload-${attachment.name}`,
        title: t('uploading'),
        message: t('uploading_file', { name: attachment.name }),
        loading: true,
        autoClose: false,
      })

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

        notifications.update({
          id: `upload-${attachment.name}`,
          title: t('success'),
          message: t('file_uploaded', { name: attachment.name }),
          color: 'green',
          icon: <IconCheck size={16} />,
          autoClose: 2000,
          loading: false,
        })
      } catch (error: any) {
        notifications.update({
          id: `upload-${attachment.name}`,
          title: t('upload_failed'),
          message: t('failed_upload_file', { name: attachment.name, error: error.message }),
          color: 'red',
          autoClose: 5000,
          loading: false,
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