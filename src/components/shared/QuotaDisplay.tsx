import { Card, Stack, Group, Text, Progress, SimpleGrid, Paper, RingProgress, Center } from '@mantine/core'
import { IconSend } from '@tabler/icons-react'
import { useTranslation } from 'react-i18next'
import type { QuotaStats } from '../../services/quota.service'

interface QuotaDisplayProps {
  stats: QuotaStats
  compact?: boolean
}

export function QuotaDisplay({ stats, compact = false }: QuotaDisplayProps) {
  const { t } = useTranslation()
  const dailyPercentage = (stats.dailyUsed / stats.dailyLimit) * 100
  const dailyColor = dailyPercentage >= 90 ? 'red' : dailyPercentage >= 70 ? 'orange' : 'blue'

  if (compact) {
    return (
      <Paper p="sm" withBorder>
        <Group justify="space-between" mb="xs">
          <Text size="xs" c="dimmed">{t('daily_quota')}</Text>
          <Text size="xs" fw={500}>
            {stats.dailyUsed} / {stats.dailyLimit}
          </Text>
        </Group>
        <Progress value={dailyPercentage} size="sm" radius="xl" color={dailyColor} />
      </Paper>
    )
  }

  return (
    <Card withBorder radius="md" p="lg" bg="white">
      <Stack gap="md">
        <Group justify="space-between">
          <div>
            <Text size="md" fw={600}>{t('global_send_quota')}</Text>
            <Text size="xs" c="dimmed">{t('shared_limit_mailboxes')}</Text>
          </div>
          <Center>
            <RingProgress
              size={80}
              thickness={8}
              sections={[{ value: dailyPercentage, color: dailyColor }]}
              label={
                <Center>
                  <IconSend size={20} stroke={1.5} />
                </Center>
              }
            />
          </Center>
        </Group>

        <SimpleGrid cols={{ base: 1, sm: stats.monthlyLimit ? 3 : 2 }} spacing="md">
          <Paper p="sm" withBorder>
            <Text size="xs" c="dimmed" mb={4}>{t('today')}</Text>
            <Group justify="space-between" align="flex-end">
              <Text size="xl" fw={600}>{stats.dailyUsed}</Text>
              <Text size="xs" c="dimmed">/ {stats.dailyLimit}</Text>
            </Group>
            <Progress 
              value={dailyPercentage} 
              size="xs" 
              radius="xl" 
              color={dailyColor}
              mt="xs"
            />
          </Paper>

          {stats.monthlyLimit && (
            <Paper p="sm" withBorder>
              <Text size="xs" c="dimmed" mb={4}>{t('this_month')}</Text>
              <Group justify="space-between" align="flex-end">
                <Text size="xl" fw={600}>{stats.monthlyUsed}</Text>
                <Text size="xs" c="dimmed">/ {stats.monthlyLimit}</Text>
              </Group>
              <Progress 
                value={(stats.monthlyUsed / (stats.monthlyLimit || 1)) * 100} 
                size="xs" 
                radius="xl" 
                color="cyan"
                mt="xs"
              />
            </Paper>
          )}

          <Paper p="sm" withBorder>
            <Text size="xs" c="dimmed" mb={4}>{t('total_history')}</Text>
            <Text size="xl" fw={600}>{stats.totalSent.toLocaleString()}</Text>
            <Text size="xs" c="dimmed" mt="xs">{t('emails_sent_lowercase')}</Text>
          </Paper>
        </SimpleGrid>
      </Stack>
    </Card>
  )
}