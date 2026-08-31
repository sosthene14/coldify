import { categories, languages } from '#/types/template.ts';
import { Card, Stack, TextInput, Textarea, Group, Select } from '@mantine/core'
import { useTranslation } from 'react-i18next'
 

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
  const { t } = useTranslation()

  return (
    <Card withBorder radius="md" p={{ base: 'sm', sm: 'md', md: 'lg' }} bg="white">
      <Stack gap="sm">
        <TextInput
          label={t('template_name')}
          placeholder="Demande d'emplois"
          size="md"
          value={templateName}
          onChange={(e) => setTemplateName(e.currentTarget.value)}
        />
        <Textarea
          label={t('description')}
          placeholder={t('template_description_placeholder')}
          autosize
          minRows={2}
          value={description}
          onChange={(e) => setDescription(e.currentTarget.value)}
        />
        <Group grow wrap="nowrap" style={{ flexDirection: 'row' }}>
          <Select
            label={t('category')}
            placeholder={t('select_category')}
            searchable
            data={categories}
            value={category}
            onChange={setCategory}
          />
          <Select
            label={t('language')}
            placeholder={t('select_language')}
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