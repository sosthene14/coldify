// components/EmailActions.tsx
import { Button, Group, Select } from '@mantine/core'
import { IconClock, IconSend } from '@tabler/icons-react'
import { useTranslation } from 'react-i18next'

interface EmailActionsProps {
  sending: boolean
  disabled: boolean
  isScheduling: boolean
  onSend: () => void
  onModeChange: (isScheduling: boolean) => void
  onClear: () => void
}

export function EmailActions({
  sending,
  disabled,
  isScheduling,
  onSend,
  onModeChange,
  onClear,
}: EmailActionsProps) {
  const { t } = useTranslation()

  return (
    <Group justify="flex-end" mt="md">
      <Button variant="default" onClick={onClear}>
        {t('clear')}
      </Button>
      <Group gap="xs" wrap="wrap">
        <Select
          aria-label={t('send_options')}
          data={[
            { value: 'now', label: t('send_now') },
            { value: 'schedule', label: t('schedule_email') },
          ]}
          value={isScheduling ? 'schedule' : 'now'}
          onChange={(value) => onModeChange(value === 'schedule')}
          disabled={sending || disabled}
          allowDeselect={false}
          w={{ base: 170, sm: 190 }}
        />
        <Button
          leftSection={isScheduling ? <IconClock size={16} /> : <IconSend size={16} />}
          loading={sending}
          disabled={disabled}
          onClick={onSend}
        >
          {isScheduling ? t('schedule_email') : t('send_now')}
        </Button>
      </Group>
    </Group>
  )
}