import { Card, Stack, Group, Text, Progress, SimpleGrid, Paper, RingProgress, Center } from '@mantine/core'
import { IconSend } from '@tabler/icons-react'
import type { QuotaStats } from '../../services/quota.service'

interface QuotaDisplayProps {
  stats: QuotaStats
  compact?: boolean
}

export function QuotaDisplay({ stats, compact = false }: QuotaDisplayProps) {
  const dailyPercentage = (stats.dailyUsed / stats.dailyLimit) * 100
  const dailyColor = dailyPercentage >= 90 ? 'red' : dailyPercentage >= 70 ? 'orange' : 'blue'

  if (compact) {
    return (
      <Paper p="sm" withBorder>
        <Group justify="space-between" mb="xs">
          <Text size="xs" c="dimmed">Quota quotidien</Text>
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
            <Text size="md" fw={600}>Quota d'envoi global</Text>
            <Text size="xs" c="dimmed">Limite partagée entre toutes vos boîtes mail</Text>
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
            <Text size="xs" c="dimmed" mb={4}>Aujourd'hui</Text>
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
              <Text size="xs" c="dimmed" mb={4}>Ce mois</Text>
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
            <Text size="xs" c="dimmed" mb={4}>Total historique</Text>
            <Text size="xl" fw={600}>{stats.totalSent.toLocaleString()}</Text>
            <Text size="xs" c="dimmed" mt="xs">emails envoyés</Text>
          </Paper>
        </SimpleGrid>
      </Stack>
    </Card>
  )
}
