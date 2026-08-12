import { Text } from '@mantine/core'

interface SectionHeaderProps {
  title: string
  description?: string
}

export function SectionHeader({ title, description }: SectionHeaderProps) {
  return (
    <div>
      <Text size="lg" fw={700}>
        {title}
      </Text>
      {description && (
        <Text size="sm" c="dimmed" mt={2}>
          {description}
        </Text>
      )}
    </div>
  )
}
