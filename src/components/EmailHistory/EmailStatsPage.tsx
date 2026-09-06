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
  Timeline,
  ThemeIcon,
} from '@mantine/core'
import { useTranslation } from 'react-i18next'
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
import { useEmailTracking } from '../../hooks/useEmailTracking'
import { useSession } from '#/lib/auth-client'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

function isGmailImageProxy(userAgent?: string | null): boolean {
  const normalizedUserAgent = userAgent?.toLowerCase() || ''
  return normalizedUserAgent.includes('googleimageproxy') || normalizedUserAgent.includes('ggpht.com')
}

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
  const { t } = useTranslation()
  const { emailId } = useParams({ from: '/dashboard/email-history/$emailId/stats' })
  const navigate = useNavigate()
  const [stats, setStats] = useState<EmailStats | null>(null)
  const [loading, setLoading] = useState(true)
  const { data: session } = useSession()

  useEffect(() => {
    fetchStats()
  }, [emailId])

  useEmailTracking(session?.user?.id, (data) => {
    if (data.emailHistoryId === emailId) {
      void fetchStats()
    }
  })

  const fetchStats = async () => {
    try {
      const emailResponse = await axios.get(`${API_URL}/email-history/${emailId}`, {
        withCredentials: true,
      })

      const opensResponse = await axios.get(`${API_URL}/track/details/${emailId}`, {
        withCredentials: true,
      })

      const emailData = emailResponse.data
      const opensData = opensResponse.data

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
      <Container size="lg" py="md" px="md">
        <Stack gap="lg" align="center" justify="center" mih={400}>
          <Paper withBorder p="xl" radius="md" w="100%" maw={500}>
            <Stack gap="md" align="center">
              <IconX size={48} color="var(--mantine-color-red-6)" />
              <div style={{ textAlign: 'center' }}>
                <Text size="xl" fw={700} mb="xs">
                  {t('email_not_found')}
                </Text>
                <Text size="sm" c="dimmed">
                  {t('email_not_found_desc')}
                </Text>
              </div>
              <Button
                leftSection={<IconArrowLeft size={16} />}
                onClick={() => navigate({ to: '/dashboard/mails' })}
                fullWidth
              >
                {t('back_to_email_history')}
              </Button>
            </Stack>
          </Paper>
        </Stack>
      </Container>
    )
  }

  return (
    <Container size="lg" py="md" px={{ base: 'xs', sm: 'md' }}>
      <Stack gap="lg">
        {/* Header */}
        <Group>
          <Button
            variant="subtle"
            leftSection={<IconArrowLeft size={16} />}
            onClick={() => navigate({ to: '/dashboard/mails' })}
            size="sm"
          >
            {t('back_to_email_history')}
          </Button>
        </Group>

        {/* Email Info */}
        <Card withBorder p={{ base: 'md', sm: 'lg' }}>
          <Stack gap="md">
            <Group justify="space-between" wrap="wrap" gap="sm">
              <div style={{ minWidth: 0, flex: 1 }}>
                <Text size="xl" fw={700} mb={4} style={{ wordBreak: 'break-word' }}>
                  {stats.email.subject}
                </Text>
                <Stack gap={2}>
                  <Text size="sm" c="dimmed" style={{ wordBreak: 'break-word' }}>
                    {t('from')}: <strong>{stats.email.from}</strong>
                  </Text>
                  <Text size="sm" c="dimmed" style={{ wordBreak: 'break-word' }}>
                    {t('to')}: <strong>{stats.email.to.join(', ')}</strong>
                  </Text>
                </Stack>
              </div>
              {stats.stats.totalOpens > 0 ? (
                <Badge color="green" size="lg" leftSection={<IconCheck size={14} />}>
                  {t('opened')}
                </Badge>
              ) : (
                <Badge color="gray" size="lg" leftSection={<IconX size={14} />}>
                  {t('not_opened')}
                </Badge>
              )}
            </Group>

            <Group gap="lg" wrap="wrap">
              <div>
                <Text size="xs" c="dimmed">{t('sent_at')}</Text>
                <Text size="sm" fw={600}>
                  {format(new Date(stats.email.sentAt), 'dd MMMM yyyy à HH:mm')}
                </Text>
              </div>
              {stats.stats.firstOpenedAt && (
                <div>
                  <Text size="xs" c="dimmed">{t('first_opened')}</Text>
                  <Text size="sm" fw={600}>
                    {formatDistance(new Date(stats.stats.firstOpenedAt), new Date(stats.email.sentAt))} {t('after_sending')}
                  </Text>
                </div>
              )}
            </Group>
          </Stack>
        </Card>

        {/* Stats Cards */}
        <Grid >
          <Grid.Col span={{ base: 6, sm: 3 }}>
            <Card withBorder p="md" h="100%">
              <Stack gap="xs">
                <Group gap="xs" wrap="nowrap">
                  <IconEye size={20} color="var(--mantine-color-blue-6)" style={{ flexShrink: 0 }} />
                  <Text size="sm" c="dimmed" fw={500}>
                    {t('total_opens')}
                  </Text>
                </Group>
                <Text size="xl" fw={700}>
                  {stats.stats.totalOpens}
                </Text>
                <Text size="xs" c="dimmed">
                  {t('open_count')}
                </Text>
              </Stack>
            </Card>
          </Grid.Col>

          <Grid.Col span={{ base: 6, sm: 3 }}>
            <Card withBorder p="md" h="100%">
              <Stack gap="xs">
                <Group gap="xs" wrap="nowrap">
                  <IconClock size={20} color="var(--mantine-color-green-6)" style={{ flexShrink: 0 }} />
                  <Text size="sm" c="dimmed" fw={500}>
                    {t('first_open')}
                  </Text>
                </Group>
                <Text size="xl" fw={700}>
                  {stats.stats.firstOpenedAt
                    ? formatDistance(new Date(stats.stats.firstOpenedAt), new Date(stats.email.sentAt))
                    : '-'}
                </Text>
                <Text size="xs" c="dimmed">
                  {t('after_sending')}
                </Text>
              </Stack>
            </Card>
          </Grid.Col>

          <Grid.Col span={{ base: 6, sm: 3 }}>
            <Card withBorder p="md" h="100%">
              <Stack gap="xs">
                <Group gap="xs" wrap="nowrap">
                  <IconClock size={20} color="var(--mantine-color-cyan-6)" style={{ flexShrink: 0 }} />
                  <Text size="sm" c="dimmed" fw={500}>
                    {t('last_open')}
                  </Text>
                </Group>
                <Text size="xl" fw={700}>
                  {stats.stats.lastOpenedAt
                    ? formatDistance(new Date(stats.stats.lastOpenedAt), new Date(), { addSuffix: true })
                    : '-'}
                </Text>
                <Text size="xs" c="dimmed">
                  {t('last_open')}
                </Text>
              </Stack>
            </Card>
          </Grid.Col>

          <Grid.Col span={{ base: 6, sm: 3 }}>
            <Card withBorder p="md" h="100%">
              <Stack gap="xs">
                <Group gap="xs" wrap="nowrap">
                  <IconChartLine size={20} color="var(--mantine-color-orange-6)" style={{ flexShrink: 0 }} />
                  <Text size="sm" c="dimmed" fw={500}>
                    {t('avg_interval')}
                  </Text>
                </Group>
                <Text size="xl" fw={700}>
                  {stats.stats.avgTimeBetweenOpens
                    ? `${Math.round(stats.stats.avgTimeBetweenOpens / 1000 / 60)}min`
                    : '-'}
                </Text>
                <Text size="xs" c="dimmed">
                  {t('between_opens')}
                </Text>
              </Stack>
            </Card>
          </Grid.Col>
        </Grid>

        {/* Open Events Timeline */}
        {stats.opens.length > 0 && (
          <Card withBorder p={{ base: 'md', sm: 'lg' }}>
            <Stack gap="md">
              <div>
                <Text size="lg" fw={600} mb={4}>
                  {t('open_timeline')}
                </Text>
                <Text size="sm" c="dimmed">
                  {t('detailed_open_history')}
                </Text>
              </div>

              <Timeline active={stats.opens.length} bulletSize={24} lineWidth={2}>
                {stats.opens.map((open, index) => (
                  <Timeline.Item
                    key={open.id}
                    bullet={<IconEye size={12} />}
                    title={
                      <Group gap="xs" wrap="wrap">
                        <Text size="sm" fw={600}>
                          {t('open_number', { count: index + 1 })}
                        </Text>
                        <Badge size="sm" variant="light">
                          {format(new Date(open.openedAt), 'HH:mm:ss')}
                        </Badge>
                      </Group>
                    }
                  >
                    <Stack gap="xs" mt="xs">
                      <Text size="xs" c="dimmed">
                        {format(new Date(open.openedAt), 'dd MMMM yyyy à HH:mm:ss')}
                      </Text>

                      <Group gap="md" wrap="wrap">
                        {isGmailImageProxy(open.userAgent) ? (
                          <Group gap={6} wrap="nowrap">
                            <IconDeviceLaptop size={14} color="var(--mantine-color-gray-6)" style={{ flexShrink: 0 }} />
                            <Text size="xs">{t('gmail_image_proxy')}</Text>
                          </Group>
                        ) : open.device ? (
                          <Group gap={6} wrap="nowrap">
                            <IconDeviceLaptop size={14} color="var(--mantine-color-gray-6)" style={{ flexShrink: 0 }} />
                            <Text size="xs">{open.device}</Text>
                          </Group>
                        ) : null}

                        {open.location && (
                          <Group gap={6} wrap="nowrap">
                            <IconMapPin size={14} color="var(--mantine-color-gray-6)" style={{ flexShrink: 0 }} />
                            <Text size="xs">{open.location}</Text>
                          </Group>
                        )}
                      </Group>

                      {open.userAgent && (
                        <Text
                          size="xs"
                          c="dimmed"
                          style={{
                            fontFamily: 'monospace',
                            wordBreak: 'break-all',
                          }}
                        >
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
                  {t('no_opens_yet')}
                </Text>
                <Text size="sm" c="dimmed">
                  {t('email_not_opened_yet')}
                </Text>
              </div>
            </Stack>
          </Card>
        )}
      </Stack>
    </Container>
  )
}