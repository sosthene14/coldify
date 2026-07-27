import type { SequenceStep, StepType } from '#/types/template.ts';
import { Paper, Group, ActionIcon, Badge, SegmentedControl, TextInput, NumberInput, Text, Switch } from '@mantine/core'
import { IconGripVertical, IconTrash } from '@tabler/icons-react'
 

interface StepItemProps {
  step: SequenceStep
  index: number
  onUpdate: (id: string, updates: Partial<SequenceStep>) => void
  onRemove: (id: string) => void
  isFirst: boolean
}

export function StepItem({ step, index, onUpdate, onRemove, isFirst }: StepItemProps) {
  return (
    <Paper withBorder p="md" radius="md">
      <Group justify="space-between" mb="sm">
        <Group gap={8}>
          <ActionIcon variant="subtle" color="gray" style={{ cursor: 'grab' }}>
            <IconGripVertical size={16} />
          </ActionIcon>
          <Badge variant="light" color="indigo">Step {index + 1}</Badge>
          <SegmentedControl
            size="xs"
            data={[
              { label: 'Email', value: 'email' },
              { label: 'LinkedIn', value: 'linkedin' },
              { label: 'Task', value: 'task' },
            ]}
            value={step.type}
            onChange={(v) => onUpdate(step.id, { type: v as StepType })}
          />
        </Group>
        {!isFirst && (
          <ActionIcon variant="subtle" color="red" onClick={() => onRemove(step.id)}>
            <IconTrash size={16} />
          </ActionIcon>
        )}
      </Group>

      <Group grow align="flex-end">
        <TextInput
          label="Subject / label"
          placeholder="e.g. Follow-up #1"
          value={step.subject}
          onChange={(e) => onUpdate(step.id, { subject: e.currentTarget.value })}
        />
        <NumberInput
          label="Wait before sending"
          rightSection={<Text size="xs" c="dimmed" pr={8}>days</Text>}
          value={step.delayDays}
          min={0}
          disabled={isFirst}
          onChange={(v) => onUpdate(step.id, { delayDays: Number(v) || 0 })}
        />
      </Group>

      <Switch
        mt="sm"
        size="sm"
        label="Stop sequence if lead replies"
        checked={step.stopOnReply}
        onChange={(e) => onUpdate(step.id, { stopOnReply: e.currentTarget.checked })}
      />
    </Paper>
  )
}