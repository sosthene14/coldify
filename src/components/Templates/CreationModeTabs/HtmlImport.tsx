import { Stack, TextInput, Group, Button, Text, Paper, Textarea } from '@mantine/core'
import { IconUpload, IconRefresh } from '@tabler/icons-react'
import { useTranslation } from 'react-i18next'

interface HtmlImportProps {
  subjectLine: string
  setSubjectLine: (value: string) => void
  htmlContent: string
  setHtmlContent: (value: string) => void
  htmlCodeView: boolean
  toggleHtmlCodeView: () => void
}

export function HtmlImport({
  subjectLine,
  setSubjectLine,
  htmlContent,
  setHtmlContent,
  htmlCodeView
}: HtmlImportProps) {
  const { t } = useTranslation()

  return (
    <Stack gap="sm">
      <TextInput
        label={t('subject_line')}
        placeholder="e.g. {{companyName}} <> Us"
        value={subjectLine}
        onChange={(e) => setSubjectLine(e.currentTarget.value)}
      />

      <Group justify="space-between">
        <Group gap={6}>
          <Button variant="default" size="xs" leftSection={<IconUpload size={14} />}>
            {t('upload_html_file')}
          </Button>
          <Text size="xs" c="dimmed">{t('or_paste_code')}</Text>
        </Group>
    
      </Group>

      {htmlCodeView ? (
        <Textarea
          placeholder="<html>...</html>"
          autosize
          minRows={14}
          styles={{ input: { fontFamily: 'monospace', fontSize: 12 } }}
          value={htmlContent}
          onChange={(e) => setHtmlContent(e.currentTarget.value)}
        />
      ) : (
        <Paper withBorder p="lg" radius="md" mih={300} bg="gray.0">
          <Text size="sm" c="dimmed" ta="center" mt={100}>
            {t('html_preview_render')}
          </Text>
        </Paper>
      )}

      <Group justify="space-between">
        <Button variant="subtle" size="xs" leftSection={<IconRefresh size={14} />}>
          {t('clean_up_html')}
        </Button>
        <Text size="xs" c="dimmed">
          {t('broken_styles_stripped')}
        </Text>
      </Group>
    </Stack>
  )
}