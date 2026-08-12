import { DatePickerInput } from '@mantine/dates'
import { IconCalendar } from '@tabler/icons-react'
import { useState, useEffect } from 'react'
import { subDays, startOfDay, endOfDay,format } from 'date-fns'

interface DateRangeButtonProps {
  onDateRangeChange?: (startDate: Date, endDate: Date) => void
  defaultRange?: [Date | null, Date | null]
}


interface DateRangeButtonProps {
  onDateRangeChange?: (startDate: Date, endDate: Date) => void
  defaultRange?: [string | null, string | null]
}

export function DateRangeButton({ onDateRangeChange, defaultRange }: DateRangeButtonProps) {
  const getDefaultRange = (): [string, string] => {
    const endDate = endOfDay(new Date())
    const startDate = startOfDay(subDays(endDate, 6))
    return [format(startDate, 'yyyy-MM-dd'), format(endDate, 'yyyy-MM-dd')]
  }

  const [value, setValue] = useState<[string | null, string | null]>(
    defaultRange || getDefaultRange()
  )

  useEffect(() => {
    if (value[0] && value[1] && onDateRangeChange) {
      const startDate = startOfDay(new Date(value[0]))
      const endDate = endOfDay(new Date(value[1]))
      onDateRangeChange(startDate, endDate)
    }
  }, [value[0], value[1], onDateRangeChange])

  return (
    <DatePickerInput
      type="range"
      value={value}
      onChange={setValue}
      valueFormat="MMM D"
      leftSectionPointerEvents="none"
      rightSection={<IconCalendar size={16} color="var(--mantine-color-gray-6)" />}
      radius="sm"
      w={190}
      placeholder="Select date range"
      clearable
      maxDate={new Date()}
      styles={{
        input: {
          fontWeight: 500,
          borderColor: 'var(--mantine-color-gray-3)',
          cursor: 'pointer',
        },
      }}
      popoverProps={{
        position: 'bottom-end',
        withArrow: true,
        shadow: 'md',
      }}
    />
  )
}
// Version alternative avec boutons de raccourcis
export function DateRangeButtonWithPresets({ onDateRangeChange }: DateRangeButtonProps) {
  const [value, setValue] = useState<[Date | null, Date | null]>([
    startOfDay(subDays(new Date(), 6)),
    endOfDay(new Date())
  ])

  const presets = [
    {
      label: 'Last 7 days',
      value: [startOfDay(subDays(new Date(), 6)), endOfDay(new Date())] as [Date, Date]
    },
    {
      label: 'Last 30 days', 
      value: [startOfDay(subDays(new Date(), 29)), endOfDay(new Date())] as [Date, Date]
    },
    {
      label: 'Last 90 days',
      value: [startOfDay(subDays(new Date(), 89)), endOfDay(new Date())] as [Date, Date]
    }
  ]

  const applyPreset = (presetValue: [Date, Date]) => {
    setValue(presetValue)
    if (onDateRangeChange) {
      onDateRangeChange(presetValue[0], presetValue[1])
    }
  }

  useEffect(() => {
    if (value[0] && value[1] && onDateRangeChange) {
      onDateRangeChange(startOfDay(value[0]), endOfDay(value[1]))
    }
  }, [
    value[0] ? value[0].getTime() : null, 
    value[1] ? value[1].getTime() : null, 
    onDateRangeChange
  ])

  return (
    <div style={{ position: 'relative' }}>
      <DatePickerInput
        type="range"
        value={value}
        onChange={setValue}
        valueFormat="MMM D"
        leftSectionPointerEvents="none"
        rightSection={<IconCalendar size={16} color="var(--mantine-color-gray-6)" />}
        radius="sm"
        w={190}
        placeholder="Select date range"
        maxDate={new Date()}
        styles={{
          input: {
            fontWeight: 500,
            borderColor: 'var(--mantine-color-gray-3)',
            cursor: 'pointer',
          },
        }}
        popoverProps={{
          position: 'bottom-end',
          withArrow: true,
          shadow: 'md',
        }}
      />
      
      {/* Raccourcis de périodes (optionnel) */}
      {/* Vous pouvez décommenter ceci si vous voulez des boutons de raccourcis
      <Group gap="xs" mt="xs">
        {presets.map((preset) => (
          <Button
            key={preset.label}
            size="xs"
            variant="light"
            onClick={() => applyPreset(preset.value)}
          >
            {preset.label}
          </Button>
        ))}
      </Group>
      */}
    </div>
  )
}