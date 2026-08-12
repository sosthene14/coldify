import { useState, useEffect } from 'react'
import { 
  Card, 
  Text, 
  Table, 
  Anchor, 
  Badge, 
  ActionIcon, 
  Group, 
  Loader,
  Stack,
  Tooltip,
  Menu
} from '@mantine/core'
import { 
  IconDots, 
  IconMail, 
  IconEye, 
  IconExternalLink
} from '@tabler/icons-react'
import { useNavigate } from '@tanstack/react-router'
import axios from 'axios'
import { format, formatDistanceToNow } from 'date-fns'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

interface DateRange {
  startDate: Date
  endDate: Date
}

interface RecentCampaignsProps {
  dateRange?: DateRange
}

type EmailStatus = 'sent' | 'failed' | 'pending' | 'processing'

interface RecentEmail {
  id: string
  subject: string
  status: EmailStatus
  to: string[]
  sentAt?: Date
  scheduledAt?: Date
  createdAt?: Date
  totalOpens?: number
  uniqueOpens?: number
  firstOpenedAt?: Date
  gmailMessageId?: string
  type: 'sent' | 'scheduled'
}

const statusColor: Record<EmailStatus, string> = {
  sent: 'green',
  failed: 'red',
  pending: 'orange',
  processing: 'blue',
}

const statusLabel: Record<EmailStatus, string> = {
  sent: 'Sent',
  failed: 'Failed',
  pending: 'Scheduled',
  processing: 'Sending',
}

// Hook pour récupérer les emails récents
function useRecentEmails(dateRange?: DateRange) {
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
          subject: email.subject,
          status: email.status,
          to: email.to,
          sentAt: email.sentAt ? new Date(email.sentAt) : undefined,
          createdAt: email.createdAt ? new Date(email.createdAt) : undefined,
          totalOpens: email.totalOpens,
          uniqueOpens: email.uniqueOpens,
          firstOpenedAt: email.firstOpenedAt ? new Date(email.firstOpenedAt) : undefined,
          gmailMessageId: email.gmailMessageId,
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
    dateRange?.endDate ? dateRange.endDate.getTime() : null
  ])

  return { emails, loading, refetch: fetchRecentEmails }
}

export function RecentCampaigns({ dateRange }: RecentCampaignsProps) {
  const { emails, loading } = useRecentEmails(dateRange)
  const navigate = useNavigate()

  const handleViewEmail = (email: RecentEmail) => {
    navigate({ to: '/dashboard/mails' })
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
          Recent emails
        </Text>
        <Group justify="center" py="xl">
          <Loader size="sm" />
          <Text size="sm" c="dimmed">Loading recent emails...</Text>
        </Group>
      </Card>
    )
  }

  if (emails.length === 0) {
    return (
      <Card withBorder radius="md" p="lg" bg="white">
        <Text fw={600} size="sm" c="dark.7" mb="md">
          Recent emails
        </Text>
        <Group justify="center" py="xl">
          <Stack align="center" gap="xs">
            <IconMail size={32} color="var(--mantine-color-gray-5)" />
            <Text size="sm" c="dimmed">No recent emails</Text>
            <Text size="xs" c="dimmed">Start sending emails to see your activity</Text>
          </Stack>
        </Group>
      </Card>
    )
  }

  const headers = ['Subject', 'Status', 'Recipients', 'Opens', 'Activity', '']

  return (
    <Card withBorder radius="md" p={{ base: 'sm', sm: 'md', md: 'xl' }} bg="white">
      <Group justify="space-between" align="center" mb={{ base: 'sm', sm: 'md', md: 'lg' }}>
        <Text fw={600} size={{ base: 'sm', md: 'md' }} c="dark.7">
          Recent emails
        </Text>
        <Anchor 
          size="xs" 
          c="blue" 
          onClick={() => navigate({ to: '/dashboard/mails' })}
          style={{ cursor: 'pointer' }}
        >
          View all
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
            {headers.map((h) => (
              <Table.Th key={h}>
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
                      {statusLabel[email.status]}
                    </Badge>
                    <Text size="xs" c="dimmed">
                      {email.to.length} recipient{email.to.length > 1 ? 's' : ''}
                    </Text>
                    {email.totalOpens && email.totalOpens > 0 && (
                      <Group gap={2}>
                        <IconEye size={12} color="var(--mantine-color-green-6)" />
                        <Text size="xs" c="dimmed">{email.totalOpens}</Text>
                      </Group>
                    )}
                    <Text size="xs" c="dimmed">
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
                  {statusLabel[email.status]}
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
                        View Details
                      </Menu.Item>
                      {email.gmailMessageId && (
                        <Menu.Item
                          leftSection={<IconExternalLink size={14} />}
                          onClick={() => handleOpenInGmail(email)}
                        >
                          Open in Gmail
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
    </Card>
  )
}