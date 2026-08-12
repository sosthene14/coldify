import { useState, useEffect, useCallback } from 'react'
import { useSession } from "#/lib/auth-client.ts";
import { PageHeader } from "../PageHeader";
import { ActivitySidebar } from "./activity-feed";
import { EmailActivityOverview } from "./email-activity-overview";
import { RecentCampaigns } from "./recent-campaigns";
import { Sidebar } from "./Sidebar";
import { TopPerformingCampaigns } from "./top-performing-campaigns";
import { subDays, startOfDay, endOfDay } from 'date-fns'
import axios from 'axios'
import { Grid, Container, Card, Stack, Group, Text, Progress, Badge, Button } from '@mantine/core'
import { IconMail, IconSend, IconCalendar, IconTemplate } from '@tabler/icons-react'
import { useNavigate } from '@tanstack/react-router'

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
        const response = await axios.get(`${API_URL}/mailboxes`, {
          withCredentials: true
        })

        const mailboxes = response.data || []
        
        const mailboxData: MailboxData[] = mailboxes
          .filter((mb: any) => mb.status === 'connected')
          .map((mb: any) => ({
            email: mb.email,
            score: calculateHealthScore(mb),
            dailySent: mb.dailySent || 0,
            dailyLimit: mb.dailyLimit || 0,
            status: mb.status
          }))

        const totalSent = mailboxData.reduce((sum, mb) => sum + mb.dailySent, 0)
        const totalLimit = mailboxData.reduce((sum, mb) => sum + mb.dailyLimit, 0)

        setData({
          totalSent,
          totalLimit,
          mailboxes: mailboxData
        })
      } catch (error) {
        console.error('Failed to fetch email limit data:', error)
        // Fallback data en cas d'erreur
        setData({
          totalSent: 0,
          totalLimit: 100, // Limite par défaut
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
  const {data: session} = useSession()
  const { totalSent, totalLimit, mailboxes, loading } = useEmailLimitData()
  const navigate = useNavigate()
  
  // State pour la plage de dates
  const [dateRange, setDateRange] = useState<{startDate: Date, endDate: Date}>({
    startDate: startOfDay(subDays(new Date(), 6)), // 7 derniers jours
    endDate: endOfDay(new Date())
  })

  // Handler pour le changement de date range
  const handleDateRangeChange = useCallback((startDate: Date, endDate: Date) => {
    setDateRange({ startDate, endDate })
    console.log('Date range changed:', { startDate, endDate })
  }, [])

  // Calculate usage percentage
  const usagePercent = totalLimit > 0 ? (totalSent / totalLimit) * 100 : 0

  return (
    <Container size="full" px="md" py="md" className="bg-slate-50/10">
      <PageHeader
        title={`Welcome back, ${session?.user?.firstName || session?.user?.name?.split(' ')[0] || 'there'}`}
        subtitle="Prêt à envoyer de nouveaux mails ?"
        onDateRangeChange={handleDateRangeChange}
      />

      {/* Mobile KPIs - Only visible on mobile */}
      <Stack gap="xs" mt="md" hiddenFrom="md">
        {/* Email Limit Card */}
        <Card withBorder p="sm" radius="md">
          <Stack gap="xs">
            <Group justify="space-between">
              <Text size="xs" fw={500} c="dimmed">Daily email limit</Text>
              <Badge size="xs" color={usagePercent < 80 ? 'green' : usagePercent < 95 ? 'orange' : 'red'} variant="light">
                {usagePercent < 80 ? 'Good' : usagePercent < 95 ? 'Warning' : 'Critical'}
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
          <Text size="xs" fw={500} c="dimmed" mb="xs">Quick actions</Text>
          <Grid gutter="xs">
            <Grid.Col span={6}>
              <Button 
                variant="light" 
                fullWidth 
                size="xs" 
                leftSection={<IconSend size={14} />}
                onClick={() => navigate({ to: '/dashboard/mails/new' })}
              >
                Send email
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
                New template
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
                Email History
              </Button>
            </Grid.Col>
            <Grid.Col span={6}>
              <Button 
                variant="light" 
                fullWidth 
                size="xs" 
                leftSection={<IconCalendar size={14} />}
                onClick={() => navigate({ to: '/dashboard/settings?section=mailboxes' })}
              >
                Liez votre email
              </Button>
            </Grid.Col>
          </Grid>
        </Card>
      </Stack>
      
      <Grid mt="md" gutter="md">
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
            <EmailActivityOverview dateRange={dateRange} />
            <RecentCampaigns dateRange={dateRange} />
          </div>
        </Grid.Col>
      </Grid>
    </Container>
  )
}