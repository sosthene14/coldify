import { Anchor, Group, Paper, Text } from '@mantine/core'
import type { ReactNode } from 'react'

interface SidebarCardProps {
  title: string
  viewAllHref?: string
  children: ReactNode
}

export function SidebarCard({ title, viewAllHref, children }: SidebarCardProps) {
  return (
    <Paper withBorder radius="md" p="md">
      <Group justify="space-between" mb="sm">
        <Text size="sm" fw={600}>
          {title}
        </Text>
        {viewAllHref && (
          <Anchor href={viewAllHref} size="xs" fw={500} c="blue">
            View all
          </Anchor>
        )}
      </Group>
      {children}
    </Paper>
  )
}