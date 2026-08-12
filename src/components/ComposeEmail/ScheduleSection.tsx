// components/ScheduleSection.tsx
import { DateTimePicker } from '@mantine/dates'

interface ScheduleSectionProps {
  scheduledAt: Date | null
  onChange: (value: Date | null) => void
}

export function ScheduleSection({ scheduledAt, onChange }: ScheduleSectionProps) {
  const handleChange = (value: string | null) => {
    onChange(value ? new Date(value) : null)
  }

  return (
    <DateTimePicker
      label="Schedule for later (optional)"
      placeholder="Send immediately if not set"
      value={scheduledAt}
      onChange={handleChange}
      minDate={new Date()}
      clearable
    />
  )
}