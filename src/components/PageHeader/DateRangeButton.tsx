import { DatePickerInput } from '@mantine/dates'
import { IconCalendar } from '@tabler/icons-react'
import { useState } from 'react'

export function DateRangeButton() {
  const [value, setValue] = useState<[Date | null, Date | null]>([
    new Date(2025, 4, 7),
    new Date(2025, 4, 13),
  ])

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
      styles={{
        input: {
          fontWeight: 500,
          borderColor: 'var(--mantine-color-gray-3)',
        },
      }}
    />
  )
}

// Alternative si tu préfères un simple bouton qui ouvre un popover
// plutôt qu'un input cliquable — décommente et adapte selon le besoin.
// export function DateRangeButton() {
//   return (
//     <Button variant="default" radius="md" rightSection={<IconCalendar size={16} />}>
//       May 7 – May 13, 2025
//     </Button>
//   )
// }