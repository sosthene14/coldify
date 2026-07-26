import { Group, Stack, Text, Title } from '@mantine/core'
import { DateRangeButton } from './DateRangeButton'
import { NewCampaignButton } from './NewCampaignButton'

interface PageHeaderProps {
  title: string
  subtitle?: string
  onNewCampaign?: () => void
}

export function PageHeader({ title, subtitle, onNewCampaign }: PageHeaderProps) {
  return (
    <Group justify="space-between" align="center"  wrap="nowrap">
      <Stack gap={2}>
        <Title order={3} fw={700}>
          {title}
        </Title>
        {subtitle && (
          <Text size="sm" c="dimmed">
            {subtitle}
          </Text>
        )}
      </Stack>

      <Group gap="sm" wrap="nowrap">
        <DateRangeButton />
        <NewCampaignButton onCreate={onNewCampaign} />
      </Group>
    </Group>
  )
}