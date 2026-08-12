import { useEffect, useState } from 'react'
import { useParams, useNavigate } from '@tanstack/react-router'
import {
  Container,
  Stack,
  Text,
  Card,
  Group,
  Button,
  Grid,
  Paper,
  Badge,
  Loader,
  Center,
  Table,
  ActionIcon,
  Tooltip,
} from '@mantine/core'
import {
  IconArrowLeft,
  IconMail,
  IconEye,
  IconChartLine,
  IconCheck,
  IconX,
} from '@tabler/icons-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from 'recharts'
import axios from 'axios'
import { format } from 'date-fns'
import { EmailOpenDetailsModal } from '../EmailHistory/EmailOpenDetailsModal'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

interface EmailDetail {
  id: string
  recipient: string
  subject: string
  sentAt: string
  uniqueOpens: number
  totalOpens: number
  firstOpenedAt: string | null
  lastOpenedAt: string | null
}

interface TemplateStats {
  template: {
    id: string
    name: string
    subject: string
    category: string
    usageCount: number
    openRate: number
    replyRate: number
    lastUsedAt: string
  }
  overall: {
    totalSent: number
    totalOpened: number
    totalOpens: number
    avgOpensPerEmail: number
    openRate: number
  }
  timeSeries: Array<{
    date: string
    sent: number
    opened: number
    openRate: number
  }>
  emails: EmailDetail[]
}

export function TemplateStatsPage() {
  const { templateId } = useParams({ from: '/dashboard/templates/$templateId/stats' })
  const navigate = useNavigate()
  const [stats, setStats] = useState<TemplateStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedEmailId, setSelectedEmailId] = useState<string | null>(null)
  const [openDetailsModalOpen, setOpenDetailsModalOpen] = useState(false)

  useEffect(() => {
    fetchStats()
  }, [templateId])

  const fetchStats = async () => {
    try {
      const response = await axios.get(`${API_URL}/templates/${templateId}/stats`, {
        withCredentials: true,
      })
      setStats(response.data)
    } catch (error) {
      console.error('Failed to fetch template stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Center h={400}>
        <Loader size="sm" />
      </Center>
    )
  }

  if (!stats) {
    return (
      <Container size="lg" py="md">
        <Stack gap="lg" align="center" justify="center" mih={400}>
          <Paper withBorder p="xl" radius="md" w="100%" maw={500}>
            <Stack gap="md" align="center">
              <IconX size={48} color="var(--mantine-color-red-6)" />
              <div style={{ textAlign: 'center' }}>
                <Text size="xl" fw={700} mb="xs">
                  Template not found
                </Text>
                <Text size="sm" c="dimmed">
                  The template you're looking for doesn't exist or has been deleted.
                </Text>
              </div>
              <Button
                leftSection={<IconArrowLeft size={16} />}
                onClick={() => navigate({ to: '/dashboard/templates' })}
                fullWidth
              >
                Back to Templates
              </Button>
            </Stack>
          </Paper>
        </Stack>
      </Container>
    )
  }

  const chartData = stats.timeSeries.map(day => ({
    date: format(new Date(day.date), 'dd/MM'),
    'Emails envoyés': day.sent,
    'Emails ouverts': day.opened,
    'Taux d\'ouverture (%)': Math.round(day.openRate),
  }))

  return (
    <Container size="lg" py="md">
      <Stack gap="lg">
        {/* Header */}
        <Group>
          <Button
            variant="subtle"
            leftSection={<IconArrowLeft size={16} />}
            onClick={() => navigate({ to: '/dashboard/templates' })}
          >
            Back to Templates
          </Button>
        </Group>

        {/* Template Info */}
        <div>
          <Group gap="xs" mb={4}>
            <Text size="xl" fw={700}>
              {stats.template.name}
            </Text>
            <Badge size="lg" variant="light">
              {stats.template.category}
            </Badge>
          </Group>
          <Text size="sm" c="dimmed">
            {stats.template.subject}
          </Text>
        </div>

        {/* Overall Stats Cards */}
        <Grid>
          <Grid.Col span={3}>
            <Card withBorder p="md">
              <Stack gap="xs">
                <Group gap="xs">
                  <IconMail size={20} color="var(--mantine-color-blue-6)" />
                  <Text size="sm" c="dimmed" fw={500}>
                    Total Sent
                  </Text>
                </Group>
                <Text size="xl" fw={700}>
                  {stats.overall.totalSent}
                </Text>
                <Text size="xs" c="dimmed">
                  Emails envoyés avec ce template
                </Text>
              </Stack>
            </Card>
          </Grid.Col>

          <Grid.Col span={3}>
            <Card withBorder p="md">
              <Stack gap="xs">
                <Group gap="xs">
                  <IconEye size={20} color="var(--mantine-color-green-6)" />
                  <Text size="sm" c="dimmed" fw={500}>
                    Total Opened
                  </Text>
                </Group>
                <Text size="xl" fw={700}>
                  {stats.overall.totalOpened}
                </Text>
                <Text size="xs" c="dimmed">
                  Emails ouverts au moins une fois
                </Text>
              </Stack>
            </Card>
          </Grid.Col>

          <Grid.Col span={3}>
            <Card withBorder p="md">
              <Stack gap="xs">
                <Group gap="xs">
                  <IconChartLine size={20} color="var(--mantine-color-cyan-6)" />
                  <Text size="sm" c="dimmed" fw={500}>
                    Open Rate
                  </Text>
                </Group>
                <Text size="xl" fw={700}>
                  {stats.overall.openRate.toFixed(1)}%
                </Text>
                <Text size="xs" c="dimmed">
                  Taux d'ouverture global
                </Text>
              </Stack>
            </Card>
          </Grid.Col>

          <Grid.Col span={3}>
            <Card withBorder p="md">
              <Stack gap="xs">
                <Group gap="xs">
                  <IconEye size={20} color="var(--mantine-color-orange-6)" />
                  <Text size="sm" c="dimmed" fw={500}>
                    Avg Opens
                  </Text>
                </Group>
                <Text size="xl" fw={700}>
                  {stats.overall.avgOpensPerEmail.toFixed(1)}
                </Text>
                <Text size="xs" c="dimmed">
                  Ouvertures moyennes par email
                </Text>
              </Stack>
            </Card>
          </Grid.Col>
        </Grid>

        {/* Time Series Chart */}
        <Card withBorder p="lg">
          <Stack gap="md">
            <div>
              <Text size="lg" fw={600} mb={4}>
                Performance over time (Last 30 days)
              </Text>
              <Text size="sm" c="dimmed">
                Evolution des envois et ouvertures
              </Text>
            </div>

            {chartData.length === 0 ? (
              <Center h={300}>
                <Text c="dimmed">No data available for the last 30 days</Text>
              </Center>
            ) : (
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <RechartsTooltip />
                  <Legend />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="Emails envoyés"
                    stroke="#4C6EF5"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="Emails ouverts"
                    stroke="#51CF66"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="Taux d'ouverture (%)"
                    stroke="#FF6B6B"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </Stack>
        </Card>

        {/* Usage Info */}
        <Card withBorder p="md">
          <Group justify="space-between">
            <div>
              <Text size="sm" fw={500} mb={4}>
                Template Usage
              </Text>
              <Group gap="lg">
                <div>
                  <Text size="xs" c="dimmed">
                    Times Used
                  </Text>
                  <Text size="sm" fw={600}>
                    {stats.template.usageCount}
                  </Text>
                </div>
                {stats.template.lastUsedAt && (
                  <div>
                    <Text size="xs" c="dimmed">
                      Last Used
                    </Text>
                    <Text size="sm" fw={600}>
                      {format(new Date(stats.template.lastUsedAt), 'dd/MM/yyyy HH:mm')}
                    </Text>
                  </div>
                )}
              </Group>
            </div>
            {/* <Button
              variant="light"
              leftSection={<IconMail size={16} />}
              onClick={() => navigate({ to: '/dashboard/mails/new' })}
            >
              Use Template
            </Button> */}
          </Group>
        </Card>

        {/* Emails List */}
        <Card withBorder p="lg">
          <Stack gap="md">
            <div>
              <Text size="lg" fw={600} mb={4}>
                Emails sent (Last 50)
              </Text>
              <Text size="sm" c="dimmed">
                Détails des emails envoyés avec ce template
              </Text>
            </div>

            {stats.emails.length === 0 ? (
              <Center h={200}>
                <Text c="dimmed">No emails sent yet</Text>
              </Center>
            ) : (
              <Table striped highlightOnHover>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Recipient</Table.Th>
                    <Table.Th>Sent At</Table.Th>
                    <Table.Th>Status</Table.Th>
                    <Table.Th>Opens</Table.Th>
                    <Table.Th>First / Last Opened</Table.Th>
                    <Table.Th></Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {stats.emails.map((email) => (
                    <Table.Tr key={email.id}>
                      <Table.Td>
                        <Text size="sm" fw={500}>
                          {email.recipient}
                        </Text>
                      </Table.Td>
                      <Table.Td>
                        <Text size="sm" c="dimmed">
                          {format(new Date(email.sentAt), 'dd/MM/yyyy HH:mm')}
                        </Text>
                      </Table.Td>
                      <Table.Td>
                        {email.uniqueOpens > 0 ? (
                          <Badge color="green" size="sm" leftSection={<IconCheck size={12} />}>
                            Opened
                          </Badge>
                        ) : (
                          <Badge color="gray" size="sm" leftSection={<IconX size={12} />}>
                            Not Opened
                          </Badge>
                        )}
                      </Table.Td>
                      <Table.Td>
                        <Group gap="xs">
                          <IconEye size={14} color="var(--mantine-color-gray-6)" />
                          <Text size="sm">{email.totalOpens}</Text>
                        </Group>
                      </Table.Td>
                      <Table.Td>
                        {email.firstOpenedAt ? (
                          <Text size="xs" c="dimmed">
                            {format(new Date(email.firstOpenedAt), 'dd/MM HH:mm')}
                            {email.lastOpenedAt && email.lastOpenedAt !== email.firstOpenedAt && (
                              <> → {format(new Date(email.lastOpenedAt), 'dd/MM HH:mm')}</>
                            )}
                          </Text>
                        ) : (
                          <Text size="xs" c="dimmed">-</Text>
                        )}
                      </Table.Td>
                      <Table.Td>
                        {email.totalOpens > 0 ? (
                          <Tooltip label="View open details">
                            <ActionIcon
                              variant="subtle"
                              size="sm"
                              onClick={() => {
                                setSelectedEmailId(email.id)
                                setOpenDetailsModalOpen(true)
                              }}
                            >
                              <IconEye size={16} />
                            </ActionIcon>
                          </Tooltip>
                        ) : (
                          <div /> 
                        )}
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            )}
          </Stack>
        </Card>
      </Stack>

      {/* Open Details Modal */}
      {selectedEmailId && (
        <EmailOpenDetailsModal
          emailHistoryId={selectedEmailId}
          isOpen={openDetailsModalOpen}
          onClose={() => {
            setOpenDetailsModalOpen(false)
            setSelectedEmailId(null)
          }}
        />
      )}
    </Container>
  )
}
