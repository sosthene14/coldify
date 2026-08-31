import { useState, useEffect, useMemo } from 'react'
import {
  Card,
  Stack,
  Divider,
  Group,
  Button,
  TextInput,
  Select,
  PasswordInput,
  Loader,
} from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { useTranslation } from 'react-i18next'
import { SectionHeader } from '../components/SectionHeader'
import { useSession, updateUser } from '#/lib/auth-client'
import { api } from '#/lib/api'

export function ProfileSection() {
  const { t } = useTranslation()
  const { data } = useSession()
  
  // États pour les données du profil
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    timezone: 'UTC',
    language: 'English'
  })
  const [isLoadingProfile, setIsLoadingProfile] = useState(false)
  const [isLoadingPassword, setIsLoadingPassword] = useState(false)
  
  // États pour le changement de mot de passe
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  // Initialiser les données du profil avec les données de session
  useEffect(() => {
    if (data?.user) {
      // Auto-détection de la timezone du navigateur si pas déjà définie
      const detectedTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone
      
      setProfileData({
        firstName: data.user.firstName || data.user.name?.split(' ')[0] || '',
        lastName: data.user.lastName || data.user.name?.split(' ')[1] || '',
        timezone: data.user.timezone || detectedTimezone || 'UTC',
        language: data.user.language || 'English'
      })
    }
  }, [data?.user])

  // Générer la liste des timezones avec des infos utiles (Memoized pour performance)
const timezoneOptions = useMemo(() => {
  const now = new Date()
  const timezones = [
    'UTC',
    'Europe/London',
    'Europe/Paris',
    'Europe/Berlin',
    'Europe/Madrid',
    'Europe/Rome',
    'Europe/Amsterdam',
    'Africa/Dakar',
    'Africa/Cairo',
    'Africa/Lagos',
    'Africa/Johannesburg',
    'America/New_York',
    'America/Los_Angeles',
    'America/Chicago',
    'America/Denver',
    'America/Toronto',
    'America/Mexico_City',
    'America/Sao_Paulo',
    'Asia/Tokyo',
    'Asia/Shanghai',
    'Asia/Dubai',
    'Asia/Kolkata',
    'Asia/Singapore',
    'Australia/Sydney',
    'Australia/Melbourne',
    'Pacific/Auckland',
  ]

  const flat = timezones.map(tz => {
    try {
      const offset = new Intl.DateTimeFormat('en', {
        timeZone: tz,
        timeZoneName: 'longOffset',
      }).formatToParts(now).find(part => part.type === 'timeZoneName')?.value || ''

      const cityName = tz.split('/')[1]?.replace('_', ' ') || tz
      return {
        value: tz,
        label: `${cityName} (${offset})`,
        group: tz === 'UTC' ? 'UTC' : tz.split('/')[0],
      }
    } catch {
      return { value: tz, label: tz, group: 'Other' }
    }
  })

  const groupOrder = ['UTC', 'Europe', 'Africa', 'America', 'Asia', 'Australia', 'Pacific', 'Other']

  // Regroupement réel : { group, items }[]
  const grouped = groupOrder
    .map(group => ({
      group,
      items: flat
        .filter(item => item.group === group)
        .sort((a, b) => a.label.localeCompare(b.label))
        .map(({ value, label }) => ({ value, label })),
    }))
    .filter(g => g.items.length > 0)

  return grouped
}, [])

  // Handler pour sauvegarder les modifications du profil
  const handleSaveProfile = async () => {
    setIsLoadingProfile(true)
    try {
      console.log('Sending profile update request:', {
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        timezone: profileData.timezone,
        language: profileData.language,
      })

      const fullName = `${profileData.firstName} ${profileData.lastName}`.trim()

      // Utilisation d'updateUser de Better Auth pour mettre à jour la BDD ET rafraîchir le cookieCache / la session
      const { error } = await updateUser({
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        timezone: profileData.timezone,
        language: profileData.language,
        name: fullName || undefined,
      })

      if (error) {
        throw new Error(error.message || t('unable_update_profile'))
      }

      // Appeler également le contrôleur user si nécessaire
      await api.patch('/user/profile', {
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        timezone: profileData.timezone,
        language: profileData.language,
      }).catch(() => {
        // Optionnel : ingnorer les erreurs si /api/auth/update-user a déjà mis à jour
      })

      notifications.show({
        title: t('profile_updated'),
        message: t('profile_saved_success'),
        color: 'green'
      })
    } catch (error: any) {
      console.error('Erreur lors de la mise à jour du profil:', error)
      const errorMessage = error.response?.data?.error || error.message || t('unable_update_profile')
      notifications.show({
        title: t('error_occurred'),
        message: errorMessage,
        color: 'red'
      })
    } finally {
      setIsLoadingProfile(false)
    }
  }

  // Handler pour changer le mot de passe
  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      notifications.show({
        title: t('error_occurred'),
        message: t('password_mismatch'),
        color: 'red'
      })
      return
    }

    if (passwordData.newPassword.length < 8) {
      notifications.show({
        title: t('error_occurred'),
        message: t('password_min_length'),
        color: 'red'
      })
      return
    }

    setIsLoadingPassword(true)
    try {
      await api.post('/api/auth/change-password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      })
      
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      })
      
      notifications.show({
        title: t('password_changed'),
        message: t('password_changed_success'),
        color: 'green'
      })
    } catch (error: any) {
      console.error('Erreur lors du changement de mot de passe:', error)
      const errorMessage = error.response?.data?.message || error.message || t('unable_change_password')
      notifications.show({
        title: t('error_occurred'),
        message: errorMessage,
        color: 'red'
      })
    } finally {
      setIsLoadingPassword(false)
    }
  }

  if (!data?.user) {
    return (
      <Card withBorder radius="md" p="lg" bg="white">
        <Group justify="center" py="xl">
          <Loader size="sm" />
          <span>{t('loading_profile')}</span>
        </Group>
      </Card>
    )
  }

  return (
    <>
      <Card withBorder radius="md" p="lg" bg="white">
        <SectionHeader
          title={t('profile')}
          description={t('your_personal_information')}
        />
        <Divider my="md" />
        <Group align="flex-start" gap="xl">
     
          <Stack gap="sm" style={{ flex: 1 }}>
            <Group grow>
             <TextInput 
  label={t('first_name')} 
  value={profileData.firstName}
  onChange={(event) => {
    const value = event.currentTarget.value
    setProfileData(prev => ({ ...prev, firstName: value }))
  }}
  placeholder={t('enter_first_name')}
/>
<TextInput 
  label={t('last_name')} 
  value={profileData.lastName}
  onChange={(event) => {
    const value = event.currentTarget.value
    setProfileData(prev => ({ ...prev, lastName: value }))
  }}
  placeholder={t('enter_last_name')}
/>
            </Group>
            <TextInput 
              label={t('email')} 
              value={data?.user?.email || ''} 
              disabled
              description={t('email_cannot_modified')}
              styles={{
                input: {
                  backgroundColor: '#f8f9fa',
                  color: '#868e96',
                  cursor: 'not-allowed'
                }
              }}
            />
            <Group grow>
              <Select 
                label={t('timezone')} 
                value={profileData.timezone}
                onChange={(value) => setProfileData(prev => ({
                  ...prev,
                  timezone: value || 'UTC'
                }))}
                data={timezoneOptions}
                searchable
                clearable={false}
               />
              <Select 
                label={t('interface_language')} 
                value={profileData.language}
                onChange={(value) => setProfileData(prev => ({
                  ...prev,
                  language: value || 'English'
                }))}
                data={[
                  { value: 'English', label: '🇺🇸 English' },
                  { value: 'Français', label: '🇫🇷 Français' },
                  { value: 'Español', label: '🇪🇸 Español' },
                  { value: 'Deutsch', label: '🇩🇪 Deutsch' },
                ]} 
              />
            </Group>
          </Stack>
        </Group>
        <Group justify="flex-end" mt="md">
          <Button 
            onClick={handleSaveProfile}
            loading={isLoadingProfile}
            radius='sm'
            disabled={!data?.user}
          >
            {t('save_changes')}
          </Button>
        </Group>
      </Card>

      <Card withBorder radius="md" p="lg" bg="white" mb='lg'>
        <SectionHeader title={t('password')} description={t('change_account_password')} />
        <Divider my="md" />
         
        <PasswordInput 
  label={t('current_password')} 
  value={passwordData.currentPassword}
  onChange={(event) => {
    const value = event.currentTarget.value
    setPasswordData(prev => ({ ...prev, currentPassword: value }))
  }}
  placeholder={t('enter_current_password')}
/>
<PasswordInput 
  label={t('new_password')} 
  value={passwordData.newPassword}
  onChange={(event) => {
    const value = event.currentTarget.value
    setPasswordData(prev => ({ ...prev, newPassword: value }))
  }}
  placeholder={t('enter_new_password')}
  description={t('must_be_8_chars')}
/>
<PasswordInput 
  label={t('confirm_new_password')} 
  value={passwordData.confirmPassword}
  onChange={(event) => {
    const value = event.currentTarget.value
    setPasswordData(prev => ({ ...prev, confirmPassword: value }))
  }}
  placeholder={t('confirm_your_new_password')}
  error={passwordData.confirmPassword && passwordData.newPassword !== passwordData.confirmPassword ? t('passwords_do_not_match') : undefined}
/>
         <Group justify="flex-end" mt="md">
          <Button 
            variant="default" 
            radius="sm"
            onClick={handleChangePassword}
            loading={isLoadingPassword}
            disabled={!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword}
          >
            {t('update_password')}
          </Button>
        </Group>
      </Card>
    </>
  )
}