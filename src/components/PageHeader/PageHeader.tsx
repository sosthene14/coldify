import { Group, Stack, Text, Title } from '@mantine/core'
import { DateRangeButton } from './DateRangeButton'
import { NewCampaignButton } from './NewCampaignButton'

interface PageHeaderProps {
  title: string
  subtitle?: string
  onNewCampaign?: () => void
  onDateRangeChange?: (startDate: Date, endDate: Date) => void
  showDateRange?: boolean
}

export function PageHeader({ 
  title, 
  subtitle, 
  onNewCampaign, 
  onDateRangeChange,
  showDateRange = true 
}: PageHeaderProps) {
  return (
    <Stack gap="sm">
      {/* Desktop layout */}
      <Group justify="space-between" align="center" wrap="nowrap" visibleFrom="sm">
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
          {showDateRange && <DateRangeButton onDateRangeChange={onDateRangeChange} />}
          <NewCampaignButton onCreate={onNewCampaign} />
        </Group>
      </Group>

      {/* Mobile layout */}
      <Stack gap="sm" hiddenFrom="sm">
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

        <Group gap="sm" grow>
          {showDateRange && <DateRangeButton onDateRangeChange={onDateRangeChange} />}
          <NewCampaignButton onCreate={onNewCampaign} />
        </Group>
      </Stack>
    </Stack>
  )
}