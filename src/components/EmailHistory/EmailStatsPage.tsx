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
  Timeline,
  ThemeIcon,
} from '@mantine/core'
import {
  IconArrowLeft,
  IconMail,
  IconEye,
  IconChartLine,
  IconMapPin,
  IconDeviceLaptop,
  IconClock,
  IconCheck,
  IconX,
} from '@tabler/icons-react'
import axios from 'axios'
import { format, formatDistance } from 'date-fns'
import { fr } from 'date-fns/locale'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

interface EmailDetail {
  id: string
  from: string
  to: string[]
  cc?: string[]
  bcc?: string[]
  subject: string
  sentAt: string
  status: string
  uniqueOpens: number
  totalOpens: number
  firstOpenedAt: string | null
  lastOpenedAt: string | null
}

interface OpenEvent {
  id: string
  openedAt: string
  userAgent: string | null
  ipAddress: string | null
  device: string
  location: string | null
}

interface EmailStats {
  email: EmailDetail
  opens: OpenEvent[]
  stats: {
    totalOpens: number
    uniqueOpens: number
    firstOpenedAt: string | null
    lastOpenedAt: string | null
    avgTimeBetweenOpens: number | null
  }
}

export function EmailStatsPage() {
  const { emailId } = useParams({ from: '/dashboard/email-history/$emailId/stats' })
  const navigate = useNavigate()
  const [stats, setStats] = useState<EmailStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [emailId])

  const fetchStats = async () => {
    try {
      // Fetch email details
      const emailResponse = await axios.get(`${API_URL}/email-history/${emailId}`, {
        withCredentials: true,
      })

      // Fetch open details
      const opensResponse = await axios.get(`${API_URL}/api/track/details/${emailId}`, {
        withCredentials: true,
      })

      const emailData = emailResponse.data
      const opensData = opensResponse.data

      // Calculate stats
      const totalOpens = opensData.length
      const firstOpen = opensData.length > 0 ? opensData[0].openedAt : null
      const lastOpen = opensData.length > 0 ? opensData[opensData.length - 1].openedAt : null

      let avgTimeBetweenOpens = null
      if (opensData.length > 1) {
        const timeDiffs = []
        for (let i = 1; i < opensData.length; i++) {
          const diff = new Date(opensData[i].openedAt).getTime() - new Date(opensData[i - 1].openedAt).getTime()
          timeDiffs.push(diff)
        }
        avgTimeBetweenOpens = timeDiffs.reduce((a, b) => a + b, 0) / timeDiffs.length
      }

      setStats({
        email: emailData,
        opens: opensData,
        stats: {
          totalOpens,
          uniqueOpens: totalOpens > 0 ? 1 : 0,
          firstOpenedAt: firstOpen,
          lastOpenedAt: lastOpen,
          avgTimeBetweenOpens,
        },
      })
    } catch (error) {
      console.error('Failed to fetch email stats:', error)
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
                  Email not found
                </Text>
                <Text size="sm" c="dimmed">
                  The email you're looking for doesn't exist or has been deleted.
                </Text>
              </div>
              <Button
                leftSection={<IconArrowLeft size={16} />}
                onClick={() => navigate({ to: '/dashboard/mails' })}
                fullWidth
              >
                Back to Email History
              </Button>
            </Stack>
          </Paper>
        </Stack>
      </Container>
    )
  }

  return (
    <Container size="lg" py="md">
      <Stack gap="lg">
        {/* Header */}
        <Group>
          <Button
            variant="subtle"
            leftSection={<IconArrowLeft size={16} />}
            onClick={() => navigate({ to: '/dashboard/mails' })}
          >
            Back to Email History
          </Button>
        </Group>

        {/* Email Info */}
        <Card withBorder p="lg">
          <Stack gap="md">
            <Group justify="space-between">
              <div>
                <Text size="xl" fw={700} mb={4}>
                  {stats.email.subject}
                </Text>
                <Group gap="xs">
                  <Text size="sm" c="dimmed">
                    From: <strong>{stats.email.from}</strong>
                  </Text>
                  <Text size="sm" c="dimmed">•</Text>
                  <Text size="sm" c="dimmed">
                    To: <strong>{stats.email.to.join(', ')}</strong>
                  </Text>
                </Group>
              </div>
              {stats.stats.totalOpens > 0 ? (
                <Badge color="green" size="lg" leftSection={<IconCheck size={14} />}>
                  Opened
                </Badge>
              ) : (
                <Badge color="gray" size="lg" leftSection={<IconX size={14} />}>
                  Not Opened
                </Badge>
              )}
            </Group>

            <Group gap="lg">
              <div>
                <Text size="xs" c="dimmed">Sent At</Text>
                <Text size="sm" fw={600}>
                  {format(new Date(stats.email.sentAt), 'dd MMMM yyyy à HH:mm', { locale: fr })}
                </Text>
              </div>
              {stats.stats.firstOpenedAt && (
                <div>
                  <Text size="xs" c="dimmed">First Opened</Text>
                  <Text size="sm" fw={600}>
                    {formatDistance(new Date(stats.stats.firstOpenedAt), new Date(stats.email.sentAt), { locale: fr })} après l'envoi
                  </Text>
                </div>
              )}
            </Group>
          </Stack>
        </Card>

        {/* Stats Cards */}
        <Grid>
          <Grid.Col span={3}>
            <Card withBorder p="md">
              <Stack gap="xs">
                <Group gap="xs">
                  <IconEye size={20} color="var(--mantine-color-blue-6)" />
                  <Text size="sm" c="dimmed" fw={500}>
                    Total Opens
                  </Text>
                </Group>
                <Text size="xl" fw={700}>
                  {stats.stats.totalOpens}
                </Text>
                <Text size="xs" c="dimmed">
                  Nombre d'ouvertures
                </Text>
              </Stack>
            </Card>
          </Grid.Col>

          <Grid.Col span={3}>
            <Card withBorder p="md">
              <Stack gap="xs">
                <Group gap="xs">
                  <IconClock size={20} color="var(--mantine-color-green-6)" />
                  <Text size="sm" c="dimmed" fw={500}>
                    First Open
                  </Text>
                </Group>
                <Text size="xl" fw={700}>
                  {stats.stats.firstOpenedAt
                    ? formatDistance(new Date(stats.stats.firstOpenedAt), new Date(stats.email.sentAt), { locale: fr })
                    : '-'}
                </Text>
                <Text size="xs" c="dimmed">
                  Après l'envoi
                </Text>
              </Stack>
            </Card>
          </Grid.Col>

          <Grid.Col span={3}>
            <Card withBorder p="md">
              <Stack gap="xs">
                <Group gap="xs">
                  <IconClock size={20} color="var(--mantine-color-cyan-6)" />
                  <Text size="sm" c="dimmed" fw={500}>
                    Last Open
                  </Text>
                </Group>
                <Text size="xl" fw={700}>
                  {stats.stats.lastOpenedAt
                    ? formatDistance(new Date(stats.stats.lastOpenedAt), new Date(), { locale: fr, addSuffix: true })
                    : '-'}
                </Text>
                <Text size="xs" c="dimmed">
                  Dernière ouverture
                </Text>
              </Stack>
            </Card>
          </Grid.Col>

          <Grid.Col span={3}>
            <Card withBorder p="md">
              <Stack gap="xs">
                <Group gap="xs">
                  <IconChartLine size={20} color="var(--mantine-color-orange-6)" />
                  <Text size="sm" c="dimmed" fw={500}>
                    Avg Interval
                  </Text>
                </Group>
                <Text size="xl" fw={700}>
                  {stats.stats.avgTimeBetweenOpens
                    ? `${Math.round(stats.stats.avgTimeBetweenOpens / 1000 / 60)}min`
                    : '-'}
                </Text>
                <Text size="xs" c="dimmed">
                  Entre les ouvertures
                </Text>
              </Stack>
            </Card>
          </Grid.Col>
        </Grid>

        {/* Open Events Timeline */}
        {stats.opens.length > 0 && (
          <Card withBorder p="lg">
            <Stack gap="md">
              <div>
                <Text size="lg" fw={600} mb={4}>
                  Timeline des ouvertures
                </Text>
                <Text size="sm" c="dimmed">
                  Historique détaillé de toutes les ouvertures
                </Text>
              </div>

              <Timeline active={stats.opens.length} bulletSize={24} lineWidth={2}>
                {stats.opens.map((open, index) => (
                  <Timeline.Item
                    key={open.id}
                    bullet={<IconEye size={12} />}
                    title={
                      <Group gap="xs">
                        <Text size="sm" fw={600}>
                          Ouverture #{index + 1}
                        </Text>
                        <Badge size="sm" variant="light">
                          {format(new Date(open.openedAt), 'HH:mm:ss')}
                        </Badge>
                      </Group>
                    }
                  >
                    <Stack gap="xs" mt="xs">
                      <Text size="xs" c="dimmed">
                        {format(new Date(open.openedAt), 'dd MMMM yyyy à HH:mm:ss', { locale: fr })}
                      </Text>
                      
                      <Group gap="md">
                        {open.device && (
                          <Group gap={6}>
                            <IconDeviceLaptop size={14} color="var(--mantine-color-gray-6)" />
                            <Text size="xs">{open.device}</Text>
                          </Group>
                        )}
                        
                        {open.location && (
                          <Group gap={6}>
                            <IconMapPin size={14} color="var(--mantine-color-gray-6)" />
                            <Text size="xs">{open.location}</Text>
                          </Group>
                        )}
                      </Group>

                      {open.userAgent && (
                        <Text size="xs" c="dimmed" style={{ fontFamily: 'monospace' }}>
                          {open.userAgent.length > 100 ? open.userAgent.substring(0, 100) + '...' : open.userAgent}
                        </Text>
                      )}
                    </Stack>
                  </Timeline.Item>
                ))}
              </Timeline>
            </Stack>
          </Card>
        )}

        {/* No Opens State */}
        {stats.opens.length === 0 && (
          <Card withBorder p="xl">
            <Stack align="center" gap="md" py="xl">
              <ThemeIcon size={60} radius="xl" variant="light" color="gray">
                <IconMail size={30} />
              </ThemeIcon>
              <div style={{ textAlign: 'center' }}>
                <Text size="lg" fw={600} mb="xs">
                  Pas encore d'ouvertures
                </Text>
                <Text size="sm" c="dimmed">
                  Cet email n'a pas encore été ouvert par le destinataire.
                </Text>
              </div>
            </Stack>
          </Card>
        )}
      </Stack>
    </Container>
  )
}
