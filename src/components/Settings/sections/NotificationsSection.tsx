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
    emailOpened: true
  })
  const [loading, setLoading] = useState(false)
  const { isSupported, permission, isSubscribed, isLoading: isPushLoading, error, subscribe, unsubscribe } = usePushNotifications()

  const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
  const isSafariBrowser = /^((?!chrome|android).)*safari/i.test(navigator.userAgent)
  const showIOSInstallGuide = isIOSDevice && isSafariBrowser

  const handlePushToggle = async () => {
    console.info('[Notifications] Push button clicked', {
      isSubscribed,
      isSupported,
      permission,
    })

    const result = isSubscribed ? await unsubscribe() : await subscribe()

    console.info('[Notifications] Push action completed', {
      action: isSubscribed ? 'unsubscribe' : 'subscribe',
      success: result,
    })
  }

  // Charger les préférences au mount
  useEffect(() => {
    const loadPreferences = async () => {
      try {
        const response = await api.get('/user/notification-preferences')
        setPreferences(response.data.preferences || { emailOpened: true })
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

        <Divider my="sm" label={t('push_notifications')} />

        {!isSupported && (
          <Alert icon={<IconInfoCircle size={16} />} color="yellow">
            {t('push_notifications_not_supported')}
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
            onClick={handlePushToggle}
            loading={loading || isPushLoading}
          >
            {isSubscribed ? t('disable_push_notifications') : t('enable_push_notifications')}
          </Button>
        )}

        {permission === 'denied' && (
          <Alert icon={<IconInfoCircle size={16} />} color="orange">
            {t('push_notifications_blocked')}
          </Alert>
        )}

        {showIOSInstallGuide && (
          <Alert icon={<IconInfoCircle size={16} />} color="blue">
            <Stack gap={4}>
              <strong>{t('ios_install_home_screen_title')}</strong>
              <div>{t('ios_install_home_screen_steps')}</div>
              <div>{t('ios_install_home_screen_note')}</div>
            </Stack>
          </Alert>
        )}
      </Stack>
    </Card>
  )
}