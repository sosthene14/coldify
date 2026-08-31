// components/EmailHeader.tsx
import { Group, Button, Text } from '@mantine/core'
import { IconArrowLeft } from '@tabler/icons-react'
import { useNavigate } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'

interface EmailHeaderProps {
  editingId: string | null
}

export function EmailHeader({ editingId }: EmailHeaderProps) {
  const { t } = useTranslation()
  const navigate = useNavigate()

  return (
    <>
      <Group>
        <Button
          variant="subtle"
          leftSection={<IconArrowLeft size={16} />}
          onClick={() => navigate({ to: '/dashboard/mails' })}
        >
          {t('back_to_emails')}
        </Button>
      </Group>

      <div>
        <Text size="xl" fw={700}>
          {editingId ? t('edit_scheduled_email') : t('compose_email')}
        </Text>
        <Text size="sm" c="dimmed">
          {editingId 
            ? t('update_scheduled_email') 
            : t('send_schedule_emails')}
        </Text>
      </div>
    </>
  )
}