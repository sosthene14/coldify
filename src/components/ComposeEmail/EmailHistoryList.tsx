import { useEffect, useState } from 'react'
import {
  Stack,
  Card,
  Text,
  Group,
  Badge,
  ScrollArea,
  Loader,
  Button,
  ActionIcon,
  Tooltip,
  Modal,
} from '@mantine/core'
import {
  IconPaperclip,
  IconExternalLink,
  IconEye,
  IconClock,
} from '@tabler/icons-react'
import axios from 'axios'
import { format } from 'date-fns'
import DOMPurify from 'dompurify'
import { useTranslation } from 'react-i18next'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

interface EmailHistoryItem {
  id: string
  from: string
  to: string[]
  cc?: string[]
  bcc?: string[]
  subject: string
  snippet: string
  hasAttachments: boolean
  attachmentCount: number
  attachmentNames?: string[]
  gmailMessageId?: string
  status: string
  sentAt: Date
}

export function EmailHistoryList() {
  const { t } = useTranslation()
  const [emails, setEmails] = useState<EmailHistoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedEmail, setSelectedEmail] = useState<EmailHistoryItem | null>(null)
  const [modalOpened, setModalOpened] = useState(false)

  const [emailContent, setEmailContent] = useState<string | null>(null)
  const [loadingContent, setLoadingContent] = useState(false)
  const [contentError, setContentError] = useState<string | null>(null)

  useEffect(() => {
    fetchEmails()
  }, [])

  const fetchEmails = async () => {
    try {
      const response = await axios.get(`${API_URL}/email-history`, {
        withCredentials: true,
      })
      setEmails(response.data)
    } catch (error) {
      console.error('Failed to fetch email history:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleViewDetails = async (email: EmailHistoryItem) => {
    setSelectedEmail(email)
    setModalOpened(true)
    setEmailContent(null)
    setContentError(null)
    setLoadingContent(true)

    try {
      const response = await axios.get(
        `${API_URL}/email-history/${email.id}/content`,
        { withCredentials: true }
      )
      setEmailContent(response.data.htmlContent)
    } catch (error) {
      console.error('Failed to fetch email content:', error)
      setContentError(t('error_sending_email'))
    } finally {
      setLoadingContent(false)
    }
  }

  const handleOpenInGmail = (email: EmailHistoryItem) => {
    if (email.gmailMessageId) {
      window.open(
        `https://mail.google.com/mail/u/0/#all/${email.gmailMessageId}`,
        '_blank'
      )
    }
  }

  if (loading) {
    return (
      <Group justify="center" py="xl">
        <Loader size="sm" />
      </Group>
    )
  }

  if (emails.length === 0) {
    return (
      <Card withBorder p="xl">
        <Stack align="center" gap="sm">
          <IconClock size={48} color="#868E96" />
          <Text size="sm" c="dimmed" ta="center">
            {t('no_emails_sent')}
          </Text>
        </Stack>
      </Card>
    )
  }

  return (
    <>
      <ScrollArea h={500}>
        <Stack gap="sm">
          {emails.map((email) => (
            <Card key={email.id} withBorder p="md" radius="md">
              <Group justify="space-between" mb="xs">
                <div style={{ flex: 1 }}>
                  <Group gap="xs" mb={4}>
                    <Text size="sm" fw={600} lineClamp={1}>
                      {email.subject}
                    </Text>
                    {email.hasAttachments && (
                      <Tooltip label={t('attachments_count', { count: email.attachmentCount })}>
                        <Badge
                          size="sm"
                          variant="light"
                          leftSection={<IconPaperclip size={12} />}
                        >
                          {email.attachmentCount}
                        </Badge>
                      </Tooltip>
                    )}
                  </Group>
                  <Group gap="xs">
                    <Text size="xs" c="dimmed">
                      {t('to')}: {email.to.join(', ')}
                    </Text>
                    {email.cc && email.cc.length > 0 && (
                      <Text size="xs" c="dimmed">
                        • {t('cc')}: {email.cc.join(', ')}
                      </Text>
                    )}
                  </Group>
                  <Text
                    size="xs"
                    c="dimmed"
                    lineClamp={1}
                    style={{ maxWidth: '400px', fontWeight: 300 }}
                  >
                    {email.snippet}
                  </Text>
                  <Text size="xs" c="dimmed">
                    {format(new Date(email.sentAt), 'PPpp')}
                  </Text>
                </div>
                <Group gap="xs">
                  <Tooltip label={t('view_details')}>
                    <ActionIcon
                      variant="subtle"
                      onClick={() => handleViewDetails(email)}
                    >
                      <IconEye size={16} />
                    </ActionIcon>
                  </Tooltip>
                  {email.gmailMessageId && (
                    <Tooltip label={t('open_in_gmail')}>
                      <ActionIcon
                        variant="subtle"
                        onClick={() => handleOpenInGmail(email)}
                      >
                        <IconExternalLink size={16} />
                      </ActionIcon>
                    </Tooltip>
                  )}
                </Group>
              </Group>

              {email.attachmentNames && email.attachmentNames.length > 0 && (
                <Group gap="xs" mt="xs">
                  <Text size="xs" c="dimmed">
                    {t('attachments')}:
                  </Text>
                  {email.attachmentNames.map((name, idx) => (
                    <Badge key={idx} size="xs" variant="dot">
                      {name}
                    </Badge>
                  ))}
                </Group>
              )}
            </Card>
          ))}
        </Stack>
      </ScrollArea>

      <Modal
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        title={t('email_details')}
        size="xl"
      >
        {selectedEmail && (
          <Stack gap="md">
            <div>
              <Text size="xs" c="dimmed">{t('from')}</Text>
              <Text size="sm">{selectedEmail.from}</Text>
            </div>

            <div>
              <Text size="xs" c="dimmed">{t('to')}</Text>
              <Text size="sm">{selectedEmail.to.join(', ')}</Text>
            </div>

            {selectedEmail.cc && selectedEmail.cc.length > 0 && (
              <div>
                <Text size="xs" c="dimmed">{t('cc')}</Text>
                <Text size="sm">{selectedEmail.cc.join(', ')}</Text>
              </div>
            )}

            {selectedEmail.bcc && selectedEmail.bcc.length > 0 && (
              <div>
                <Text size="xs" c="dimmed">{t('bcc')}</Text>
                <Text size="sm">{selectedEmail.bcc.join(', ')}</Text>
              </div>
            )}

            <div>
              <Text size="xs" c="dimmed">{t('subject')}</Text>
              <Text size="sm" fw={600}>{selectedEmail.subject}</Text>
            </div>

            <div>
              <Text size="xs" c="dimmed">{t('sent')}</Text>
              <Text size="sm">
                {format(new Date(selectedEmail.sentAt), 'PPpp')}
              </Text>
            </div>

            {selectedEmail.hasAttachments && (
              <div>
                <Text size="xs" c="dimmed">
                  {t('attachments_count', { count: selectedEmail.attachmentCount })}
                </Text>
                <Group gap="xs" mt={4}>
                  {selectedEmail.attachmentNames?.map((name, idx) => (
                    <Badge key={idx} size="sm" variant="light">
                      {name}
                    </Badge>
                  ))}
                </Group>
                <Text size="xs" c="dimmed" mt={4}>
                  {t('files_not_stored')}
                </Text>
              </div>
            )}

            <div>
              <Text size="xs" c="dimmed" mb="xs">{t('content')}</Text>
              <Card withBorder p="md">
                {loadingContent ? (
                  <Group justify="center" py="md">
                    <Loader size="sm" />
                  </Group>
                ) : contentError ? (
                  <Text size="sm" c="dimmed">{contentError}</Text>
                ) : (
                  <div
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(emailContent || ''),
                    }}
                    style={{ maxHeight: 300, overflow: 'auto' }}
                  />
                )}
              </Card>
              <Text size="xs" c="dimmed" mt={4}>
                {t('content_fetched_on_demand')}
              </Text>
            </div>

            {selectedEmail.gmailMessageId && (
              <Button
                leftSection={<IconExternalLink size={16} />}
                onClick={() => handleOpenInGmail(selectedEmail)}
                fullWidth
              >
                {t('open_in_gmail')}
              </Button>
            )}
          </Stack>
        )}
      </Modal>
    </>
  )
}