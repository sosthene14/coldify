import { useState, useEffect } from 'react'
import { Card, Stack, Text, Button, Group, Badge, Divider } from '@mantine/core'
import { IconDownload, IconRefresh, IconCheck, IconDeviceMobile } from '@tabler/icons-react'
import { usePWA } from '../../../hooks/usePWA'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export function AppSection() {
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
      alert('Installation not available. Try using Chrome, Edge, or another compatible browser.')
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
                Progressive Web App
              </Text>
              <Text size="sm" c="dimmed">
                Install So-mails as a standalone app on your device
              </Text>
            </div>
            {isInstalled && (
              <Badge color="green" variant="light" size="lg" leftSection={<IconCheck size={14} />}>
                Installed
              </Badge>
            )}
          </Group>

          <Divider />

          {/* Installation Status */}
          <Stack gap="sm">
            <Text size="sm" fw={500}>Installation Status</Text>
            
            {isInstalled ? (
              <Group gap="xs">
                <IconCheck size={16} color="var(--mantine-color-green-6)" />
                <Text size="sm" c="dimmed">
                  So-mails is installed and running as a PWA
                </Text>
              </Group>
            ) : (
              <Group gap="xs">
                <IconDeviceMobile size={16} color="var(--mantine-color-gray-6)" />
                <Text size="sm" c="dimmed">
                  So-mails is not installed yet
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
                  Benefits of Installation
                </Text>
                <Stack gap={4}>
                  <Text size="xs" c="dimmed">• Faster load times and better performance</Text>
                  <Text size="xs" c="dimmed">• Works offline with cached data</Text>
                  <Text size="xs" c="dimmed">• Quick access from home screen</Text>
                  <Text size="xs" c="dimmed">• Native app-like experience</Text>
                </Stack>
              </div>
              
              <Button
                leftSection={<IconDownload size={16} />}
                onClick={handleInstall}
                disabled={!deferredPrompt && !isInstalled}
                fullWidth
              >
                {deferredPrompt ? 'Install App' : 'Installation Not Available'}
              </Button>
              
              {!deferredPrompt && !isInstalled && (
                <Text size="xs" c="dimmed" ta="center">
                  Use Chrome, Edge, or another compatible browser to install the app
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
                  App is ready to work offline
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
                  Update Available
                </Text>
              </Group>
              <Text size="sm" c="dimmed">
                A new version of So-mails is available. Click reload to update to the latest version.
              </Text>
            </div>
            <Button
              size="sm"
              onClick={() => updateServiceWorker(true)}
              leftSection={<IconRefresh size={14} />}
            >
              Reload Now
            </Button>
          </Group>
        </Card>
      )}

      {/* App Information */}
      <Card withBorder radius="md" p="lg">
        <Stack gap="sm">
          <Text size="sm" fw={600}>About This App</Text>
          <Group justify="space-between">
            <Text size="sm" c="dimmed">Version</Text>
            <Text size="sm" fw={500}>1.0.0</Text>
          </Group>
          <Group justify="space-between">
            <Text size="sm" c="dimmed">Build</Text>
            <Text size="sm" fw={500}>Production</Text>
          </Group>
          <Group justify="space-between">
            <Text size="sm" c="dimmed">PWA Support</Text>
            <Badge color="green" variant="light" size="sm">
              Enabled
            </Badge>
          </Group>
        </Stack>
      </Card>
    </Stack>
  )
}
