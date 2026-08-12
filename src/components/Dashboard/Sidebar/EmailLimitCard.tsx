import { Group, Paper, Progress, Text, Tooltip, Badge } from '@mantine/core'
import { IconInfoCircle } from '@tabler/icons-react'
import { useQuotaStore } from '../../../stores/quota.store'
import { useEffect } from 'react'

export function EmailLimitCard() {
  const { stats, loading, fetchStats } = useQuotaStore()

  useEffect(() => {
    fetchStats()
  }, [fetchStats])

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
    if (percentage >= 90) return 'Critical'
    if (percentage >= 70) return 'Warning'
    return 'Good'
  }

  const color = getColor(percent)
  const status = getStatus(percent)

  if (loading) {
    return (
      <Paper withBorder radius="sm" p="sm">
        <Text size="sm" fw={600} mb="sm">
          Email sending limit
        </Text>
        <Text size="sm" c="dimmed" ta="center" py="md">
          Loading...
        </Text>
      </Paper>
    )
  }

  return (
    <Paper withBorder radius="sm" p="sm">
      <Group justify="space-between" align="center" mb="sm">
        <Text size="sm" fw={600}>
          Email sending limit
        </Text>
        <Tooltip 
          label={`Daily email sending limit for your organization. Shared across all mailboxes. Resets every 24 hours.`}
          multiline
          width={200}
        >
          <IconInfoCircle size={14} color="var(--mantine-color-gray-6)" style={{ cursor: 'help' }} />
        </Tooltip>
      </Group>

      <Group justify="space-between" align="center" mb={6}>
        <Text size="sm" c="dimmed">
          Daily limit (global)
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
        animate={percent > 0}
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
          No quota configured
        </Text>
      )}

      {percent >= 90 && (
        <Text size="xs" c="red" ta="center" mt="xs">
          ⚠️ Approaching daily limit
        </Text>
      )}

    
    </Paper>
  )
}