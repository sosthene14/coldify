import { Tabs } from '@mantine/core'
import { IconEdit, IconCode, IconWand } from '@tabler/icons-react'
 
import { ManualEditor } from './ManualEditor'
import { HtmlImport } from './HtmlImport'
import { AiGenerator } from './AiGenerator'
import type { CreationMode } from '#/types/template.ts';

interface CreationModeTabsProps {
  creationMode: CreationMode
  setCreationMode: (mode: CreationMode) => void
  // Manual props
  subjectLine: string
  setSubjectLine: (value: string) => void
  emailBody: string
  setEmailBody: (value: string) => void
  // HTML props
  htmlContent: string
  setHtmlContent: (value: string) => void
  htmlCodeView: boolean
  toggleHtmlCodeView: () => void
  // AI props
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

export function CreationModeTabs(props: CreationModeTabsProps) {
  const {
    creationMode,
    setCreationMode,
    subjectLine,
    setSubjectLine,
    emailBody,
    setEmailBody,
    htmlContent,
    setHtmlContent,
    htmlCodeView,
    toggleHtmlCodeView,
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
  } = props

  return (
    <Tabs value={creationMode} onChange={(v) => setCreationMode(v as CreationMode)}>
      <Tabs.List grow>
        <Tabs.Tab value="manual" leftSection={<IconEdit className='hidden md:block' size={14} />}>Manual Editor</Tabs.Tab>
        <Tabs.Tab value="html" leftSection={<IconCode className='hidden md:block' size={14} />}>Import HTML</Tabs.Tab>
        <Tabs.Tab value="ai" leftSection={<IconWand className='hidden md:block' size={14} />}>Generate with AI</Tabs.Tab>
      </Tabs.List>

      <Tabs.Panel value="manual" pt="lg">
        <ManualEditor
          subjectLine={subjectLine}
          setSubjectLine={setSubjectLine}
          emailBody={emailBody}
          setEmailBody={setEmailBody}
        />
      </Tabs.Panel>

      <Tabs.Panel value="html" pt="lg">
        <HtmlImport
          subjectLine={subjectLine}
          setSubjectLine={setSubjectLine}
          htmlContent={htmlContent}
          setHtmlContent={setHtmlContent}
          htmlCodeView={htmlCodeView}
          toggleHtmlCodeView={toggleHtmlCodeView}
        />
      </Tabs.Panel>

      <Tabs.Panel value="ai" pt="lg">
        <AiGenerator
          aiPrompt={aiPrompt}
          setAiPrompt={setAiPrompt}
          tone={tone}
          setTone={setTone}
          length={length}
          setLength={setLength}
          goal={goal}
          setGoal={setGoal}
          extraContext={extraContext}
          setExtraContext={setExtraContext}
        />
      </Tabs.Panel>
    </Tabs>
  )
}