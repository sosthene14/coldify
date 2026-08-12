// components/EmailActions.tsx
import { Group, Button } from '@mantine/core'
import { IconSend, IconClock } from '@tabler/icons-react'

interface EmailActionsProps {
  sending: boolean
  disabled: boolean
  scheduledAt: Date | null
  onSend: () => void
  onClear: () => void
}

export function EmailActions({
  sending,
  disabled,
  scheduledAt,
  onSend,
  onClear,
}: EmailActionsProps) {
  return (
    <Group justify="flex-end" mt="md">
      <Button variant="default" onClick={onClear}>
        Clear
      </Button>
      <Button
        leftSection={scheduledAt ? <IconClock size={16} /> : <IconSend size={16} />}
        onClick={onSend}
        loading={sending}
        disabled={disabled}
      >
        {scheduledAt ? 'Schedule Email' : 'Send Now'}
      </Button>
    </Group>
  )
}