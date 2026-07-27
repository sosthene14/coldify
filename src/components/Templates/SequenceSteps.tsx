import { Card, Group, Text, Button, Stack } from '@mantine/core'
import { IconPlus } from '@tabler/icons-react'
import { StepItem } from './StepItem'
import type { SequenceStep } from '#/types/template.ts';

interface SequenceStepsProps {
  steps: SequenceStep[]
  onAddStep: () => void
  onRemoveStep: (id: string) => void
  onUpdateStep: (id: string, updates: Partial<SequenceStep>) => void
}

export function SequenceSteps({ steps, onAddStep, onRemoveStep, onUpdateStep }: SequenceStepsProps) {
  return (
    <Card withBorder radius="md" p="lg" bg="white">
      <Group justify="space-between" mb="md">
        <Text size="sm" fw={600}>Sequence steps</Text>
        <Button size="xs" variant="light" leftSection={<IconPlus size={14} />} onClick={onAddStep}>
          Add step
        </Button>
      </Group>

      <Stack gap="sm">
        {steps.map((step, index) => (
          <StepItem
            key={step.id}
            step={step}
            index={index}
            isFirst={index === 0}
            onUpdate={onUpdateStep}
            onRemove={onRemoveStep}
          />
        ))}
      </Stack>
    </Card>
  )
}