import { useState, useEffect } from 'react'
import { Card, Group, Text, Select, Box, Skeleton, Stack, SegmentedControl } from '@mantine/core'
import { LineChart } from '@mantine/charts'
import { IconMail, IconEye, IconTrendingUp } from '@tabler/icons-react'
import axios from 'axios'
import { format, subDays, startOfDay, endOfDay } from 'date-fns'
import { useTranslation } from 'react-i18next'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

interface EmailActivityData {
  date: string
  sent: number
  opened: number
}

interface EmailStats {
  totalSent: number
  totalOpened: number
  totalUniqueOpened: number
  openRate: number
  chartData: EmailActivityData[]
}

const series = [
  { name: 'sent', label: 'emails_sent', color: 'blue.6' },
  { name: 'opened', label: 'emails_opened', color: 'green.6' },
]

interface DateRange {
  startDate: Date
  endDate: Date
}

interface EmailActivityOverviewProps {
  dateRange?: DateRange
  refreshKey?: number
}

// Hook pour récupérer les données d'activité email
function useEmailActivity(days: number, dateRange?: DateRange, refreshKey?: number): EmailStats & { loading: boolean } {
  const [data, setData] = useState<EmailStats>({
    totalSent: 0,
    totalOpened: 0,
    totalUniqueOpened: 0,
    openRate: 0,
    chartData: []
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchEmailActivity = async () => {
      setLoading(true)
      try {
        // Récupérer les emails envoyés
        const response = await axios.get(`${API_URL}/email-history`, { 
          withCredentials: true 
        })

        const sentEmails = Array.isArray(response.data?.data) 
          ? response.data.data 
          : (Array.isArray(response.data) ? response.data : [])

        // Utiliser la date range fournie ou les derniers X jours par défaut
        const endDate = dateRange?.endDate || new Date()
        const startDate = dateRange?.startDate || subDays(endDate, days - 1)
        const daysDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1
        
        // Filtrer les emails dans la plage de dates
        const filteredEmails = sentEmails.filter((email: any) => {
          const emailDate = email.sentAt ? new Date(email.sentAt) : null
          return emailDate && emailDate >= startDate && emailDate <= endDate
        })

        // Créer les données pour le graphique
        const chartData: EmailActivityData[] = []
        
        for (let i = daysDiff - 1; i >= 0; i--) {
          const currentDate = subDays(endDate, i)
          const dateKey = format(currentDate, 'MMM d')
          const dayStart = startOfDay(currentDate)
          const dayEnd = endOfDay(currentDate)

          // Compter les emails envoyés ce jour
          const sentThisDay = filteredEmails.filter((email: any) => {
            const emailDate = email.sentAt ? new Date(email.sentAt) : null
            return emailDate && emailDate >= dayStart && emailDate <= dayEnd && email.status === 'sent'
          }).length

          // Compter toutes les ouvertures totales de la journée, y compris les réouvertures
          const openedThisDay = filteredEmails.reduce((sum: number, email: any) => {
            const openDate = email.firstOpenedAt ? new Date(email.firstOpenedAt) : null
            if (!openDate || openDate < dayStart || openDate > dayEnd) {
              return sum
            }

            return sum + (email.totalOpens || 0)
          }, 0)

          chartData.push({
            date: dateKey,
            sent: sentThisDay,
            opened: openedThisDay
          })
        }

        // Calculer les totaux pour la période sélectionnée : total de toutes les ouvertures réelles
        const totalSent = filteredEmails.filter((e: any) => e.status === 'sent').length
        const totalOpened = filteredEmails.reduce((sum: number, email: any) => sum + (email.totalOpens || 0), 0)
        const totalUniqueOpened = filteredEmails.filter((e: any) => (e.uniqueOpens || 0) > 0).length
        const openRate = totalSent > 0 ? Math.round((totalOpened / totalSent) * 100) : 0

        setData({
          totalSent,
          totalOpened,
          totalUniqueOpened,
          openRate,
          chartData
        })
      } catch (error) {
        console.error('Failed to fetch email activity:', error)
        // Données par défaut en cas d'erreur
        setData({
          totalSent: 0,
          totalOpened: 0,
          totalUniqueOpened: 0,
          openRate: 0,
          chartData: []
        })
      } finally {
        setLoading(false)
      }
    }

    fetchEmailActivity()
  }, [
    days, 
    dateRange?.startDate ? dateRange.startDate.getTime() : null, 
    dateRange?.endDate ? dateRange.endDate.getTime() : null,
    refreshKey
  ])

  return { ...data, loading }
}

export function EmailActivityOverview({ dateRange, refreshKey }: EmailActivityOverviewProps) {
  const { t } = useTranslation()
  const [selectedPeriod, setSelectedPeriod] = useState('7')
  const [openMode, setOpenMode] = useState<'total' | 'unique'>('total')
  const days = parseInt(selectedPeriod)
  const { totalSent, totalOpened, totalUniqueOpened, chartData, loading } = useEmailActivity(days, dateRange, refreshKey)

  const periodOptions = [
    { value: '7', label: t('last_7_days') },
    { value: '14', label: t('last_14_days') },
    { value: '30', label: t('last_30_days') }
  ]

  const openModeOptions = [
    { value: 'total', label: t('total_opens') },
    { value: 'unique', label: t('unique_opens') }
  ]

  const activeOpenedCount = openMode === 'total' ? totalOpened : totalUniqueOpened
  const activeOpenRate = openMode === 'total'
    ? (totalSent > 0 ? Math.round((totalOpened / totalSent) * 100) : 0)
    : (totalSent > 0 ? Math.round((totalUniqueOpened / totalSent) * 100) : 0)

  if (loading) {
    return (
      <Card withBorder radius="md" p={{ base: 'sm', sm: 'md', md: 'lg' }} bg="white" className="w-full">
        <Group justify="space-between" align="center" mb={{ base: 'sm', sm: 'md' }}>
          <Skeleton height={16} width={150} radius="sm" />
          <Skeleton height={28}  radius="sm" />
        </Group>

        <Group mb={{ base: 'sm', sm: 'md' }} gap="lg">
          <Skeleton height={14} width={72} radius="sm" />
          <Skeleton height={14} width={112} radius="sm" />
        </Group>

        <Group mb="sm" gap="md">
          <Skeleton height={12} width={82} radius="sm" />
          <Skeleton height={12} width={92} radius="sm" />
        </Group>

        <Skeleton   radius="sm" />
      </Card>
    )
  }

  return (
    <Card withBorder radius="md" p={{ base: 'sm', sm: 'md', md: 'lg' }} bg="white" className="w-full">
      <Group justify="space-between" align="center" mb={{ base: 'sm', sm: 'md' }}>
        <Text fw={600} size="sm" c="dark.7">
          {t('email_activity_overview')}
        </Text>

        <Group gap="xs">
          <SegmentedControl
            size="xs"
            value={openMode}
            onChange={(value) => setOpenMode((value as 'total' | 'unique') || 'total')}
            data={openModeOptions}
            radius="md"
          />
          <Select
            size="xs"
            data={periodOptions}
            value={selectedPeriod}
            onChange={(value) => setSelectedPeriod(value || '7')}
            w={{ base: 120, sm: 140 }}
            radius="sm"
          />
        </Group>
      </Group>

      {/* Stats rapides */}
      <Group  mb={{ base: 'sm', sm: 'md' }} wrap="wrap">
        <Group gap={6}>
          <IconMail size={14} color="var(--mantine-color-blue-6)" />
          <Text size="xs" c="dimmed">
            {t('sent_count', { count: totalSent })}
          </Text>
        </Group>
        <Group gap={6}>
          <IconEye size={14} color="var(--mantine-color-green-6)" />
          <Text size="xs" c="dimmed">
            {t('opened_count', { count: activeOpenedCount, rate: activeOpenRate })}
          </Text>
        </Group>
      </Group>

      {/* Légende du graphique */}
      <Group  mb="sm">
        {series.map((s) => (
          <Group key={s.name} gap={6}>
            <Box
              w={8}
              h={8}
              style={{ 
                borderRadius: 2, 
                backgroundColor: `var(--mantine-color-${s.color.replace('.', '-')})` 
              }}
            />
            <Text size="xs" c="dimmed">
              {t(s.label)}
            </Text>
          </Group>
        ))}
      </Group>

      {/* Graphique */}
      {chartData.length > 0 ? (
        <LineChart
          h={{ base: 180, sm: 220 }}
          data={chartData}
          dataKey="date"
          series={series}
          curveType="monotone"
          withDots
          dotProps={{ r: 3, strokeWidth: 0 }}
          activeDotProps={{ r: 4 }}
          strokeWidth={2}
          gridAxis="y"
          withYAxis
          withXAxis
          yAxisProps={{ 
            tickFormatter: (v: number) => v >= 1000 ? `${Math.round(v / 1000)}K` : `${v}` 
          }}
          tickLine="none"
          withLegend={false}
          withTooltip
          tooltipProps={{
            content: ({ payload, label }) => {
              if (!payload || payload.length === 0) return null
              
              return (
                <Card withBorder p="xs" shadow="md">
                  <Text size="sm" fw={500} mb="xs">{label}</Text>
                  <Stack gap="xs">
                    {payload.map((item: any) => (
                      <Group key={item.dataKey} gap="xs">
                        <Box
                          w={8}
                          h={8}
                          style={{ 
                            borderRadius: 2, 
                            backgroundColor: item.color 
                          }}
                        />
                        <Text size="xs" c="dimmed">
                          {t(series.find(s => s.name === item.dataKey)?.label || '')}: {item.value}
                        </Text>
                      </Group>
                    ))}
                  </Stack>
                </Card>
              )
            }
          }}
        />
      ) : (
        <Group justify="center" py={{ base: 'md', sm: 'xl' }}>
          <Stack align="center" gap="xs">
            <IconTrendingUp size={32} color="var(--mantine-color-gray-5)" />
            <Text size="sm" c="dimmed">{t('no_email_activity')}</Text>
            <Text size="xs" c="dimmed">{t('start_sending_emails')}</Text>
          </Stack>
        </Group>
      )}
    </Card>
  )
}