// components/EmailContentTabs.tsx
import { Tabs } from '@mantine/core'
import { IconTemplate, IconCode } from '@tabler/icons-react'
import { EmailEditor } from './EmailEditor'
import { TemplateSelector } from './TemplateSelector'

interface EmailContentTabsProps {
  mode: 'compose' | 'template'
  htmlContent: string
  templates: any[]
  onModeChange: (mode: 'compose' | 'template') => void
  onContentChange: (value: string) => void
  onTemplateSelect: (html: string, subject: string, id: string) => void
}

export function EmailContentTabs({
  mode,
  htmlContent,
  templates,
  onModeChange,
  onContentChange,
  onTemplateSelect,
}: EmailContentTabsProps) {
  return (
    <Tabs value={mode} onChange={(value) => onModeChange(value as any)}>
      <Tabs.List>
        <Tabs.Tab value="compose" leftSection={<IconCode size={14} />}>
          Compose
        </Tabs.Tab>
        <Tabs.Tab value="template" leftSection={<IconTemplate size={14} />}>
          Use Template
        </Tabs.Tab>
      </Tabs.List>

      <Tabs.Panel value="compose" pt="md">
        <EmailEditor value={htmlContent} onChange={onContentChange} />
      </Tabs.Panel>

      <Tabs.Panel value="template" pt="md">
        <TemplateSelector templates={templates} onSelect={onTemplateSelect} />
      </Tabs.Panel>
    </Tabs>
  )
}