import { ActionIcon, Indicator } from '@mantine/core'
import { IconBell } from '@tabler/icons-react'

interface NotificationBellProps {
  count?: number
  onClick?: () => void
}

export function NotificationBell({ count = 0, onClick }: NotificationBellProps) {
  return (
    <Indicator
      label={count}
      size={16}
      color="blue"
      disabled={count === 0}
      offset={4}
    >
      <ActionIcon variant="subtle" color="gray" size="lg" radius="md" onClick={onClick}>
        <IconBell size={18} />
      </ActionIcon>
    </Indicator>
  )
}