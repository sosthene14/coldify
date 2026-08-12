import { Button, Card, Group, Text, CloseButton } from '@mantine/core'
import { IconRefresh, IconCheck } from '@tabler/icons-react'
import { usePWA } from '../hooks/usePWA'

export function PWAUpdatePrompt() {
  const { needRefresh, offlineReady, updateServiceWorker, close } = usePWA()

  if (!needRefresh && !offlineReady) return null

  return (
    <Card
      withBorder
      shadow="lg"
      p="md"
   
    >
    
      
   

      {needRefresh && (
        <Group gap="xs" justify="flex-end">
          <Button variant="subtle" size="xs" onClick={close}>
            Later
          </Button>
          <Button
            size="xs"
            onClick={() => updateServiceWorker(true)}
            leftSection={<IconRefresh size={14} />}
          >
            Reload
          </Button>
        </Group>
      )}
    </Card>
  )
}
