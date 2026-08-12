import { useAttachmentManager } from "#/hooks/useAttachmentManager.tsx"
import { useEmailForm } from "#/hooks/useEmailForm"
import { useEmailValidation } from "#/hooks/useEmailValidation"
import { useScheduledEmailLoader } from "#/hooks/useScheduledEmailLoader"
import { EmailSenderService } from "#/services/email.service"
import { Alert, Anchor, Container, Paper, Stack, TextInput } from "@mantine/core"
import { notifications } from "@mantine/notifications"
import { IconAlertCircle } from "@tabler/icons-react";
import { useNavigate } from "@tanstack/react-router"
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
  const navigate = useNavigate()
  const { 
    formData, 
    uiState, 
    mailboxes, 
    updateField, 
    updateUiState,
    resetForm,
    setFormData
  } = useEmailForm()
  
  const { validateForm } = useEmailValidation()
  const {templates} = useTemplateStore()
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
      notifications.show({
        title: 'Validation Error',
        message: error,
        color: 'red',
      })
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
      } else {
        await EmailSenderService.sendEmail(emailParams)
      }

      resetForm()
      navigate({ to: '/dashboard/mails' })
    } catch (error: any) {
      notifications.show({
        title: 'Error',
        message: error.message || 'Failed to send email',
        color: 'red',
      })
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
    <Container size="lg" py="md">
      <Stack gap="md">
        <EmailHeader editingId={uiState.editingScheduledId} />

        {connectedMailboxes.length === 0 && (
          <Alert icon={<IconAlertCircle size={16} />} color="yellow">
            No connected mailboxes. Please{' '}
            <Anchor 
              component="button"
              onClick={() => navigate({ to: '/dashboard/settings' })}
              fw={600}
              c="yellow.9"
            >
              connect a mailbox in Settings
            </Anchor>{' '}
            first.
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
              label="Subject"
              placeholder="Email subject"
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
              onChange={(value) => updateField('scheduledAt', value)}
            />

            <EmailActions
              sending={uiState.sending}
              disabled={connectedMailboxes.length === 0}
              scheduledAt={formData.scheduledAt as Date}
              onSend={handleSend}
              onClear={resetForm}
            />
          </Stack>
        </Paper>
      </Stack>
    </Container>
  )
}