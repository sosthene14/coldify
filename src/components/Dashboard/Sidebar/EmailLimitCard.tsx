import { Group, Paper, Progress, Text, Tooltip, Badge } from '@mantine/core'
import { IconInfoCircle } from '@tabler/icons-react'
import { useQuotaStore } from '../../../stores/quota.store'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

export function EmailLimitCard() {
  const { t } = useTranslation()
  const { stats, loading, fetchStats } = useQuotaStore()

  useEffect(() => {
    fetchStats()
  }, [])

  const sent = stats?.dailyUsed || 0
  const limit = stats?.dailyLimit || 0
  const percent = limit > 0 ? Math.round((sent / limit) * 100) : 0
  
  // Déterminer la couleur selon le pourcentage
  const getColor = (percentage: number) => {
    if (percentage >= 90) return 'red'
    if (percentage >= 70) return 'yellow'
    return 'green'
  }

  const getStatus = (percentage: number) => {
    if (percentage >= 90) return t('critical')
    if (percentage >= 70) return t('warning')
    return t('good')
  }

  const color = getColor(percent)
  const status = getStatus(percent)

  if (loading) {
    return (
      <Paper withBorder radius="sm" p="sm">
        <Text size="sm" fw={600} mb="sm">
          {t('email_sending_limit')}
        </Text>
        <Text size="sm" c="dimmed" ta="center" py="md">
          {t('loading')}
        </Text>
      </Paper>
    )
  }

  return (
    <Paper withBorder radius="sm" p="sm">
      <Group justify="space-between" align="center" mb="sm">
        <Text size="sm" fw={600}>
          {t('email_sending_limit')}
        </Text>
        <Tooltip 
          label={t('daily_email_limit_tooltip')}
          multiline
          w={200}
        >
          <IconInfoCircle size={14} color="var(--mantine-color-gray-6)" style={{ cursor: 'help' }} />
        </Tooltip>
      </Group>

      <Group justify="space-between" align="center" mb={6}>
        <Text size="sm" c="dimmed">
          {t('daily_limit_global')}
        </Text>
        <Badge 
          size="xs" 
          variant="light" 
          color={color}
        >
          {status}
        </Badge>
      </Group>

      <Progress 
        value={percent} 
        color={color} 
        size="sm" 
        radius="xl"  
        mb={8}
        animated={percent > 0}
      />

      <Group justify="space-between">
        <Text size="sm" fw={500}>
          {sent.toLocaleString('en-US')} / {limit.toLocaleString('en-US')}
        </Text>
        <Text size="sm" c="dimmed" fw={500}>
          {percent}%
        </Text>
      </Group>

      {limit === 0 && (
        <Text size="xs" c="orange" ta="center" mt="xs">
          {t('no_quota_configured')}
        </Text>
      )}

      {percent >= 90 && (
        <Text size="xs" c="red" ta="center" mt="xs">
          {t('approaching_daily_limit')}
        </Text>
      )}

    
    </Paper>
  )
}