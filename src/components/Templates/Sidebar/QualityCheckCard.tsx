import { Card, Text, Stack, Group } from '@mantine/core'
import { IconCheck, IconAlertTriangle } from '@tabler/icons-react'
import { useTranslation } from 'react-i18next'

export function QualityCheckCard() {
  const { t } = useTranslation()

  return (
    <Card withBorder radius="md" p="lg" bg="white">
      <Text size="sm" fw={600} mb="sm">{t('quality_check')}</Text>
      <Stack gap={8}>
        <Group gap={8}>
          <IconCheck size={14} color="#40C057" />
          <Text size="xs">{t('personalization_variables')}</Text>
        </Group>
        <Group gap={8}>
          <IconCheck size={14} color="#40C057" />
          <Text size="xs">{t('under_150_words')}</Text>
        </Group>
        <Group gap={8}>
          <IconAlertTriangle size={14} color="#F59F00" />
          <Text size="xs">{t('no_cta_detected')}</Text>
        </Group>
      </Stack>
    </Card>
  )
}