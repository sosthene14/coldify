import { Anchor, Group, Paper, Text } from '@mantine/core'
import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'

interface SidebarCardProps {
  title: string
  viewAllHref?: string
  children: ReactNode
}

export function SidebarCard({ title, viewAllHref, children }: SidebarCardProps) {
  const { t } = useTranslation()

  return (
    <Paper withBorder radius="md" p="md">
      <Group justify="space-between" mb="sm">
        <Text size="sm" fw={600}>
          {title}
        </Text>
        {viewAllHref && (
          <Anchor href={viewAllHref} size="xs" fw={500} c="blue">
            {t('view_all')}
          </Anchor>
        )}
      </Group>
      {children}
    </Paper>
  )
}