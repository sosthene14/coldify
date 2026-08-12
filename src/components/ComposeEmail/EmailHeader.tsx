// components/EmailHeader.tsx
import { Group, Button, Text } from '@mantine/core'
import { IconArrowLeft } from '@tabler/icons-react'
import { useNavigate } from '@tanstack/react-router'

interface EmailHeaderProps {
  editingId: string | null
}

export function EmailHeader({ editingId }: EmailHeaderProps) {
  const navigate = useNavigate()

  return (
    <>
      <Group>
        <Button
          variant="subtle"
          leftSection={<IconArrowLeft size={16} />}
          onClick={() => navigate({ to: '/dashboard/mails' })}
        >
          Back to Emails
        </Button>
      </Group>

      <div>
        <Text size="xl" fw={700}>
          {editingId ? 'Edit Scheduled Email' : 'Compose Email'}
        </Text>
        <Text size="sm" c="dimmed">
          {editingId 
            ? 'Update your scheduled email' 
            : 'Send or schedule emails from your connected mailboxes'}
        </Text>
      </div>
    </>
  )
}