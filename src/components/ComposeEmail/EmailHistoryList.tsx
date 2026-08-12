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

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

interface EmailHistoryItem {
  id: string
  from: string
  to: string[]
  cc?: string[]
  bcc?: string[]
  subject: string
  htmlContent: string
  hasAttachments: boolean
  attachmentCount: number
  attachmentNames?: string[]
  gmailMessageId?: string
  status: string
  sentAt: Date
}

export function EmailHistoryList() {
  const [emails, setEmails] = useState<EmailHistoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedEmail, setSelectedEmail] = useState<EmailHistoryItem | null>(null)
  const [modalOpened, setModalOpened] = useState(false)

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

  const handleViewDetails = (email: EmailHistoryItem) => {
    setSelectedEmail(email)
    setModalOpened(true)
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
            No emails sent yet
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
                      <Tooltip label={`${email.attachmentCount} attachment(s)`}>
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
                      To: {email.to.join(', ')}
                    </Text>
                    {email.cc && email.cc.length > 0 && (
                      <Text size="xs" c="dimmed">
                        • Cc: {email.cc.join(', ')}
                      </Text>
                    )}
                  </Group>
                  <Text size="xs" c="dimmed">
                    {format(new Date(email.sentAt), 'PPpp')}
                  </Text>
                </div>
                <Group gap="xs">
                  <Tooltip label="View details">
                    <ActionIcon
                      variant="subtle"
                      onClick={() => handleViewDetails(email)}
                    >
                      <IconEye size={16} />
                    </ActionIcon>
                  </Tooltip>
                  {email.gmailMessageId && (
                    <Tooltip label="Open in Gmail">
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
                    Attachments:
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
        title="Email Details"
        size="lg"
      >
        {selectedEmail && (
          <Stack gap="md">
            <div>
              <Text size="xs" c="dimmed">
                From
              </Text>
              <Text size="sm">{selectedEmail.from}</Text>
            </div>

            <div>
              <Text size="xs" c="dimmed">
                To
              </Text>
              <Text size="sm">{selectedEmail.to.join(', ')}</Text>
            </div>

            {selectedEmail.cc && selectedEmail.cc.length > 0 && (
              <div>
                <Text size="xs" c="dimmed">
                  Cc
                </Text>
                <Text size="sm">{selectedEmail.cc.join(', ')}</Text>
              </div>
            )}

            {selectedEmail.bcc && selectedEmail.bcc.length > 0 && (
              <div>
                <Text size="xs" c="dimmed">
                  Bcc
                </Text>
                <Text size="sm">{selectedEmail.bcc.join(', ')}</Text>
              </div>
            )}

            <div>
              <Text size="xs" c="dimmed">
                Subject
              </Text>
              <Text size="sm" fw={600}>
                {selectedEmail.subject}
              </Text>
            </div>

            <div>
              <Text size="xs" c="dimmed">
                Sent
              </Text>
              <Text size="sm">
                {format(new Date(selectedEmail.sentAt), 'PPpp')}
              </Text>
            </div>

            {selectedEmail.hasAttachments && (
              <div>
                <Text size="xs" c="dimmed">
                  Attachments ({selectedEmail.attachmentCount})
                </Text>
                <Group gap="xs" mt={4}>
                  {selectedEmail.attachmentNames?.map((name, idx) => (
                    <Badge key={idx} size="sm" variant="light">
                      {name}
                    </Badge>
                  ))}
                </Group>
                <Text size="xs" c="dimmed" mt={4}>
                  Files are not stored on our servers for security reasons
                </Text>
              </div>
            )}

            <div>
              <Text size="xs" c="dimmed" mb="xs">
                Content
              </Text>
              <Card withBorder p="md">
                <div
                  dangerouslySetInnerHTML={{ __html: selectedEmail.htmlContent }}
                  style={{ maxHeight: 300, overflow: 'auto' }}
                />
              </Card>
            </div>

            {selectedEmail.gmailMessageId && (
              <Button
                leftSection={<IconExternalLink size={16} />}
                onClick={() => handleOpenInGmail(selectedEmail)}
                fullWidth
              >
                Open in Gmail
              </Button>
            )}
          </Stack>
        )}
      </Modal>
    </>
  )
}
