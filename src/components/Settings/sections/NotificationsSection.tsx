import { useState, useEffect } from 'react'
import { Card, Stack, Switch, Divider, Button, Alert } from '@mantine/core'
import { useTranslation } from 'react-i18next'
import { IconBell, IconInfoCircle } from '@tabler/icons-react'
import { SectionHeader } from '../components/SectionHeader'
import { api } from '#/lib/api'
import toast from 'react-hot-toast'
import { usePushNotifications } from '#/hooks/usePushNotifications'

interface NotificationPreferences {
  emailOpened: boolean
}

export function NotificationsSection() {
  const { t } = useTranslation()
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    emailOpened: false
  })
  const [loading, setLoading] = useState(false)
  const { isSupported, permission, isSubscribed, error, subscribe, unsubscribe } = usePushNotifications()

  // Charger les préférences au mount
  useEffect(() => {
    const loadPreferences = async () => {
      try {
        const response = await api.get('/user/notification-preferences')
        setPreferences(response.data.preferences || { emailOpened: false })
      } catch (error) {
        console.error('Failed to load notification preferences:', error)
      }
    }
    loadPreferences()
  }, [])

  // Sauvegarder les préférences quand elles changent
const updatePreference = async (key: keyof NotificationPreferences, value: boolean) => {
    const newPreferences = { ...preferences, [key]: value }
    setPreferences(newPreferences)
    setLoading(true)

    try {
      await api.patch('/user/notification-preferences', {
        preferences: newPreferences
      })
      
      toast.success(t('notification_preferences_updated'))
    } catch (error) {
      console.error('Failed to save notification preferences:', error)
      // Revert on error
      setPreferences(preferences)
      toast.error(t('unable_save_preferences'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card withBorder radius="md" p="lg" bg="white">
      <SectionHeader
        title={t('notifications')}
        description={t('notification_description')}
      />
      <Divider my="md" />
      <Stack gap="md">
        <Switch
          label={t('email_opened')}
          description={t('email_opened_description')}
          checked={preferences.emailOpened}
          disabled={loading}
          onChange={(event) => updatePreference('emailOpened', event.currentTarget.checked)}
        />

        <Divider my="sm" label="Push Notifications" />

        {!isSupported && (
          <Alert icon={<IconInfoCircle size={16} />} color="yellow">
            Push notifications are not supported in your browser
          </Alert>
        )}

        {error && (
          <Alert icon={<IconInfoCircle size={16} />} color="red">
            {error}
          </Alert>
        )}

        {isSupported && (
          <Button
            leftSection={<IconBell size={16} />}
            variant={isSubscribed ? 'light' : 'filled'}
            color={isSubscribed ? 'gray' : 'blue'}
            onClick={isSubscribed ? unsubscribe : subscribe}
            loading={loading}
          >
            {isSubscribed ? 'Disable Push Notifications' : 'Enable Push Notifications'}
          </Button>
        )}

        {permission === 'denied' && (
          <Alert icon={<IconInfoCircle size={16} />} color="orange">
            You have blocked notifications. Please enable them in your browser settings.
          </Alert>
        )}
      </Stack>
    </Card>
  )
}