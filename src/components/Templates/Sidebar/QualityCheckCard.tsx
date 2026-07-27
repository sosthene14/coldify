import { Card, Text, Stack, Group } from '@mantine/core'
import { IconCheck, IconAlertTriangle } from '@tabler/icons-react'

export function QualityCheckCard() {
  return (
    <Card withBorder radius="md" p="lg" bg="white">
      <Text size="sm" fw={600} mb="sm">Quality check</Text>
      <Stack gap={8}>
        <Group gap={8}>
          <IconCheck size={14} color="#40C057" />
          <Text size="xs">Personalization variables used</Text>
        </Group>
        <Group gap={8}>
          <IconCheck size={14} color="#40C057" />
          <Text size="xs">Under 150 words</Text>
        </Group>
        <Group gap={8}>
          <IconAlertTriangle size={14} color="#F59F00" />
          <Text size="xs">No clear call-to-action detected</Text>
        </Group>
      </Stack>
    </Card>
  )
}