import { Button, Card, Group, Text } from '@mantine/core'
import { IconRefresh, IconCloudDownload } from '@tabler/icons-react'
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
      p="sm"
      radius="md"
      style={{
        position: 'fixed',
        right: 16,
        bottom: 16,
        zIndex: 1200,
        maxWidth: 360,
        width: 'calc(100vw - 32px)',
        background: 'linear-gradient(135deg, rgba(34, 139, 230, 0.08), rgba(190, 227, 255, 0.18))',
      }}
    >
      <Group justify="space-between" align="center" wrap="nowrap" gap="sm">
        <Group gap="xs" wrap="nowrap">
          <IconCloudDownload size={18} color="var(--mantine-color-blue-6)" />
          <Text size="sm" fw={600}>
            {t('update_available') || 'Update available'}
          </Text>
        </Group>

        <Group gap="xs" wrap="nowrap">
          {needRefresh && (
            <>
              <Button variant="subtle" size="compact-sm" onClick={close}>
                {t('later')}
              </Button>
              <Button
                size="compact-sm"
                onClick={() => updateServiceWorker(true)}
                leftSection={<IconRefresh size={14} />}
              >
                {t('reload')}
              </Button>
            </>
          )}
        </Group>
      </Group>
    </Card>
  )
}