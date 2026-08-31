// components/ScheduleSection.tsx
import { DateTimePicker } from '@mantine/dates'
import { Text, Group, Badge } from '@mantine/core'
import { IconClock } from '@tabler/icons-react'
import { useTranslation } from 'react-i18next'

interface ScheduleSectionProps {
  scheduledAt: Date | null
  onChange: (value: Date | null) => void
}

export function ScheduleSection({ scheduledAt, onChange }: ScheduleSectionProps) {
  const { t } = useTranslation()
  
  // Get user's timezone
  const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone

  const handleChange = (value: string | null) => {
    onChange(value ? new Date(value) : null)
  }

  return (
    <>
      <DateTimePicker
        label={t('schedule_later_optional')}
        placeholder={t('send_immediately')}
        value={scheduledAt}
        onChange={handleChange}
        minDate={new Date()}
        clearable
      />
      {scheduledAt && (
        <Group gap="xs">
          <IconClock size={14} color="var(--mantine-color-blue-6)" />
          <Text size="xs" c="dimmed">
            {t('timezone')}: 
          </Text>
          <Badge size="xs" variant="light" color="blue">
            {userTimezone}
          </Badge>
        </Group>
      )}
    </>
  )
}