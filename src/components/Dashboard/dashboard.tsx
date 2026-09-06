import { useState, useEffect, useCallback, useRef } from 'react'
import { useSession } from "#/lib/auth-client.ts";
import { useTranslation } from 'react-i18next'
import { PageHeader } from "../PageHeader";
import { EmailActivityOverview } from "./email-activity-overview";
import { RecentCampaigns } from "./recent-campaigns";
import { Sidebar } from "./Sidebar";
import { subDays, startOfDay, endOfDay } from 'date-fns'
import axios from 'axios'
import { Grid, Container, Card, Stack, Group, Text, Progress, Badge, Button } from '@mantine/core'
import { IconMail, IconSend, IconCalendar, IconTemplate } from '@tabler/icons-react'
import { useNavigate } from '@tanstack/react-router'
import { useEmailTracking } from '../../hooks/useEmailTracking'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

interface MailboxData {
  email: string
  score: number
  dailySent: number
  dailyLimit: number
  status: string
}

interface EmailLimitData {
  totalSent: number
  totalLimit: number
  mailboxes: MailboxData[]
}

// Hook pour récupérer les données d'email limits
function useEmailLimitData(): EmailLimitData & { loading: boolean } {
  const [data, setData] = useState<EmailLimitData>({
    totalSent: 0,
    totalLimit: 0,
    mailboxes: []
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchEmailLimits = async () => {
      try {
        // Récupérer le quota de l'organisation (vraie limite)
        const quotaResponse = await axios.get(`${API_URL}/quota`, {
          withCredentials: true
        })
        
        // Récupérer les mailboxes pour les stats individuelles
        const mailboxResponse = await axios.get(`${API_URL}/mailboxes`, {
          withCredentials: true
        })

        const quota = quotaResponse.data || {}
        const mailboxes = mailboxResponse.data || []
        
        const mailboxData: MailboxData[] = mailboxes
          .filter((mb: any) => mb.status === 'connected')
          .map((mb: any) => ({
            email: mb.email,
            score: calculateHealthScore(mb),
            dailySent: mb.dailySent || 0,
            dailyLimit: mb.dailyLimit || 0,
            status: mb.status
          }))

        setData({
          totalSent: quota.dailyUsed || 0, // Utiliser dailyUsed comme la card qui fonctionne
          totalLimit: quota.dailyLimit || 5, // Limite de l'organisation
          mailboxes: mailboxData
        })
      } catch (error) {
        console.error('Failed to fetch email limit data:', error)
        // Fallback data en cas d'erreur
        setData({
          totalSent: 0,
          totalLimit: 5, // Limite par défaut pour free
          mailboxes: []
        })
      } finally {
        setLoading(false)
      }
    }

    fetchEmailLimits()
  }, [])

  return { ...data, loading }
}

// Fonction pour calculer le score de santé d'une mailbox
function calculateHealthScore(mailbox: any): number {
  if (mailbox.status !== 'connected') return 0
  
  const dailyUsagePercent = mailbox.dailyLimit > 0 
    ? (mailbox.dailySent / mailbox.dailyLimit) * 100 
    : 0
  
  // Score basé sur l'utilisation (moins d'utilisation = meilleur score)
  if (dailyUsagePercent < 50) return Math.floor(95 + Math.random() * 5) // 95-100
  if (dailyUsagePercent < 80) return Math.floor(85 + Math.random() * 10) // 85-95
  if (dailyUsagePercent < 95) return Math.floor(70 + Math.random() * 15) // 70-85
  return Math.floor(50 + Math.random() * 20) // 50-70
}

export const Dashboard = () => {
  const { t } = useTranslation()
  const {data: session} = useSession()
  const { totalSent, totalLimit, mailboxes } = useEmailLimitData()
  const navigate = useNavigate()
  const [trackingRefreshKey, setTrackingRefreshKey] = useState(0)
  const [pullDistance, setPullDistance] = useState(0)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const touchStartY = useRef<number | null>(null)

  const refreshDashboardData = useCallback(() => {
    setIsRefreshing(true)
    setTrackingRefreshKey((key) => key + 1)
    window.setTimeout(() => setIsRefreshing(false), 500)
  }, [])

  const handleEmailOpened = useCallback(() => {
    setTrackingRefreshKey((key) => key + 1)
  }, [])

  useEmailTracking(session?.user?.id, handleEmailOpened)

  const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    if (window.scrollY > 0 || isRefreshing) return
    touchStartY.current = event.touches[0].clientY
    setPullDistance(0)
  }

  const handleTouchMove = (event: React.TouchEvent<HTMLDivElement>) => {
    if (touchStartY.current === null || window.scrollY > 0 || isRefreshing) return

    const currentY = event.touches[0].clientY
    const delta = currentY - touchStartY.current

    if (delta > 0) {
      const nextPull = Math.min(delta * 0.8, 120)
      setPullDistance(nextPull)
      if (nextPull > 80) {
        event.preventDefault()
      }
    }
  }

  const handleTouchEnd = () => {
    if (pullDistance >= 80 && !isRefreshing) {
      refreshDashboardData()
    }

    touchStartY.current = null
    setPullDistance(0)
  }
  
  // State pour la plage de dates
  const [dateRange, setDateRange] = useState<{startDate: Date, endDate: Date}>({
    startDate: startOfDay(subDays(new Date(), 6)),
    endDate: endOfDay(new Date())
  })

  // Handler pour le changement de date range
  const handleDateRangeChange = useCallback((startDate: Date, endDate: Date) => {
    setDateRange({ startDate, endDate })
   }, [])

  // Calculate usage percentage
  const usagePercent = totalLimit > 0 ? (totalSent / totalLimit) * 100 : 0

  return (
    <Container
      size="full"
      px="md"
      py="md"
      className="bg-slate-50/10"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{ touchAction: 'pan-y' }}
    >
      <div
      className='-mt-8'
        style={{
          height: 28,
          display: 'flex',
          alignItems: 'center',
          visibility:'hidden',
          justifyContent: 'center',
          fontSize: 12,
          color: 'var(--mantine-color-dimmed)',
          opacity: pullDistance > 0 ? 1 : 0,
          transform: `translateY(${Math.min(pullDistance / 2, 12)}px)`,
          transition: 'opacity 0.15s ease, transform 0.15s ease',
          userSelect: 'none',
        }}
      >
        {isRefreshing ? t('refreshing') : pullDistance >= 80 ? t('release_to_refresh') : t('pull_to_refresh')}
      </div>

      <PageHeader
        title={`${t('welcome_back')}, ${session?.user?.firstName || session?.user?.name?.split(' ')[0] || 'there'}`}
        subtitle={t('ready_to_send_emails')}
        onDateRangeChange={handleDateRangeChange}
      />

      {/* Mobile KPIs - Only visible on mobile */}
      <Stack gap="xs" mt="md" hiddenFrom="md">
        {/* Email Limit Card */}
        <Card withBorder p="sm" radius="md">
          <Stack gap="xs">
            <Group justify="space-between">
              <Text size="xs" fw={500} c="dimmed">{t('daily_email_limit')}</Text>
              <Badge size="xs" color={usagePercent < 80 ? 'green' : usagePercent < 95 ? 'orange' : 'red'} variant="light">
                {usagePercent < 80 ? t('good') : usagePercent < 95 ? t('warning') : t('critical')}
              </Badge>
            </Group>
            <Group justify="space-between">
              <Text size="lg" fw={700}>{totalSent} / {totalLimit}</Text>
              <Text size="xs" c="dimmed">{usagePercent.toFixed(0)}%</Text>
            </Group>
            <Progress value={usagePercent} size="sm" radius="xl" color={usagePercent < 80 ? 'blue' : usagePercent < 95 ? 'orange' : 'red'} />
          </Stack>
        </Card>

        {/* Quick Actions */}
        <Card withBorder p="sm" radius="md">
          <Text size="xs" fw={500} c="dimmed" mb="xs">{t('quick_actions')}</Text>
          <Grid >
            <Grid.Col span={6}>
              <Button 
                variant="light" 
                fullWidth 
                size="xs" 
                leftSection={<IconSend size={14} />}
                onClick={() => navigate({ to: '/dashboard/mails/new' })}
              >
                {t('send_email')}
              </Button>
            </Grid.Col>
            <Grid.Col span={6}>
              <Button 
                variant="light" 
                fullWidth 
                size="xs" 
                leftSection={<IconTemplate size={14} />}
                onClick={() => navigate({ to: '/dashboard/templates/new' })}
              >
                {t('new_template')}
              </Button>
            </Grid.Col>
            <Grid.Col span={6}>
              <Button 
                variant="light" 
                fullWidth 
                size="xs" 
                leftSection={<IconMail size={14} />}
                onClick={() => navigate({ to: '/dashboard/mails' })}
              >
                {t('email_history')}
              </Button>
            </Grid.Col>
            <Grid.Col span={6}>
              <Button 
                variant="light" 
                fullWidth 
                size="xs" 
                leftSection={<IconCalendar size={14} />}
                onClick={() => navigate({
                  to: '/dashboard/settings',
                  search: { section: 'mailboxes' },
                })}
              >
                {t('link_your_email')}
              </Button>
            </Grid.Col>
          </Grid>
        </Card>
      </Stack>
      
      <Grid mt="md">
        {/* Sidebar - Hidden on mobile, shown on md+ screens */}
        <Grid.Col span={{ base: 12, md: 3, lg: 2.5 }} visibleFrom="md">
          <Sidebar
            mailboxes={mailboxes.map(mb => ({
              email: mb.email,
              score: mb.score
            }))}
            onQuickAction={(key) => console.log('Quick action:', key)}
          />
        </Grid.Col>

        {/* Main content - Full width on mobile, adjusted on larger screens */}
        <Grid.Col span={{ base: 12, md: 9, lg: 9.5 }}>
          <div className="flex flex-col gap-2">
            <EmailActivityOverview dateRange={dateRange} refreshKey={trackingRefreshKey} />
            <RecentCampaigns dateRange={dateRange} refreshKey={trackingRefreshKey} />
          </div>
        </Grid.Col>
      </Grid>
    </Container>
  )
}