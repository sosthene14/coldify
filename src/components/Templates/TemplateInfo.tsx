import { categories, languages } from '#/types/template.ts';
import { Card, Stack, TextInput, Textarea, Group, Select } from '@mantine/core'
 

interface TemplateInfoProps {
  templateName: string
  setTemplateName: (value: string) => void
  description: string
  setDescription: (value: string) => void
  category: string | null
  setCategory: (value: string | null) => void
  language: string | null
  setLanguage: (value: string | null) => void
}

export function TemplateInfo({
  templateName,
  setTemplateName,
  description,
  setDescription,
  category,
  setCategory,
  language,
  setLanguage,
}: TemplateInfoProps) {
  return (
    <Card withBorder radius="md" p={{ base: 'sm', sm: 'md', md: 'lg' }} bg="white">
      <Stack gap="sm">
        <TextInput
          label="Template name"
          placeholder="Demande d'emplois"
          size="md"
          value={templateName}
          onChange={(e) => setTemplateName(e.currentTarget.value)}
        />
        <Textarea
          label="Description"
          placeholder="What's this template for? Who is it aimed at?"
          autosize
          minRows={2}
          value={description}
          onChange={(e) => setDescription(e.currentTarget.value)}
        />
        <Group grow wrap="nowrap" style={{ flexDirection: 'row' }}>
          <Select
            label="Category"
            placeholder="Select category"
            searchable
            data={categories}
            value={category}
            onChange={setCategory}
          />
          <Select
            label="Language"
            placeholder="Select language"
            data={languages}
            value={language}
            onChange={setLanguage}
            defaultValue="French"
          />
        </Group>
      </Stack>
    </Card>
  )
}