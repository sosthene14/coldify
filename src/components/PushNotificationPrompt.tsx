import { useEffect, useState } from 'react'
import { Button, Group, Modal, Stack, Text } from '@mantine/core'
import { IconBell } from '@tabler/icons-react'
import { useTranslation } from 'react-i18next'
import { usePushNotifications } from '#/hooks/usePushNotifications'

const DISMISSED_KEY = 'push-notification-prompt-dismissed'

interface PushNotificationPromptProps {
  userId: string
}

export function PushNotificationPrompt({ userId }: PushNotificationPromptProps) {
  const { t } = useTranslation()
  const { isSupported, permission, isSubscribed, isLoading, error, subscribe } = usePushNotifications()
  const [opened, setOpened] = useState(false)

  useEffect(() => {
    if (!isSupported || permission !== 'default' || isSubscribed) return
    if (localStorage.getItem(`${DISMISSED_KEY}:${userId}`) === 'true') return
    setOpened(true)
  }, [isSupported, permission, isSubscribed, userId])

  const handleClose = () => {
    localStorage.setItem(`${DISMISSED_KEY}:${userId}`, 'true')
    setOpened(false)
  }

  const handleSubscribe = async () => {
    const success = await subscribe()
    if (success) setOpened(false)
  }

  if (!isSupported || permission === 'denied' || isSubscribed) return null

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      centered
      title={
        <Group gap="xs">
          <IconBell size={20} />
          <Text fw={700}>{t('push_prompt_title')}</Text>
        </Group>
      }
      size="sm"
    >
      <Stack gap="md">
        <Text size="sm" c="dimmed">{t('push_prompt_description')}</Text>
        {error && <Text size="xs" c="red">{error}</Text>}
        <Group justify="flex-end" gap="xs">
          <Button variant="subtle" onClick={handleClose} disabled={isLoading}>
            {t('not_now')}
          </Button>
          <Button leftSection={<IconBell size={16} />} onClick={handleSubscribe} loading={isLoading}>
            {t('enable_push_notifications')}
          </Button>
        </Group>
      </Stack>
    </Modal>
  )
}