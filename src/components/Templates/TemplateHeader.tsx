import { Group, Button, Badge } from '@mantine/core'
import { IconArrowLeft, IconSend, IconDeviceFloppy } from '@tabler/icons-react'
import { useNavigate } from '@tanstack/react-router'

export function TemplateHeader() {
  const navigate = useNavigate()

  return (
    <Group justify="space-between">
      <Group gap="sm">
        <Button
          variant="subtle"
          leftSection={<IconArrowLeft size={16} />}
          onClick={() => navigate({ to: '/dashboard/templates' })}
        >
          Back to Templates
        </Button>
      </Group>
      <Group gap="sm">
        <Badge size="lg" variant="light" color="gray">Draft</Badge>
        <Button variant="default" leftSection={<IconSend size={16} />}>Send Test</Button>
        <Button variant="default" leftSection={<IconDeviceFloppy size={16} />}>Save Draft</Button>
        <Button color="blue">Publish Template</Button>
      </Group>
    </Group>
  )
}