import { useEffect, useState } from 'react'
import { Button, Card, Group, Text, CloseButton } from '@mantine/core'
import { IconDownload } from '@tabler/icons-react'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showPrompt, setShowPrompt] = useState(false)

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      
      // Check if user has dismissed before
      const dismissed = localStorage.getItem('pwa-prompt-dismissed')
      const dismissedAt = dismissed ? parseInt(dismissed) : 0
      const oneDayAgo = Date.now() - (24 * 60 * 60 * 1000)
      
      // Show prompt if not dismissed or if dismissed more than 1 day ago
      if (!dismissed || dismissedAt < oneDayAgo) {
        // Show after 30 seconds to not interrupt user
        setTimeout(() => {
          setShowPrompt(true)
        }, 30000)
      }
    }

    window.addEventListener('beforeinstallprompt', handler)

    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setShowPrompt(false)
    }

    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) return

    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    
    if (outcome === 'accepted') {
      console.log('PWA installed')
    }
    
    setDeferredPrompt(null)
    setShowPrompt(false)
  }

  const handleDismiss = () => {
    setShowPrompt(false)
    localStorage.setItem('pwa-prompt-dismissed', Date.now().toString())
  }

  if (!showPrompt) return null

  return (
    <Card
      withBorder
      shadow="lg"
      p="md"
      style={{
        position: 'fixed',
        bottom: 20,
        right: 20,
        maxWidth: 350,
        zIndex: 1000,
      }}
      hiddenFrom="md" // Only show on mobile/tablet
    >
      <CloseButton
        onClick={handleDismiss}
        style={{ position: 'absolute', top: 8, right: 8 }}
        size="sm"
      />
      
      <Group gap="sm" align="flex-start" mb="sm">
        <IconDownload size={24} color="var(--mantine-color-blue-6)" />
        <div style={{ flex: 1 }}>
          <Text size="sm" fw={600} mb={4}>
            Install So-mails
          </Text>
          <Text size="xs" c="dimmed">
            Install our app for a better experience. Access it anytime, even offline!
          </Text>
        </div>
      </Group>

      <Group gap="xs" justify="flex-end">
        <Button variant="subtle" size="xs" onClick={handleDismiss}>
          Not now
        </Button>
        <Button size="xs" onClick={handleInstall} leftSection={<IconDownload size={14} />}>
          Install
        </Button>
      </Group>
    </Card>
  )
}
