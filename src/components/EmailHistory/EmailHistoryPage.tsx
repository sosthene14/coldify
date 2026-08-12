import { useEffect, useState, useCallback, useMemo } from 'react'
import {
  Container,
  Stack,
  Text,
  Group,
  Button,
  Card,
  Badge,
  ActionIcon,
  Tooltip,
  Modal,
  TextInput,
  Select,
  Loader,
  Paper,
  Pagination,
  Menu,
  Grid,
  Table,
} from '@mantine/core'
import {
  IconPlus,
  IconPaperclip,
  IconExternalLink,
  IconEye,
  IconSearch,
  IconClock,
  IconDotsVertical,
  IconTrash,
  IconEdit,
  IconX,
  IconSend,
  IconUsers,
  IconChartLine,
} from '@tabler/icons-react'
import { useNavigate } from '@tanstack/react-router'
import axios from 'axios'
import { format } from 'date-fns'
import { notifications } from '@mantine/notifications'
import { EmailOpenDetailsModal } from "./EmailOpenDetailsModal";
import { useEmailTracking } from "../../hooks/useEmailTracking";
import { useSession } from '#/lib/auth-client';


const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'
const ITEMS_PER_PAGE = 12

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
  sentAt?: Date
  scheduledAt?: Date
  createdAt?: Date
  type: 'sent' | 'scheduled'
  mailboxId?: string
  // Tracking stats (denormalized)
  totalOpens?: number
  uniqueOpens?: number
  firstOpenedAt?: Date
  lastOpenedAt?: Date
}

interface EmailHistoryResponse {
  data: EmailHistoryItem[]
  pagination: {
    total: number
    limit: number
    offset: number
    page: number
    totalPages: number
  }
}

interface PaginationState {
  currentPage: number
  totalPages: number
  total: number
  loading: boolean
}

// Custom hook pour gérer la pagination et le fetch des emails
function useEmailHistory(searchQuery: string, statusFilter: string | null) {
  const [emails, setEmails] = useState<EmailHistoryItem[]>([])
  const [scheduledEmails, setScheduledEmails] = useState<EmailHistoryItem[]>([])
  const [pagination, setPagination] = useState<PaginationState>({
    currentPage: 1,
    totalPages: 1,
    total: 0,
    loading: true
  })

  const fetchEmails = useCallback(async (page: number = 1) => {
    setPagination(prev => ({ ...prev, loading: true }))
    
    try {
      const offset = (page - 1) * ITEMS_PER_PAGE
      
      // Fetch sent emails with server-side pagination
      const sentResponse = await axios.get<EmailHistoryResponse>(`${API_URL}/email-history`, {
        withCredentials: true,
        params: {
          limit: ITEMS_PER_PAGE,
          offset: offset,
        }
      })

      // Fetch scheduled emails (these are typically fewer so we get all)
      const scheduledResponse = await axios.get(`${API_URL}/scheduled-emails`, {
        withCredentials: true,
      })

      // Map sent emails
      const sentEmails: EmailHistoryItem[] = sentResponse.data.data.map((email: any) => ({
        ...email,
        type: 'sent' as const,
      }))

      // Map scheduled emails
      const scheduledEmailsData: EmailHistoryItem[] = scheduledResponse.data.map((email: any) => ({
        id: email.id,
        from: '', // Will be populated from mailbox
        to: email.to,
        cc: email.cc,
        bcc: email.bcc,
        subject: email.subject,
        htmlContent: email.htmlContent,
        hasAttachments: email.hasAttachments,
        attachmentCount: email.attachmentCount,
        attachmentNames: email.attachments?.map((a: any) => a.filename),
        status: email.status,
        scheduledAt: email.scheduledAt,
        createdAt: email.createdAt,
        mailboxId: email.mailboxId,
        type: 'scheduled' as const,
      }))

      setEmails(sentEmails)
      setScheduledEmails(scheduledEmailsData)
      
      // Set pagination info from API response
      setPagination({
        currentPage: page,
        totalPages: sentResponse.data.pagination.totalPages,
        total: sentResponse.data.pagination.total,
        loading: false
      })
    } catch (error) {
      console.error('Failed to fetch emails:', error)
      setPagination(prev => ({ ...prev, loading: false }))
    }
  }, [])

  // Combine sent and scheduled emails for display, applying filters
  const filteredEmails = [...emails, ...scheduledEmails].filter((email) => {
    const matchesSearch = !searchQuery || 
      email.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      email.to.some((recipient) =>
        recipient.toLowerCase().includes(searchQuery.toLowerCase())
      )

    const matchesStatus = !statusFilter || email.status === statusFilter

    return matchesSearch && matchesStatus
  }).sort((a, b) => {
    // Sort by date (most recent first)
    const dateA = a.sentAt || a.scheduledAt || a.createdAt || new Date(0)
    const dateB = b.sentAt || b.scheduledAt || b.createdAt || new Date(0)
    return new Date(dateB).getTime() - new Date(dateA).getTime()
  })

  return {
    emails: filteredEmails,
    pagination,
    fetchEmails,
    refetchEmails: () => fetchEmails(pagination.currentPage)
  }
}

export function EmailHistoryPage() {
  const navigate = useNavigate()
  const [selectedEmail, setSelectedEmail] = useState<EmailHistoryItem | null>(null)
  const [modalOpened, setModalOpened] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string | null>(null)
  const [trackingModalEmailId, setTrackingModalEmailId] = useState<string | null>(null)

  const {data} = useSession()

  // Use the custom hook for pagination and data fetching
  const { emails: filteredEmails, pagination, fetchEmails, refetchEmails } = useEmailHistory(searchQuery, statusFilter)

  // Calculate KPIs
  const kpis = useMemo(() => {
    // Count only sent emails
    const sentEmails = filteredEmails.filter(e => e.type === 'sent')
    
    // Total sent
    const totalSent = pagination.total
    
    // Unique recipients
    const uniqueRecipients = new Set<string>()
    sentEmails.forEach(email => {
      email.to.forEach(recipient => uniqueRecipients.add(recipient.toLowerCase()))
    })
    
    // Open rate calculation
    const emailsWithOpens = sentEmails.filter(e => e.totalOpens && e.totalOpens > 0).length
    const openRate = totalSent > 0 ? (emailsWithOpens / totalSent) * 100 : 0
    
    return {
      totalSent,
      uniqueRecipients: uniqueRecipients.size,
      openRate: openRate.toFixed(1)
    }
  }, [filteredEmails, pagination.total])

  // Update email stats in real-time when WebSocket event received
  const handleEmailOpened = useCallback((_trackingData: { emailHistoryId: string; totalOpens: number }) => {
    // Force refresh to get updated stats
    refetchEmails()
  }, [refetchEmails]);

  useEmailTracking(data?.session?.activeOrganizationId as string, handleEmailOpened);

  useEffect(() => {
    fetchEmails(1)
  }, [fetchEmails])

  // Reset to page 1 when filters change
  useEffect(() => {
    fetchEmails(1)
  }, [searchQuery, statusFilter, fetchEmails])

  const handlePageChange = (page: number) => {
    fetchEmails(page)
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

  const handleCancelScheduled = async (email: EmailHistoryItem) => {
    if (email.type !== 'scheduled' || email.status !== 'pending') return

    try {
      await axios.delete(`${API_URL}/scheduled-emails/${email.id}`, {
        withCredentials: true,
      })

      await refetchEmails()
      setModalOpened(false)

      notifications.show({
        title: 'Cancelled',
        message: 'Scheduled email cancelled successfully',
        color: 'blue',
      })
    } catch (error: any) {
      console.error('Failed to cancel scheduled email:', error)
      notifications.show({
        title: 'Error',
        message: 'Failed to cancel scheduled email',
        color: 'red',
      })
    }
  }

  const handleDeleteEmail = async (email: EmailHistoryItem) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete this email?\nSubject: ${email.subject}`
    )

    if (!confirmed) return

    try {
      if (email.type === 'sent') {
        await axios.delete(`${API_URL}/email-history/${email.id}`, {
          withCredentials: true,
        })
      } else {
        await axios.delete(`${API_URL}/scheduled-emails/${email.id}`, {
          withCredentials: true,
        })
      }

      await refetchEmails()
      setModalOpened(false)

      notifications.show({
        title: 'Deleted',
        message: 'Email deleted successfully',
        color: 'green',
      })
    } catch (error: any) {
      console.error('Failed to delete email:', error)
      notifications.show({
        title: 'Error',
        message: 'Failed to delete email',
        color: 'red',
      })
    }
  }

  const handleEditScheduled = (email: EmailHistoryItem) => {
    if (email.type !== 'scheduled' || email.status !== 'pending') return

    // Navigate to compose page with pre-filled data
    navigate({
      to: '/dashboard/mails/new',
      search: {
        editScheduledId: email.id,
        subject: email.subject,
        to: email.to.join(','),
        cc: email.cc?.join(','),
        bcc: email.bcc?.join(','),
        html: email.htmlContent,
        scheduledAt: email.scheduledAt,
        mailboxId: email.mailboxId,
      },
    })
  }

  // Server-side pagination is handled by the custom hook
  const paginatedEmails = filteredEmails

  return (
    <div className='mx-0 md:mx-4'>
  <Container size="full"  py={{ base: 'xs', sm: 'sm', md: 'md' }} px={{ base: 'xs', sm: 'sm', md: 'md' }} >
      <Stack gap={{ base: 'xs', sm: 'sm', md: 'md' }}>
        {/* Header */}
        <Group justify="space-between" wrap="wrap" gap="xs">
          <div>
            <Text size="xl" fw={700}>
              Email History
            </Text>
            <Text size="sm" c="dimmed" visibleFrom="sm">
              View all emails you've sent
            </Text>
          </div>
          <Button
            leftSection={<IconPlus size={16} />}
            radius="sm"
            onClick={() => navigate({ to: '/dashboard/mails/new' })}
          >
            <span >Send Email</span>
            <span >Send</span>
          </Button>
        </Group>

        {/* KPIs Row - Compact */}
        <Card withBorder p={{ base: 'xs', sm: 'sm', md: 'md' }} radius="md">
          <Group grow>
            <div style={{ borderRight: '1px solid var(--mantine-color-gray-3)', paddingRight: 12 }}>
              <Group gap="xs" mb={4}>
                <IconSend size={16} color="var(--mantine-color-blue-6)" />
                <Text size="xs" c="dimmed" fw={500}>
                  Sent
                </Text>
              </Group>
              <Text size="lg" fw={700}>
                {kpis.totalSent}
              </Text>
            </div>

            <div style={{ borderRight: '1px solid var(--mantine-color-gray-3)', paddingRight: 12 }}>
              <Group gap="xs" mb={4}>
                <IconUsers size={16} color="var(--mantine-color-cyan-6)" />
                <Text size="xs" c="dimmed" fw={500}>
                  Recipients
                </Text>
              </Group>
              <Text size="lg" fw={700}>
                {kpis.uniqueRecipients}
              </Text>
            </div>

            <div>
              <Group gap="xs" mb={4}>
                <IconEye size={16} color="var(--mantine-color-green-6)" />
                <Text size="xs" c="dimmed" fw={500}>
                  Open Rate
                </Text>
              </Group>
              <Text size="lg" fw={700} c="green">
                {kpis.openRate}%
              </Text>
            </div>
          </Group>
        </Card>

        {/* Filters */}
        <Card withBorder p={{ base: 'xs', sm: 'sm', md: 'md' }}>
          <Stack gap="xs">
            <TextInput
              placeholder="Search..."
              leftSection={<IconSearch size={16} />}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Select
              placeholder="Status"
              data={[
                { value: 'sent', label: 'Sent' },
                { value: 'pending', label: 'Scheduled' },
                { value: 'processing', label: 'Processing' },
                { value: 'failed', label: 'Failed' },
                { value: 'cancelled', label: 'Cancelled' },
              ]}
              value={statusFilter}
              onChange={setStatusFilter}
              clearable
            />
          </Stack>
        </Card>

        {/* Email Table */}
        {pagination.loading ? (
          <Group justify="center" py={{ base: 'md', sm: 'xl' }}>
            <Loader size="sm" />
          </Group>
        ) : filteredEmails.length === 0 ? (
          <Paper withBorder p={{ base: 'md', sm: 'lg' }} radius="md">
            <Stack align="center" gap={{ base: 'md', sm: 'lg' }}>
              <img 
                src="/postal-box.png" 
                alt="Empty mailbox" 
                style={{ 
                  width: '120px',
                  height: 'auto',
                  opacity: 0.9
                }} 
              />
              <Stack align="center" gap={4}>
                <Text size="lg" fw={700} ta="center">
                  {pagination.total === 0 ? 'No emails sent yet' : 'No emails found'}
                </Text>
                <Text size="sm" c="dimmed" ta="center" style={{ maxWidth: 400 }}>
                  {pagination.total === 0
                    ? 'Start by sending your first email'
                    : 'Try adjusting your filters'}
                </Text>
              </Stack>
              {pagination.total === 0 && (
                <Button
                  leftSection={<IconPlus size={16} />}
                  onClick={() => navigate({ to: '/dashboard/mails/new' })}
                  color="blue"
                  variant="filled"
                  radius="md"
                >
                  Send Your First Email
                </Button>
              )}
            </Stack>
          </Paper>
        ) : (
          <Card withBorder p="0" radius="md">
            <Table highlightOnHover verticalSpacing="xs" horizontalSpacing="xs">
              <Table.Thead visibleFrom="sm">
                <Table.Tr>
                  <Table.Th>Subject</Table.Th>
                  <Table.Th>Recipient</Table.Th>
                  <Table.Th>Status</Table.Th>
                  <Table.Th>Opens</Table.Th>
                  <Table.Th>Date</Table.Th>
                  <Table.Th w={60}></Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {paginatedEmails.map((email) => (
                  <Table.Tr 
                    key={email.id} 
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleViewDetails(email)}
                  >
                    <Table.Td>
                      {/* Desktop view */}
                      <Stack gap={4} visibleFrom="sm">
                        <Group gap="xs" wrap="nowrap">
                          {email.hasAttachments && (
                            <Tooltip label={`${email.attachmentCount} attachment${email.attachmentCount > 1 ? 's' : ''}`}>
                              <IconPaperclip size={14} color="var(--mantine-color-gray-6)" />
                            </Tooltip>
                          )}
                          <Text size="sm" fw={500} lineClamp={1} style={{ flex: 1 }}>
                            {email.subject}
                          </Text>
                        </Group>
                        <Text 
                          size="xs" 
                          c="dimmed" 
                          lineClamp={1}
                          style={{ 
                            maxWidth: '400px',
                            fontWeight: 300
                          }}
                          dangerouslySetInnerHTML={{
                            __html: email.htmlContent
                              .replace(/<[^>]*>/g, '')
                              .replace(/&nbsp;/g, ' ')
                              .trim()
                              .substring(0, 100)
                          }}
                        />
                      </Stack>

                      {/* Mobile view - compact with sent and open info */}
                      <Stack gap={4} hiddenFrom="sm">
                        <Group gap={4} wrap="nowrap">
                          {email.hasAttachments && (
                            <IconPaperclip size={12} color="var(--mantine-color-gray-6)" />
                          )}
                          <Text size="xs" fw={500} lineClamp={1} style={{ flex: 1 }}>
                            {email.subject}
                          </Text>
                        </Group>
                        <Group gap={6} wrap="wrap">
                          <Badge
                            size="xs"
                            variant="light"
                            radius="xs"
                            color={
                              email.status === 'sent' ? 'green' :
                              email.status === 'pending' ? 'blue' :
                              email.status === 'processing' ? 'yellow' :
                              email.status === 'failed' ? 'red' :
                              email.status === 'cancelled' ? 'gray' : 'green'
                            }
                          >
                            {email.status === 'pending' ? 'scheduled' : email.status}
                          </Badge>
                          <Group gap={4}>
                            <IconClock size={10} color="var(--mantine-color-gray-6)" />
                            <Text size="xs" c="dimmed">
                              {email.type === 'scheduled' && email.scheduledAt
                                ? format(new Date(email.scheduledAt), 'dd/MM HH:mm')
                                : email.sentAt
                                ? format(new Date(email.sentAt), 'dd/MM HH:mm')
                                : format(new Date(email.createdAt!), 'dd/MM HH:mm')}
                            </Text>
                          </Group>
                          {email.type === 'sent' && email.totalOpens && email.totalOpens > 0 && (
                            <Group gap={2}>
                              <IconEye size={10} color="var(--mantine-color-green-6)" />
                              <Text size="xs" c="green" fw={500}>{email.totalOpens}</Text>
                            </Group>
                          )}
                          <Text size="xs" c="dimmed">
                            {email.to.length > 1 ? `${email.to.length} recipients` : email.to[0].length > 20 ? `${email.to[0].substring(0, 20)}...` : email.to[0]}
                          </Text>
                        </Group>
                      </Stack>
                    </Table.Td>
                    
                    <Table.Td visibleFrom="sm">
                      <Text size="sm" c="dimmed" lineClamp={1}>
                        {email.to[0]}
                        {email.to.length > 1 && (
                          <Tooltip label={email.to.join(', ')}>
                            <Badge size="xs" variant="light" ml={6}>
                              +{email.to.length - 1}
                            </Badge>
                          </Tooltip>
                        )}
                      </Text>
                    </Table.Td>
                    
                    <Table.Td visibleFrom="sm">
                      <Badge
                        size="sm"
                        variant="light"
                        color={
                          email.status === 'sent' ? 'green' :
                          email.status === 'pending' ? 'blue' :
                          email.status === 'processing' ? 'yellow' :
                          email.status === 'failed' ? 'red' :
                          email.status === 'cancelled' ? 'gray' : 'green'
                        }
                      >
                        {email.status === 'pending' ? 'scheduled' : email.status}
                      </Badge>
                    </Table.Td>
                    
                    <Table.Td visibleFrom="sm">
                      {email.type === 'sent' && email.totalOpens && email.totalOpens > 0 ? (
                        <Tooltip label="Click to view open details">
                          <Badge
                            size="sm"
                            variant="light"
                            color="blue"
                            leftSection={<IconEye size={12} />}
                            style={{ cursor: 'pointer' }}
                            onClick={(e) => {
                              e.stopPropagation()
                              setTrackingModalEmailId(email.id)
                            }}
                          >
                            {email.totalOpens}
                          </Badge>
                        </Tooltip>
                      ) : (
                        <Text size="sm" c="dimmed">-</Text>
                      )}
                    </Table.Td>
                    
                    <Table.Td visibleFrom="sm">
                      <Group gap={6} wrap="nowrap">
                        <IconClock size={14} color="var(--mantine-color-gray-6)" />
                        <Text size="xs" c="dimmed" style={{ whiteSpace: 'nowrap' }}>
                          {email.type === 'scheduled' && email.scheduledAt
                            ? format(new Date(email.scheduledAt), 'dd/MM/yyyy HH:mm')
                            : email.sentAt
                            ? format(new Date(email.sentAt), 'dd/MM/yyyy HH:mm')
                            : format(new Date(email.createdAt!), 'dd/MM/yyyy HH:mm')}
                        </Text>
                      </Group>
                    </Table.Td>
                    
                    <Table.Td onClick={(e) => e.stopPropagation()}>
                      <Menu position="bottom-end" withinPortal>
                        <Menu.Target>
                          <ActionIcon variant="subtle" size="sm">
                            <IconDotsVertical size={16} />
                          </ActionIcon>
                        </Menu.Target>
                        <Menu.Dropdown>
                          <Menu.Item
                            leftSection={<IconEye size={14} />}
                            onClick={() => handleViewDetails(email)}
                          >
                            View Details
                          </Menu.Item>
                          {email.type === 'sent' && (
                            <Menu.Item
                              leftSection={<IconChartLine size={14} />}
                              onClick={() => navigate({ to: `/dashboard/email-history/${email.id}/stats` })}
                            >
                              View Stats
                            </Menu.Item>
                          )}
                          {email.type === 'scheduled' && email.status === 'pending' && (
                            <>
                              <Menu.Item
                                leftSection={<IconEdit size={14} />}
                                onClick={() => handleEditScheduled(email)}
                              >
                                Edit
                              </Menu.Item>
                              <Menu.Item
                                leftSection={<IconX size={14} />}
                                onClick={() => handleCancelScheduled(email)}
                              >
                                Cancel Schedule
                              </Menu.Item>
                            </>
                          )}
                          {email.gmailMessageId && (
                            <Menu.Item
                              leftSection={<IconExternalLink size={14} />}
                              onClick={() => handleOpenInGmail(email)}
                            >
                              Open in Gmail
                            </Menu.Item>
                          )}
                          <Menu.Divider />
                          <Menu.Item
                            color="red"
                            leftSection={<IconTrash size={14} />}
                            onClick={() => handleDeleteEmail(email)}
                          >
                            Delete
                          </Menu.Item>
                        </Menu.Dropdown>
                      </Menu>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <Group justify="space-between" p={{ base: 'xs', sm: 'sm', md: 'md' }} style={{ borderTop: '1px solid var(--mantine-color-gray-3)' }} wrap="wrap" gap="xs">
                <Text size="xs" c="dimmed">
                  Page {pagination.currentPage} of {pagination.totalPages}
                  <span className="hidden sm:inline"> ({pagination.total} total)</span>
                </Text>
                <Pagination
                  total={pagination.totalPages}
                  value={pagination.currentPage}
                  onChange={handlePageChange}
                  size="xs"
                />
              </Group>
            )}
          </Card>
        )}
      </Stack>

      {/* Details Modal */}
      <Modal
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        title="Email Details"
        size="xl"
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
                {selectedEmail.sentAt
                  ? format(new Date(selectedEmail.sentAt), 'PPpp')
                  : selectedEmail.scheduledAt
                  ? `Scheduled for ${format(new Date(selectedEmail.scheduledAt), 'PPpp')}`
                  : 'Pending'}
              </Text>
            </div>

            {/* Tracking Stats for Sent Emails */}
            {selectedEmail.type === 'sent' && selectedEmail.totalOpens && selectedEmail.totalOpens > 0 && (
              <Card withBorder p="md" bg="blue.0">
                <Stack gap="xs">
                  <Group justify="space-between">
                    <Text size="sm" fw={600} c="blue">
                      Email Tracking
                    </Text>
                    <Button
                      size="xs"
                      variant="light"
                      onClick={() => setTrackingModalEmailId(selectedEmail.id)}
                    >
                      View Details
                    </Button>
                  </Group>
                  
                  <Group gap="lg">
                    <div>
                      <Text size="xl" fw={700} c="blue">
                        {selectedEmail.totalOpens}
                      </Text>
                      <Text size="xs" c="dimmed">
                        Total Opens
                      </Text>
                    </div>
                    <div>
                      <Text size="xl" fw={700} c="blue">
                        {selectedEmail.uniqueOpens || 0}
                      </Text>
                      <Text size="xs" c="dimmed">
                        Unique Opens
                      </Text>
                    </div>
                  </Group>

                  {selectedEmail.firstOpenedAt && (
                    <Text size="xs" c="dimmed">
                      First opened: {format(new Date(selectedEmail.firstOpenedAt), 'PPpp')}
                    </Text>
                  )}
                </Stack>
              </Card>
            )}

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
                  style={{ maxHeight: 300, overflow: 'auto',fontWeight:300 }}
                />
              </Card>
            </div>

            {/* Action Buttons */}
            <Group gap="xs" mt="md">
              {selectedEmail.gmailMessageId && (
                <Button
                  variant="default"
                  leftSection={<IconExternalLink size={16} />}
                  onClick={() => handleOpenInGmail(selectedEmail)}
                  style={{ flex: 1 }}
                >
                  Gmail
                </Button>
              )}

              {selectedEmail.type === 'scheduled' && selectedEmail.status === 'pending' && (
                <>
                  <Button
                    variant="default"
                    leftSection={<IconEdit size={16} />}
                    onClick={() => handleEditScheduled(selectedEmail)}
                    style={{ flex: 1 }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="default"
                    color="orange"
                    leftSection={<IconX size={16} />}
                    onClick={() => handleCancelScheduled(selectedEmail)}
                    style={{ flex: 1 }}
                  >
                    Cancel
                  </Button>
                </>
              )}

              <Button
                variant="default"
                color="red"
                leftSection={<IconTrash size={16} />}
                onClick={() => handleDeleteEmail(selectedEmail)}
                style={{ flex: 1 }}
              >
                Delete
              </Button>
            </Group>
          </Stack>
        )}
      </Modal>

      {/* Email Open Tracking Details Modal */}
      {trackingModalEmailId && (
        <EmailOpenDetailsModal
          emailHistoryId={trackingModalEmailId}
          isOpen={!!trackingModalEmailId}
          onClose={() => setTrackingModalEmailId(null)}
        />
      )}
    </Container>
    </div>
  
  )
}
