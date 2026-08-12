import { useState, useEffect } from 'react'
import { Card, Stack, Switch, Divider } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { SectionHeader } from '../components/SectionHeader'
import { api } from '#/lib/api'

interface NotificationPreferences {
  emailOpened: boolean
}

export function NotificationsSection() {
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    emailOpened: false
  })
  const [loading, setLoading] = useState(false)

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
      
      notifications.show({
        title: 'Préférences sauvegardées',
        message: 'Vos préférences de notification ont été mises à jour',
        color: 'green'
      })
    } catch (error) {
      console.error('Failed to save notification preferences:', error)
      // Revert on error
      setPreferences(preferences)
      notifications.show({
        title: 'Erreur',
        message: 'Impossible de sauvegarder vos préférences',
        color: 'red'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card withBorder radius="md" p="lg" bg="white">
      <SectionHeader
        title="Notifications"
        description="Choose what you want to be notified about"
      />
      <Divider my="md" />
      <Stack gap="md">
        <Switch
          label="Email opened"
          description="Get notified when someone opens your emails"
          checked={preferences.emailOpened}
          disabled={loading}
          onChange={(event) => updatePreference('emailOpened', event.currentTarget.checked)}
        />
      </Stack>
    </Card>
  )
}
