import { lengths, tones } from '#/types/template.ts';
import { Stack, Textarea, Group, Select, Button, Divider, Paper, Badge, Tooltip, ActionIcon, Text } from '@mantine/core'
import { IconSparkles, IconCheck, IconRefresh, IconWand } from '@tabler/icons-react'
import { useTranslation } from 'react-i18next'
 

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
  extraContext,
  setExtraContext,
}: AiGeneratorProps) {
  const { t } = useTranslation()

  return (
    <Stack gap="sm">
      <Textarea
        label={t('what_should_email_do')}
        placeholder="e.g. Demande d'emplois pour google"
        autosize
        minRows={3}
        value={aiPrompt}
        onChange={(e) => setAiPrompt(e.currentTarget.value)}
      />

      <Group grow>
        <Select label={t('tone')} data={tones} value={tone} onChange={setTone} defaultValue="Direct" />
        <Select label={t('length')} data={lengths} value={length} onChange={setLength} defaultValue="Short (~50 words)" />
        {/* <Select label="Goal" data={goals} value={goal} onChange={setGoal} defaultValue="Book a call" /> */}
      </Group>

      <Textarea
        label={t('extra_context_optional')}
        placeholder={t('what_do_you_sell')}
        autosize
        minRows={2}
        value={extraContext}
        onChange={(e) => setExtraContext(e.currentTarget.value)}
      />

      <Button leftSection={<IconSparkles size={16} />} color="blue">
        {t('generate_template')}
      </Button>

      <Divider label={t('generated_variants')} labelPosition="center" className='font-semibold' />

      {[1, 2].map((v) => (
        <Paper key={v} withBorder p="md" radius="md">
          <Group justify="space-between" mb="xs">
            <Badge size="sm" variant="light" color="blue">{t('variant', { count: v })}</Badge>
            <Group gap={4}>
              <Tooltip label={t('use_this_variant')}>
                <ActionIcon variant="subtle" color="green"><IconCheck size={16} /></ActionIcon>
              </Tooltip>
              <Tooltip label={t('regenerate')}>
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
        placeholder={t('refine_placeholder')}
        autosize
        minRows={2}
      />
      <Button variant="default" leftSection={<IconWand size={14} />}>
        {t('refine_with_instructions')}
      </Button>
    </Stack>
  )
}