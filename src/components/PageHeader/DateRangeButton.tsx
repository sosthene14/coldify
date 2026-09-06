import { DatePickerInput } from '@mantine/dates'
import { IconCalendar } from '@tabler/icons-react'
import { useState, useEffect } from 'react'
import { subDays, startOfDay, endOfDay } from 'date-fns'
import { useTranslation } from 'react-i18next'

interface DateRangeButtonProps {
  onDateRangeChange?: (startDate: Date, endDate: Date) => void
  defaultRange?: [string | null, string | null]
}

export function DateRangeButton({ onDateRangeChange, defaultRange }: DateRangeButtonProps) {
  const { t, i18n } = useTranslation()

  const getDefaultRange = (): [Date | null, Date | null] => {
    const endDate = endOfDay(new Date())
    const startDate = startOfDay(subDays(endDate, 6))
    return [startDate, endDate]
  }

  const getParsedDefaultRange = (): [Date | null, Date | null] => {
    if (!defaultRange) {
      return getDefaultRange()
    }

    return [
      defaultRange[0] ? startOfDay(new Date(defaultRange[0])) : null,
      defaultRange[1] ? endOfDay(new Date(defaultRange[1])) : null,
    ]
  }

  const [value, setValue] = useState<[Date | null, Date | null]>(getParsedDefaultRange())

  const handleChange = (newValue: any) => {
    if (Array.isArray(newValue)) {
      // Convertir les strings en objets Date
      const converted: [Date | null, Date | null] = [
        newValue[0] ? (newValue[0] instanceof Date ? newValue[0] : new Date(newValue[0])) : null,
        newValue[1] ? (newValue[1] instanceof Date ? newValue[1] : new Date(newValue[1])) : null,
      ]
      setValue(converted)
    } else {
      setValue(newValue)
    }
  }


  useEffect(() => {
    if (value[0] && value[1] && onDateRangeChange) {
      const startDate = startOfDay(value[0])
      const endDate = endOfDay(value[1])
      onDateRangeChange(startDate, endDate)
    }
  }, [
    value[0] instanceof Date ? value[0].getTime() : null,
    value[1] instanceof Date ? value[1].getTime() : null,
    onDateRangeChange
  ])

  return (
    <DatePickerInput<'range'>
      type="range"
      locale={i18n.language}
      value={value}
      onChange={handleChange}
      valueFormat="MMM D"
      leftSectionPointerEvents="none"
      rightSection={<IconCalendar size={16} color="var(--mantine-color-gray-6)" />}
      radius="sm"
      w={190}
      placeholder={t('select_date_range')}
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
  const { t } = useTranslation()
  const [value, setValue] = useState<[Date | null, Date | null]>([
    startOfDay(subDays(new Date(), 6)),
    endOfDay(new Date())
  ])

 

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
        //@ts-ignore mismatch type
        onChange={setValue}
        valueFormat="MMM D"
        leftSectionPointerEvents="none"
        rightSection={<IconCalendar size={16} color="var(--mantine-color-gray-6)" />}
        radius="sm"
        w={190}
        placeholder={t('select_date_range')}
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