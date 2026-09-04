import { lengths, tones } from '#/types/template.ts';
import { Stack, Textarea, Group, Select, Button, Divider, Paper, Badge, Tooltip, ActionIcon, Text } from '@mantine/core'
import { IconSparkles, IconCheck, IconRefresh, IconWand, IconBrandOpenai } from '@tabler/icons-react'
import { useTranslation } from 'react-i18next'
import { useState } from 'react'
 

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
  const [aiProvider, setAiProvider] = useState<string>('chatgpt')
  
  const aiProviders = [
    { value: 'chatgpt', label: 'ChatGPT' },
    { value: 'claude', label: 'Claude' }
  ]

  const generatePrompt = () => {
    const parts = []
    
    if (aiPrompt) {
      parts.push(aiPrompt)
    }
    
    if (tone) {
      parts.push(`Tone: ${tone}`)
    }
    
    if (length) {
      parts.push(`Length: ${length}`)
    }
    
    return parts.join('. ')
  }

  const handleGenerate = () => {
    const prompt = generatePrompt()
    
    if (!prompt.trim()) {
      return
    }
    
    const encodedPrompt = encodeURIComponent(prompt)
    
    if (aiProvider === 'chatgpt') {
      // Open ChatGPT with the prompt
      window.open(`https://chatgpt.com/?prompt=${encodedPrompt}`, '_blank')
    } else if (aiProvider === 'claude') {
      // Open Claude with the prompt
      window.open(`https://claude.ai/new?q=${encodedPrompt}`, '_blank')
    }
  }

  return (
    <Stack gap="sm">
      <Textarea
        label={t('what_should_email_do')}
        placeholder="e.g. Demande d'emplois pour google"
        autosize
        minRows={3}
        maxLength={2000}
        value={aiPrompt}
        onChange={(e) => setAiPrompt(e.currentTarget.value)}
        description={`${aiPrompt.length}/2000 caractères`}
      />

      <Group grow>
        <Select 
          label="AI Provider" 
          data={aiProviders} 
          value={aiProvider} 
          onChange={(value) => setAiProvider(value || 'chatgpt')} 
        />
        <Select label={t('tone')} data={tones} value={tone} onChange={setTone} defaultValue="Direct" />
        <Select label={t('length')} data={lengths} value={length} onChange={setLength} defaultValue="Short (~50 words)" />
      </Group>

      <Button 
        leftSection={<IconBrandOpenai size={16} />} 
        color="blue"
        onClick={handleGenerate}
        disabled={!aiPrompt.trim()}
      >
        {t('generate_with')} {aiProvider === 'chatgpt' ? 'ChatGPT' : 'Claude'}
      </Button>

      <Text size="sm" c="dimmed" ta="center">
        {t('opens_in_new_tab')}
      </Text>
    </Stack>
  )
}