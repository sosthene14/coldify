import { useState, useEffect } from 'react'
import { Card, Stack, Text, Button, Group, Badge, Divider } from '@mantine/core'
import { IconDownload, IconRefresh, IconCheck, IconDeviceMobile } from '@tabler/icons-react'
import { useTranslation } from 'react-i18next'
import { usePWA } from '../../../hooks/usePWA'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export function AppSection() {
  const { t } = useTranslation()
  const { needRefresh, offlineReady, updateServiceWorker } = usePWA()
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [isInstalled, setIsInstalled] = useState(false)

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
    }

    window.addEventListener('beforeinstallprompt', handler)

    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true)
    }

    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) {
      alert(t('use_compatible_browser'))
      return
    }

    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    
    if (outcome === 'accepted') {
      console.log('PWA installed')
      setIsInstalled(true)
    }
    
    setDeferredPrompt(null)
  }

  return (
    <Stack gap="md">
      <Card withBorder radius="md" p="lg">
        <Stack gap="md">
          <Group justify="space-between">
            <div>
              <Text size="lg" fw={600} mb={4}>
                {t('progressive_web_app')}
              </Text>
              <Text size="sm" c="dimmed">
                {t('install_standalone')}
              </Text>
            </div>
            {isInstalled && (
              <Badge color="green" variant="light" size="lg" leftSection={<IconCheck size={14} />}>
                {t('installed')}
              </Badge>
            )}
          </Group>

          <Divider />

          {/* Installation Status */}
          <Stack gap="sm">
            <Text size="sm" fw={500}>{t('installation_status')}</Text>
            
            {isInstalled ? (
              <Group gap="xs">
                <IconCheck size={16} color="var(--mantine-color-green-6)" />
                <Text size="sm" c="dimmed">
                  {t('installed_running_pwa')}
                </Text>
              </Group>
            ) : (
              <Group gap="xs">
                <IconDeviceMobile size={16} color="var(--mantine-color-gray-6)" />
                <Text size="sm" c="dimmed">
                  {t('not_installed_yet')}
                </Text>
              </Group>
            )}
          </Stack>

          {/* Install Button */}
          {!isInstalled && (
            <>
              <Divider />
              <div>
                <Text size="sm" fw={500} mb="xs">
                  {t('benefits_installation')}
                </Text>
                <Stack gap={4}>
                  <Text size="xs" c="dimmed">• {t('faster_load')}</Text>
                  <Text size="xs" c="dimmed">• {t('works_offline')}</Text>
                  <Text size="xs" c="dimmed">• {t('quick_access_home')}</Text>
                  <Text size="xs" c="dimmed">• {t('native_app_experience')}</Text>
                </Stack>
              </div>
              
              <Button
                leftSection={<IconDownload size={16} />}
                onClick={handleInstall}
                disabled={!deferredPrompt && !isInstalled}
                fullWidth
              >
                {deferredPrompt ? t('install_app') : t('installation_not_available')}
              </Button>
              
              {!deferredPrompt && !isInstalled && (
                <Text size="xs" c="dimmed" ta="center">
                  {t('use_compatible_browser')}
                </Text>
              )}
            </>
          )}

          {/* Offline Status */}
          {offlineReady && (
            <>
              <Divider />
              <Group gap="xs">
                <IconCheck size={16} color="var(--mantine-color-green-6)" />
                <Text size="sm" c="dimmed">
                  {t('app_ready_offline')}
                </Text>
              </Group>
            </>
          )}
        </Stack>
      </Card>

      {/* Update Available */}
      {needRefresh && (
        <Card withBorder radius="md" p="lg" bg="blue.0">
          <Group justify="space-between" align="flex-start">
            <div style={{ flex: 1 }}>
              <Group gap="xs" mb="xs">
                <IconRefresh size={20} color="var(--mantine-color-blue-6)" />
                <Text size="sm" fw={600}>
                  {t('update_available')}
                </Text>
              </Group>
              <Text size="sm" c="dimmed">
                {t('new_version_available')}
              </Text>
            </div>
            <Button
              size="sm"
              onClick={() => updateServiceWorker(true)}
              leftSection={<IconRefresh size={14} />}
            >
              {t('reload_now')}
            </Button>
          </Group>
        </Card>
      )}

      {/* App Information */}
      <Card withBorder radius="md" p="lg">
        <Stack gap="sm">
          <Text size="sm" fw={600}>{t('about_this_app')}</Text>
          <Group justify="space-between">
            <Text size="sm" c="dimmed">{t('version')}</Text>
            <Text size="sm" fw={500}>1.0.0</Text>
          </Group>
          <Group justify="space-between">
            <Text size="sm" c="dimmed">{t('build')}</Text>
            <Text size="sm" fw={500}>{t('production')}</Text>
          </Group>
          <Group justify="space-between">
            <Text size="sm" c="dimmed">{t('pwa_support')}</Text>
            <Badge color="green" variant="light" size="sm">
              {t('enabled')}
            </Badge>
          </Group>
        </Stack>
      </Card>
    </Stack>
  )
}