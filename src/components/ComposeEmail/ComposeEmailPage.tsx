import { useAttachmentManager } from "#/hooks/useAttachmentManager.tsx"
import { useEmailForm } from "#/hooks/useEmailForm"
import { useEmailValidation } from "#/hooks/useEmailValidation"
import { useScheduledEmailLoader } from "#/hooks/useScheduledEmailLoader"
import { EmailSenderService } from "#/services/email.service"
import { Alert, Anchor, Paper, Stack, TextInput } from "@mantine/core"
import { IconAlertCircle } from "@tabler/icons-react";
import { useNavigate } from "@tanstack/react-router"
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import toast from 'react-hot-toast'
import { EmailActions } from "./EmailActions";
import { ScheduleSection } from "./ScheduleSection";
import { AttachmentsSection } from "./AttachmentsSection";
import { EmailContentTabs } from "./EmailContentTabs";
import { RecipientsSection } from "./RecipientsSection";
import { MailboxSelector } from "./MailboxSelector";
import { EmailHeader } from "./EmailHeader";
import { useTemplateStore } from "#/stores/template.store.ts";

// types/email.types.ts
export interface Attachment {
  file: File
  size: number
  name: string
}

export interface UploadedAttachment {
  filename: string
  mimeType: string
  objectKey: string
  size: number
}

export interface EmailFormData {
  mailboxId: string
  to: string[]
  cc?: string[]
  bcc?: string[]
  subject: string
  htmlContent: string
  templateId?: string | null
  scheduledAt?: Date | null
  attachments: Attachment[]
}

export interface EmailParams {
  mailboxId: string
  to: string[]
  cc?: string[]
  bcc?: string[]
  subject: string
  html: string
  templateId?: string
  attachments?: UploadedAttachment[]
  scheduledAt?: string
}



export function ComposeEmailPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { 
    formData, 
    uiState, 
    mailboxes, 
    mailboxLoading,
    updateField, 
    updateUiState,
    resetForm,
    setFormData
  } = useEmailForm()
  
  const { validateForm } = useEmailValidation()
  const {templates} = useTemplateStore()
  const [isScheduling, setIsScheduling] = useState(Boolean(formData.scheduledAt))

  useEffect(() => {
    if (uiState.editingScheduledId && formData.scheduledAt) {
      setIsScheduling(true)
    }
  }, [uiState.editingScheduledId, formData.scheduledAt])
  const {
    attachments,
    addAttachments,
    removeAttachment,
    uploadAttachments,
    formatFileSize
  } = useAttachmentManager()

  useScheduledEmailLoader(uiState.editingScheduledId, (data) => {
    setFormData(prev => ({ ...prev, ...data }))
  })

  const handleSend = async () => {
    if (isScheduling && !formData.scheduledAt) {
      toast.error(t('select_schedule_time'))
      return
    }

    const validationPayload = {
      mailboxId: formData.mailboxId,
      to: formData.to,
      cc: formData.cc ?? [],
      bcc: formData.bcc ?? [],
      subject: formData.subject,
      htmlContent: formData.htmlContent,
      scheduledAt: formData.scheduledAt,
    }

    const error = validateForm(validationPayload)
    if (error) {
      toast.error(error)
      return
    }

    updateUiState({ sending: true })

    try {
      const uploadedAttachments = await uploadAttachments()

      const emailParams = {
        mailboxId: formData.mailboxId!,
        to: formData.to.filter(email => email.length > 0),
        cc: formData?.cc && formData.cc.length > 0 ? formData.cc.filter(email => email.length > 0) : undefined,
        bcc: formData.bcc && formData.bcc.length > 0 ? formData.bcc.filter(email => email.length > 0) : undefined,
        subject: formData.subject,
        html: formData.htmlContent,
        templateId: formData.templateId || undefined,
        attachments: uploadedAttachments.length > 0 ? uploadedAttachments : undefined,
      }

      if (formData.scheduledAt) {
        const scheduledDate = formData.scheduledAt instanceof Date 
          ? formData.scheduledAt 
          : new Date(formData.scheduledAt)

        if (uiState.editingScheduledId) {
          await EmailSenderService.updateScheduledEmail(
            uiState.editingScheduledId,
            emailParams,
            scheduledDate
          )
        } else {
          await EmailSenderService.scheduleEmail(emailParams, scheduledDate)
        }
        
        toast.success(t('email_scheduled_success'))
      } else {
        await EmailSenderService.sendEmail(emailParams)
        
        toast.success(t('email_sent_success'))
      }

      resetForm()
      navigate({ to: '/dashboard/mails' })
    } catch (error: any) {
      toast.error(error.message || t('failed_send_test'))
    } finally {
      updateUiState({ sending: false })
    }
  }

  const handleTemplateSelect = (templateHtml: string, templateSubject: string, templateId: string) => {
    updateField('htmlContent', templateHtml)
    updateField('templateId', templateId)
    if (templateSubject && !formData.subject) {
      updateField('subject', templateSubject)
    }
    updateUiState({ mode: 'compose' })
  }

  const connectedMailboxes = mailboxes.filter((mb) => mb.status === 'connected')

  return (
    <div className="mx-4 md:mx-10 py-4" data-onboarding="compose-page">
      <Stack gap="md">
        <EmailHeader editingId={uiState.editingScheduledId} />

        {!mailboxLoading && connectedMailboxes.length === 0 && (
          <Alert className="compose-mailbox-alert" icon={<IconAlertCircle size={16} />} color="yellow">
            <span className="compose-mailbox-alert-message">
              {t('no_connected_mailboxes')}{' '}
              <Anchor
                component="button"
                onClick={() => navigate({
                  to: '/dashboard/settings',
                  search: { section: 'mailboxes' },
                })}
                fw={600}
                c="yellow.9"
              >
                {t('connect_mailbox_settings')}
              </Anchor>{' '}
              
            </span>
          </Alert>
        )}

        <Paper withBorder p="lg" radius="md">
          <Stack gap="md">
            <MailboxSelector
              selectedMailbox={formData.mailboxId}
              onChange={(value) => updateField('mailboxId', value as string)}
              mailboxes={connectedMailboxes}
            />

            <RecipientsSection
              to={formData.to}
              cc={formData.cc as string[]}
              bcc={formData.bcc as string[]}
              showCc={uiState.showCc}
              showBcc={uiState.showBcc}
              onToChange={(value) => updateField('to', value)}
              onCcChange={(value) => updateField('cc', value)}
              onBccChange={(value) => updateField('bcc', value)}
              onToggleCc={() => updateUiState({ showCc: !uiState.showCc })}
              onToggleBcc={() => updateUiState({ showBcc: !uiState.showBcc })}
            />

            <TextInput
              label={t('subject')}
              placeholder={t('email_subject_placeholder')}
              value={formData.subject}
              onChange={(e) => updateField('subject', e.target.value)}
              required
            />

            <EmailContentTabs
              mode={uiState.mode}
              htmlContent={formData.htmlContent}
              templates={templates}
              onModeChange={(mode) => updateUiState({ mode })}
              onContentChange={(value) => updateField('htmlContent', value)}
              onTemplateSelect={handleTemplateSelect}
            />

            <AttachmentsSection
              attachments={attachments}
              onAddAttachments={addAttachments}
              onRemoveAttachment={removeAttachment}
              formatFileSize={formatFileSize}
            />

            <ScheduleSection
              scheduledAt={formData.scheduledAt as Date}
              visible={isScheduling}
              onChange={(value) => updateField('scheduledAt', value)}
            />

            <EmailActions
              sending={uiState.sending}
              disabled={connectedMailboxes.length === 0}
              isScheduling={isScheduling}
              onSend={handleSend}
              onModeChange={(nextIsScheduling) => {
                setIsScheduling(nextIsScheduling)
                if (!nextIsScheduling) updateField('scheduledAt', null)
              }}
              onClear={resetForm}
            />
          </Stack>
        </Paper>
      </Stack>
    </div>
  )
}