import { Button, Card, Group } from '@mantine/core'
import { IconRefresh } from '@tabler/icons-react'
import { useTranslation } from 'react-i18next'
import { usePWA } from '../hooks/usePWA'

export function PWAUpdatePrompt() {
  const { t } = useTranslation()
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
            {t('later')}
          </Button>
          <Button
            size="xs"
            onClick={() => updateServiceWorker(true)}
            leftSection={<IconRefresh size={14} />}
          >
            {t('reload')}
          </Button>
        </Group>
      )}
    </Card>
  )
}