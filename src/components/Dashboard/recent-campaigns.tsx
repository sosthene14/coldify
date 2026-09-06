import { useState, useEffect } from 'react'
import { 
  Card, 
  Text, 
  Table, 
  Anchor, 
  Badge, 
  Modal,
  Button,
  ActionIcon, 
  Group, 
  Loader,
  Stack,
  Tooltip,
  Menu
} from '@mantine/core'
import { useTranslation } from 'react-i18next'
import { 
  IconDots, 
  IconMail, 
  IconEye, 
  IconExternalLink
} from '@tabler/icons-react'
import { useNavigate } from '@tanstack/react-router'
import axios from 'axios'
import { format, formatDistanceToNow } from 'date-fns'
import DOMPurify from 'dompurify'
import { EmailOpenDetailsModal } from '../EmailHistory/EmailOpenDetailsModal'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

interface DateRange {
  startDate: Date
  endDate: Date
}

interface RecentCampaignsProps {
  dateRange?: DateRange
  refreshKey?: number
}

type EmailStatus = 'sent' | 'failed' | 'pending' | 'processing'

interface RecentEmail {
  id: string
  from?: string
  subject: string
  status: EmailStatus
  to: string[]
  cc?: string[]
  bcc?: string[]
  sentAt?: Date
  scheduledAt?: Date
  createdAt?: Date
  totalOpens?: number
  uniqueOpens?: number
  firstOpenedAt?: Date
  gmailMessageId?: string
  hasAttachments?: boolean
  attachmentCount?: number
  attachmentNames?: string[]
  type: 'sent' | 'scheduled'
}

const statusColor: Record<EmailStatus, string> = {
  sent: 'green',
  failed: 'red',
  pending: 'orange',
  processing: 'blue',
}

// Hook pour récupérer les emails récents
function useRecentEmails(dateRange?: DateRange, refreshKey?: number) {
  const [emails, setEmails] = useState<RecentEmail[]>([])
  const [loading, setLoading] = useState(true)

  const fetchRecentEmails = async () => {
    try {
      // Récupérer les emails envoyés et programmés
      const [sentResponse, scheduledResponse] = await Promise.all([
        axios.get(`${API_URL}/email-history`, { 
          withCredentials: true,
          params: { limit: 20, offset: 0 } // Augmenter la limite pour filtrer ensuite
        }),
        axios.get(`${API_URL}/scheduled-emails`, { 
          withCredentials: true 
        })
      ])

      const sentEmails = Array.isArray(sentResponse.data?.data) 
        ? sentResponse.data.data 
        : (Array.isArray(sentResponse.data) ? sentResponse.data : [])

      const scheduledEmails = Array.isArray(scheduledResponse.data) 
        ? scheduledResponse.data 
        : []

      // Filtrer par date range si fourni
      const filterByDateRange = (email: any) => {
        if (!dateRange) return true
        
        const emailDate = email.sentAt 
          ? new Date(email.sentAt)
          : email.scheduledAt 
            ? new Date(email.scheduledAt)
            : email.createdAt 
              ? new Date(email.createdAt)
              : null
              
        if (!emailDate) return false
        
        return emailDate >= dateRange.startDate && emailDate <= dateRange.endDate
      }

      // Mapper les emails envoyés
      const mappedSentEmails: RecentEmail[] = sentEmails
        .filter(filterByDateRange)
        .map((email: any) => ({
          id: email.id,
          from: email.from,
          subject: email.subject,
          status: email.status,
          to: email.to,
          cc: email.cc,
          bcc: email.bcc,
          sentAt: email.sentAt ? new Date(email.sentAt) : undefined,
          createdAt: email.createdAt ? new Date(email.createdAt) : undefined,
          totalOpens: email.totalOpens,
          uniqueOpens: email.uniqueOpens,
          firstOpenedAt: email.firstOpenedAt ? new Date(email.firstOpenedAt) : undefined,
          gmailMessageId: email.gmailMessageId,
          hasAttachments: email.hasAttachments,
          attachmentCount: email.attachmentCount,
          attachmentNames: email.attachments?.map((attachment: any) => attachment.filename),
          type: 'sent'
        }))

      // Mapper les emails programmés (limiter aux plus récents seulement)
      const mappedScheduledEmails: RecentEmail[] = scheduledEmails
        .filter(filterByDateRange)
        .slice(0, 3) // Limiter à 3 emails programmés
        .map((email: any) => ({
          id: email.id,
          subject: email.subject,
          status: email.status,
          to: email.to,
          scheduledAt: email.scheduledAt ? new Date(email.scheduledAt) : undefined,
          createdAt: email.createdAt ? new Date(email.createdAt) : undefined,
          type: 'scheduled'
        }))

      // Combiner et trier par date (plus récent en premier)
      const allEmails = [...mappedSentEmails, ...mappedScheduledEmails]
        .sort((a, b) => {
          const dateA = a.sentAt || a.scheduledAt || a.createdAt || new Date(0)
          const dateB = b.sentAt || b.scheduledAt || b.createdAt || new Date(0)
          return dateB.getTime() - dateA.getTime()
        })
        .slice(0, 8) // Limiter au top 8

      setEmails(allEmails)
    } catch (error) {
      console.error('Failed to fetch recent emails:', error)
      setEmails([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRecentEmails()
  }, [
    dateRange?.startDate ? dateRange.startDate.getTime() : null, 
    dateRange?.endDate ? dateRange.endDate.getTime() : null,
    refreshKey
  ])

  return { emails, loading, refetch: fetchRecentEmails }
}

export function RecentCampaigns({ dateRange, refreshKey }: RecentCampaignsProps) {
  const { t } = useTranslation()
  const { emails, loading } = useRecentEmails(dateRange, refreshKey)
  const navigate = useNavigate()
  const [selectedEmail, setSelectedEmail] = useState<RecentEmail | null>(null)
  const [modalOpened, setModalOpened] = useState(false)
  const [emailContent, setEmailContent] = useState<string | null>(null)
  const [contentLoading, setContentLoading] = useState(false)
  const [contentError, setContentError] = useState<string | null>(null)
  const [trackingModalEmailId, setTrackingModalEmailId] = useState<string | null>(null)

  const handleViewEmail = async (email: RecentEmail) => {
    setSelectedEmail(email)
    setModalOpened(true)
    setEmailContent(null)
    setContentError(null)
    setContentLoading(true)

    try {
      const response = await axios.get(`${API_URL}/email-history/${email.id}/content`, {
        withCredentials: true,
      })
      setEmailContent(response.data.htmlContent)
    } catch {
      setContentError(t('error_sending_email'))
    } finally {
      setContentLoading(false)
    }
  }

  const handleOpenInGmail = (email: RecentEmail) => {
    if (email.gmailMessageId) {
      window.open(`https://mail.google.com/mail/u/0/#all/${email.gmailMessageId}`, '_blank')
    }
  }

  const getLastActivity = (email: RecentEmail): string => {
    const date = email.sentAt || email.scheduledAt || email.createdAt
    if (!date) return '—'
    
    try {
      return formatDistanceToNow(date, { addSuffix: true })
    } catch {
      return format(date, 'MMM d')
    }
  }

  if (loading) {
    return (
      <Card withBorder radius="md" p="lg" bg="white">
        <Text fw={600} size="sm" c="dark.7" mb="md">
          {t('recent_emails')}
        </Text>
        <Group justify="center" py="xl">
          <Loader size="sm" />
          <Text size="sm" c="dimmed">{t('loading_recent_emails')}</Text>
        </Group>
      </Card>
    )
  }

  if (emails.length === 0) {
    return (
      <Card withBorder radius="md" p="lg" bg="white">
        <Text fw={600} size="sm" c="dark.7" mb="md">
          {t('recent_emails')}
        </Text>
        <Group justify="center" py="xl">
          <Stack align="center" gap="xs">
            <IconMail size={32} color="var(--mantine-color-gray-5)" />
            <Text size="sm" c="dimmed">{t('no_recent_emails')}</Text>
            <Text size="xs" c="dimmed">{t('start_sending_emails')}</Text>
          </Stack>
        </Group>
      </Card>
    )
  }

  const headers = [t('subject'), t('status'), t('recipients'), t('opens'), t('last_activity'), '']

  return (
    <Card withBorder radius="md" p={{ base: 'sm', sm: 'md', md: 'xl' }} bg="white">
      <Group justify="space-between" align="center" mb={{ base: 'sm', sm: 'md', md: 'lg' }}>
        <Text fw={600} c="dark.7">
          {t('recent_emails')}
        </Text>
        <Anchor 
          size="xs" 
          c="blue" 
          onClick={() => navigate({ to: '/dashboard/mails' })}
          style={{ cursor: 'pointer' }}
        >
          {t('view_all')}
        </Anchor>
      </Group>

      <Table
        verticalSpacing="sm"
        horizontalSpacing="md"
        highlightOnHover
        highlightOnHoverColor="gray.0"
        style={{ minWidth: '100%' }}
      >
        <Table.Thead visibleFrom="sm">
          <Table.Tr>
            {headers.map((h, idx) => (
              <Table.Th key={idx}>
                {h && (
                  <Text size="xs" fw={600} c="dimmed" tt="uppercase">
                    {h}
                  </Text>
                )}
              </Table.Th>
            ))}
          </Table.Tr>
        </Table.Thead>

        <Table.Tbody>
          {emails.map((email) => (
            <Table.Tr 
              key={email.id}
              style={{ cursor: 'pointer' }}
              onClick={() => handleViewEmail(email)}
            >
              <Table.Td>
                <Stack gap={4} visibleFrom="sm">
                  <Tooltip label={email.subject} multiline maw={300}>
                    <Text 
                      size="sm" 
                      fw={500} 
                      c="blue.6" 
                      style={{ 
                        maxWidth: 200,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {email.subject}
                    </Text>
                  </Tooltip>
                </Stack>
                {/* Mobile view - show all info in one cell - COMPACT */}
                <Stack gap={6} hiddenFrom="sm">
                  <Text size="sm" fw={500} c="blue.6" lineClamp={1}>
                    {email.subject}
                  </Text>
                  <Group gap={6} wrap="wrap">
                    <Badge 
                      color={statusColor[email.status]} 
                      variant="light" 
                      size="xs" 
                      radius="xs" 
                      tt="none" 
                      fw={500}
                    >
                      {email.status === 'sent' ? t('sent') : email.status === 'failed' ? t('failed') : email.status === 'pending' ? t('scheduled') : t('sending')}
                    </Badge>
                    <Text size="sm" c="dimmed">
                      {email.to.length} {email.to.length > 1 ? t('recipients') : t('recipient')}
                    </Text>
                    {email.totalOpens && email.totalOpens > 0 && (
                      <Group gap={2}>
                        <IconEye size={12} color="var(--mantine-color-green-6)" />
                        <Text size="sm" c="dimmed">{email.totalOpens}</Text>
                      </Group>
                    )}
                    <Text size="sm" c="dimmed">
                      • {getLastActivity(email)}
                    </Text>
                  </Group>
                </Stack>
              </Table.Td>
              
              <Table.Td visibleFrom="sm">
                <Badge 
                  color={statusColor[email.status]} 
                  variant="light" 
                  size="sm" 
                  radius="sm" 
                  tt="none" 
                  fw={500}
                >
                  {email.status === 'sent' ? t('sent') : email.status === 'failed' ? t('failed') : email.status === 'pending' ? t('scheduled') : t('sending')}
                </Badge>
              </Table.Td>
              
              <Table.Td visibleFrom="sm">
                <Text size="sm" c="dark.7">
                  {email.to.length}
                </Text>
              </Table.Td>
              
              <Table.Td visibleFrom="sm">
                <Group gap={4}>
                  <Text size="sm" c="dark.7">
                    {email.totalOpens || 0}
                  </Text>
                  {email.totalOpens && email.totalOpens > 0 && (
                    <IconEye size={12} color="var(--mantine-color-green-6)" />
                  )}
                </Group>
              </Table.Td>
              
              <Table.Td visibleFrom="sm">
                <Text size="sm" c="dimmed">
                  {getLastActivity(email)}
                </Text>
              </Table.Td>
              
              <Table.Td onClick={(e) => e.stopPropagation()}>
                <Group justify="flex-end">
                  <Menu position="bottom-end" withinPortal>
                    <Menu.Target>
                      <ActionIcon variant="subtle" color="gray" size="sm">
                        <IconDots size={16} />
                      </ActionIcon>
                    </Menu.Target>
                    <Menu.Dropdown>
                      <Menu.Item
                        leftSection={<IconEye size={14} />}
                        onClick={() => handleViewEmail(email)}
                      >
                        {t('view_details')}
                      </Menu.Item>
                      {email.gmailMessageId && (
                        <Menu.Item
                          leftSection={<IconExternalLink size={14} />}
                          onClick={() => handleOpenInGmail(email)}
                        >
                          {t('open_in_gmail')}
                        </Menu.Item>
                      )}
                    </Menu.Dropdown>
                  </Menu>
                </Group>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>

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
              <Text size="sm">{selectedEmail.from || '—'}</Text>
            </div>

            <div>
              <Text size="xs" c="dimmed">{t('to')}</Text>
              <Text size="sm">{selectedEmail.to.join(', ')}</Text>
            </div>

            {selectedEmail.cc?.length ? (
              <div>
                <Text size="xs" c="dimmed">{t('cc')}</Text>
                <Text size="sm">{selectedEmail.cc.join(', ')}</Text>
              </div>
            ) : null}

            {selectedEmail.bcc?.length ? (
              <div>
                <Text size="xs" c="dimmed">{t('bcc')}</Text>
                <Text size="sm">{selectedEmail.bcc.join(', ')}</Text>
              </div>
            ) : null}

            <div>
              <Text size="xs" c="dimmed">{t('subject')}</Text>
              <Text size="sm" fw={600}>{selectedEmail.subject}</Text>
            </div>

            <div>
              <Text size="xs" c="dimmed">{t('sent')}</Text>
              <Text size="sm">
                {selectedEmail.sentAt
                  ? format(selectedEmail.sentAt, 'PPpp')
                  : selectedEmail.scheduledAt
                    ? format(selectedEmail.scheduledAt, 'PPpp')
                    : '—'}
              </Text>
            </div>

            {selectedEmail.type === 'sent' && (selectedEmail.totalOpens || 0) > 0 && (
              <Card withBorder p="md" bg="blue.0">
                <Stack gap="xs">
                  <Group justify="space-between">
                    <Text size="sm" fw={600} c="blue">{t('email_tracking')}</Text>
                    <Button
                      size="xs"
                      variant="light"
                      onClick={() => setTrackingModalEmailId(selectedEmail.id)}
                    >
                      {t('view_details')}
                    </Button>
                  </Group>

                  <Group gap="lg">
                    <div>
                      <Text size="xl" fw={700} c="blue">{selectedEmail.totalOpens}</Text>
                      <Text size="xs" c="dimmed">{t('total_opens')}</Text>
                    </div>
                    <div>
                      <Text size="xl" fw={700} c="blue">{selectedEmail.uniqueOpens || 0}</Text>
                      <Text size="xs" c="dimmed">{t('unique_opens')}</Text>
                    </div>
                  </Group>

                  {selectedEmail.firstOpenedAt && (
                    <Text size="xs" c="dimmed">
                      {t('first_opened_date', { date: format(selectedEmail.firstOpenedAt, 'PPpp') })}
                    </Text>
                  )}
                </Stack>
              </Card>
            )}

            {selectedEmail.hasAttachments && (
              <div>
                <Text size="xs" c="dimmed">
                  {t('attachments_count', { count: selectedEmail.attachmentCount || 0 })}
                </Text>
                <Group gap="xs" mt={4}>
                  {selectedEmail.attachmentNames?.map((name) => (
                    <Badge key={name} size="sm" variant="light">{name}</Badge>
                  ))}
                </Group>
              </div>
            )}

            <div>
              <Text size="xs" c="dimmed" mb="xs">{t('content')}</Text>
              <Card withBorder p="md">
                {contentLoading ? (
                  <Group justify="center" py="md"><Loader size="sm" /></Group>
                ) : contentError ? (
                  <Text size="sm" c="red">{contentError}</Text>
                ) : (
                  <div
                    dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(emailContent || '') }}
                    style={{ maxHeight: 300, overflow: 'auto' }}
                  />
                )}
              </Card>
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

      {trackingModalEmailId && (
        <EmailOpenDetailsModal
          emailHistoryId={trackingModalEmailId}
          isOpen={!!trackingModalEmailId}
          onClose={() => setTrackingModalEmailId(null)}
        />
      )}
    </Card>
  )
}