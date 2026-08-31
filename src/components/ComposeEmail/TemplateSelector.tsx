import { Card, Stack, Text, Group, Badge, TextInput, ScrollArea } from '@mantine/core'
import { IconSearch, IconCheck } from '@tabler/icons-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { Template } from '../../types/template'

interface TemplateSelectorProps {
  templates: Template[]
  onSelect: (html: string, subject: string, templateId: string) => void
}

export function TemplateSelector({ templates, onSelect }: TemplateSelectorProps) {
  const { t } = useTranslation()
  const [search, setSearch] = useState('')
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const filteredTemplates = templates.filter(
    (template) =>
      template.name.toLowerCase().includes(search.toLowerCase()) ||
      template.subject.toLowerCase().includes(search.toLowerCase()) ||
      template.category.toLowerCase().includes(search.toLowerCase())
  )

  const handleSelect = (template: Template) => {
    setSelectedId(template.id)
    onSelect(template.body as string, template.subject, template.id)
  }

  return (
    <Stack gap="md">
      <TextInput
        placeholder={t('search_templates')}
        leftSection={<IconSearch size={16} />}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <ScrollArea h={400}>
        <Stack gap="sm">
          {filteredTemplates.length === 0 ? (
            <Card withBorder p="lg">
              <Text size="sm" c="dimmed" ta="center">
                {t('no_templates_found')}
              </Text>
            </Card>
          ) : (
            filteredTemplates.map((template) => (
              <Card
                key={template.id}
                withBorder
                p="md"
                style={{
                  cursor: 'pointer',
                  borderColor:
                    selectedId === template.id ? '#4C6EF5' : undefined,
                  borderWidth: selectedId === template.id ? 2 : 1,
                }}
                onClick={() => handleSelect(template)}
              >
                <Group justify="space-between" mb="xs">
                  <div>
                    <Text size="sm" fw={600}>
                      {template.name}
                    </Text>
                    <Text size="xs" c="dimmed" lineClamp={1}>
                      {template.subject}
                    </Text>
                  </div>
                  {selectedId === template.id && (
                    <IconCheck size={20} color="#4C6EF5" />
                  )}
                </Group>

                <Group gap="xs">
                  <Badge size="sm" variant="light">
                    {template.category}
                  </Badge>
                  <Badge size="sm" variant="light" color="gray">
                    {template.language}
                  </Badge>
                  {template.usageCount > 0 && (
                    <Badge size="sm" variant="light" color="green">
                      {t('used_count', { count: template.usageCount })}
                    </Badge>
                  )}
                </Group>

                {template.preview && (
                  <Text size="xs" c="dimmed" mt="xs" lineClamp={2}>
                    {template.preview}
                  </Text>
                )}
              </Card>
            ))
          )}
        </Stack>
      </ScrollArea>
    </Stack>
  )
}