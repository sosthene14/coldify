import { Stack, TextInput, Group, Button, Text, SegmentedControl, Paper, Textarea } from '@mantine/core'
import { IconUpload, IconRefresh } from '@tabler/icons-react'

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
  htmlCodeView,
  toggleHtmlCodeView,
}: HtmlImportProps) {
  return (
    <Stack gap="sm">
      <TextInput
        label="Subject line"
        placeholder="e.g. {{companyName}} <> Us"
        value={subjectLine}
        onChange={(e) => setSubjectLine(e.currentTarget.value)}
      />

      <Group justify="space-between">
        <Group gap={6}>
          <Button variant="default" size="xs" leftSection={<IconUpload size={14} />}>
            Upload .html file
          </Button>
          <Text size="xs" c="dimmed">or paste code below</Text>
        </Group>
        <SegmentedControl
          size="xs"
          value={htmlCodeView ? 'code' : 'preview'}
          onChange={() => toggleHtmlCodeView()}
          data={[
            { label: 'Code', value: 'code' },
            { label: 'Preview', value: 'preview' },
          ]}
        />
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
            HTML preview will render here
          </Text>
        </Paper>
      )}

      <Group justify="space-between">
        <Button variant="subtle" size="xs" leftSection={<IconRefresh size={14} />}>
          Clean up HTML
        </Button>
        <Text size="xs" c="dimmed">
          Broken styles and unused tags will be stripped
        </Text>
      </Group>
    </Stack>
  )
}