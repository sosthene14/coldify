import { Group, Paper, Progress, Text } from '@mantine/core'

interface EmailLimitCardProps {
  sent: number
  limit: number
}

export function EmailLimitCard({ sent, limit }: EmailLimitCardProps) {
  const percent = Math.round((sent / limit) * 100)

  return (
    <Paper withBorder radius="sm" p="sm">
      <Text size="sm" fw={600} mb="sm">
        Email sending limit
      </Text>

      <Text size="sm" c="dimmed" mb={6}>
        Daily limit
      </Text>

      <Progress value={percent} color="blue" size="sm" radius="xl" mb={6} />

      <Group justify="space-between">
        <Text size="sm" fw={500}>
          {sent.toLocaleString('en-US')} / {limit.toLocaleString('en-US')}
        </Text>
        <Text size="sm" c="dimmed">
          {percent}%
        </Text>
      </Group>
    </Paper>
  )
}