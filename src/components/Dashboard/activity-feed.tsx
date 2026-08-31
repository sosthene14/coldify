import { useState, useEffect } from 'react'
import { Card, Text, Group, Stack, Loader } from '@mantine/core';
import { useTranslation } from 'react-i18next'
import {
 
  IconTrendingUp,
  IconTrendingDown,
} from '@tabler/icons-react';
import axios from 'axios'
import { subDays } from 'date-fns'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

// ---------- Activity feed ----------
 

type Metric = {
  label: string;
  value: string;
  delta: string;
  positive: boolean;
};

interface PerformanceData {
  emailsSent: {
    current: number
    previous: number
    delta: number
  }
  openRate: {
    current: number
    previous: number
    delta: number
  }
  clickRate: {
    current: number
    previous: number
    delta: number
  }
}

// Hook pour récupérer les données de performance
function usePerformanceData(): PerformanceData & { loading: boolean } {
  const [data, setData] = useState<PerformanceData>({
    emailsSent: { current: 0, previous: 0, delta: 0 },
    openRate: { current: 0, previous: 0, delta: 0 },
    clickRate: { current: 0, previous: 0, delta: 0 },
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPerformanceData = async () => {
      try {
        // Récupérer les emails des 30 derniers jours
        const response = await axios.get(`${API_URL}/email-history`, {
          withCredentials: true
        })

        const emails = Array.isArray(response.data?.data) 
          ? response.data.data 
          : (Array.isArray(response.data) ? response.data : [])

        const now = new Date()
        const last30Days = subDays(now, 30)
        const last60Days = subDays(now, 60)

        // Filtrer les emails par période
        const currentPeriodEmails = emails.filter((email: any) => {
          const emailDate = email.sentAt ? new Date(email.sentAt) : null
          return emailDate && emailDate >= last30Days && email.status === 'sent'
        })

        const previousPeriodEmails = emails.filter((email: any) => {
          const emailDate = email.sentAt ? new Date(email.sentAt) : null
          return emailDate && emailDate >= last60Days && emailDate < last30Days && email.status === 'sent'
        })

        // Calculer les métriques pour la période actuelle
        const currentEmailsSent = currentPeriodEmails.length
        const currentOpenedEmails = currentPeriodEmails.filter((e: any) => (e.totalOpens || 0) > 0).length
        const currentOpenRate = currentEmailsSent > 0 ? (currentOpenedEmails / currentEmailsSent) * 100 : 0

        // Calculer les métriques pour la période précédente
        const previousEmailsSent = previousPeriodEmails.length
        const previousOpenedEmails = previousPeriodEmails.filter((e: any) => (e.totalOpens || 0) > 0).length
        const previousOpenRate = previousEmailsSent > 0 ? (previousOpenedEmails / previousEmailsSent) * 100 : 0

        // Calculer les deltas
        const emailsSentDelta = previousEmailsSent > 0 
          ? ((currentEmailsSent - previousEmailsSent) / previousEmailsSent) * 100 
          : currentEmailsSent > 0 ? 100 : 0

        const openRateDelta = previousOpenRate > 0 
          ? currentOpenRate - previousOpenRate
          : currentOpenRate > 0 ? currentOpenRate : 0

        // Pour le click rate, on utilise une estimation (pas de tracking de clicks)
        const estimatedClickRate = currentOpenRate * 0.15 // Estimation: 15% des ouvertures deviennent des clics
        const previousEstimatedClickRate = previousOpenRate * 0.15
        const clickRateDelta = previousEstimatedClickRate > 0 
          ? estimatedClickRate - previousEstimatedClickRate
          : estimatedClickRate > 0 ? estimatedClickRate : 0

        setData({
          emailsSent: {
            current: currentEmailsSent,
            previous: previousEmailsSent,
            delta: emailsSentDelta
          },
          openRate: {
            current: currentOpenRate,
            previous: previousOpenRate,
            delta: openRateDelta
          },
          clickRate: {
            current: estimatedClickRate,
            previous: previousEstimatedClickRate,
            delta: clickRateDelta
          }
        })
      } catch (error) {
        console.error('Failed to fetch performance data:', error)
        // Données par défaut
        setData({
          emailsSent: { current: 0, previous: 0, delta: 0 },
          openRate: { current: 0, previous: 0, delta: 0 },
          clickRate: { current: 0, previous: 0, delta: 0 },
        })
      } finally {
        setLoading(false)
      }
    }

    fetchPerformanceData()
  }, [])

  return { ...data, loading }
}

function PerformanceSummary() {
  const { t } = useTranslation()
  const { emailsSent, openRate, loading } = usePerformanceData()

  const metrics: Metric[] = [
    { 
      label: t('emails_sent'), 
      value: emailsSent.current.toLocaleString(), 
      delta: `${emailsSent.delta >= 0 ? '+' : ''}${emailsSent.delta.toFixed(1)}%`, 
      positive: emailsSent.delta >= 0 
    },
    { 
      label: t('open_rate'), 
      value: `${openRate.current.toFixed(1)}%`, 
      delta: `${openRate.delta >= 0 ? '+' : ''}${openRate.delta.toFixed(1)}%`, 
      positive: openRate.delta >= 0 
    },
  ]

  if (loading) {
    return (
      <Card withBorder radius="md" p="lg" bg="white">
        <Text fw={600} size="sm" c="dark.7" mb="md">
          {t('performance_summary')}
        </Text>
        <Group justify="center" py="md">
          <Loader size="sm" />
          <Text size="xs" c="dimmed">{t('loading')}</Text>
        </Group>
      </Card>
    )
  }

  return (
    <Card withBorder radius="md" p="lg" bg="white">
      <Group justify="space-between" align="center" mb="md">
        <Text fw={600} size="sm" c="dark.7">
          {t('performance_summary')}
        </Text>
        <Text size="xs" c="dimmed">
          {t('last_30_days')}
        </Text>
      </Group>

      <Stack gap="sm">
        {metrics.map((m) => (
          <Group
            key={m.label}
            justify="space-between"
            align="center"
            className="
              rounded-md
              px-2 py-1
              -mx-2
              transition-colors
              duration-150
              hover:bg-gray-50
              hover:cursor-pointer
            "
          >
            <Text size="sm" c="dimmed">
              {m.label}
            </Text>
            <Group gap={8}>
              <Text size="sm" fw={600} c="dark.7">
                {m.value}
              </Text>
              <Group gap={2}>
                {m.positive ? (
                  <IconTrendingUp size={12} color="var(--mantine-color-green-6)" />
                ) : (
                  <IconTrendingDown size={12} color="var(--mantine-color-red-6)" />
                )}
                <Text size="xs" fw={500} c={m.positive ? 'green.6' : 'red.6'}>
                  {m.delta}
                </Text>
              </Group>
            </Group>
          </Group>
        ))}
      </Stack>
    </Card>
  );
}

 

// ---------- Sidebar ----------

export function ActivitySidebar() {
  return (
    <Stack gap="xs">
     
      <PerformanceSummary />
      {/* <UpcomingSchedule /> */}
    </Stack>
  );
}