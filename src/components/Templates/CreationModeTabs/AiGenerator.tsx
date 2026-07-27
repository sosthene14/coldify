import { goals, lengths, tones } from '#/types/template.ts';
import { Stack, Textarea, Group, Select, Button, Divider, Paper, Badge, Tooltip, ActionIcon, Text } from '@mantine/core'
import { IconSparkles, IconCheck, IconRefresh, IconWand } from '@tabler/icons-react'
 

interface AiGeneratorProps {
  aiPrompt: string
  setAiPrompt: (value: string) => void
  tone: string | null
  setTone: (value: string | null) => void
  length: string | null
  setLength: (value: string | null) => void
  goal: string | null
  setGoal: (value: string | null) => void
  extraContext: string
  setExtraContext: (value: string) => void
}

export function AiGenerator({
  aiPrompt,
  setAiPrompt,
  tone,
  setTone,
  length,
  setLength,
  goal,
  setGoal,
  extraContext,
  setExtraContext,
}: AiGeneratorProps) {
  return (
    <Stack gap="sm">
      <Textarea
        label="What should this email do?"
        placeholder="e.g. Write a cold email to a SaaS CTO, direct tone, under 80 words, goal is booking a 15-min call"
        autosize
        minRows={3}
        value={aiPrompt}
        onChange={(e) => setAiPrompt(e.currentTarget.value)}
      />

      <Group grow>
        <Select label="Tone" data={tones} value={tone} onChange={setTone} defaultValue="Direct" />
        <Select label="Length" data={lengths} value={length} onChange={setLength} defaultValue="Short (~50 words)" />
        <Select label="Goal" data={goals} value={goal} onChange={setGoal} defaultValue="Book a call" />
      </Group>

      <Textarea
        label="Extra context (optional)"
        placeholder="What do you sell? What's your differentiator? Any info about the target audience?"
        autosize
        minRows={2}
        value={extraContext}
        onChange={(e) => setExtraContext(e.currentTarget.value)}
      />

      <Button leftSection={<IconSparkles size={16} />} color="grape">
        Generate template
      </Button>

      <Divider label="Generated variants" labelPosition="center" />

      {[1, 2].map((v) => (
        <Paper key={v} withBorder p="md" radius="md">
          <Group justify="space-between" mb="xs">
            <Badge size="sm" variant="light" color="grape">Variant {v}</Badge>
            <Group gap={4}>
              <Tooltip label="Use this variant">
                <ActionIcon variant="subtle" color="green"><IconCheck size={16} /></ActionIcon>
              </Tooltip>
              <Tooltip label="Regenerate">
                <ActionIcon variant="subtle" color="gray"><IconRefresh size={16} /></ActionIcon>
              </Tooltip>
            </Group>
          </Group>
          <Text size="sm" fw={600} mb={4}>Subject: Quick question, {'{{firstName}}'}</Text>
          <Text size="sm" c="dimmed">
            Hi {'{{firstName}}'}, saw that {'{{companyName}}'} is scaling — thought I'd reach out...
          </Text>
        </Paper>
      ))}

      <Textarea
        placeholder="Refine: make it shorter, add a question at the end..."
        autosize
        minRows={2}
      />
      <Button variant="default" leftSection={<IconWand size={14} />}>
        Refine with instructions
      </Button>
    </Stack>
  )
}