import { Card, TextInput, Textarea, Stack, Text, Paper, Code, Group, Badge } from '@mantine/core'
import { IconSparkles } from '@tabler/icons-react'

interface TemplateEditorProps {
  data: {
    subject: string
    body: string
  }
  onChange: (updates: any) => void
}

const variables = [
  { name: '{{firstName}}', description: 'Lead first name' },
  { name: '{{lastName}}', description: 'Lead last name' },
  { name: '{{fullName}}', description: 'Lead full name' },
  { name: '{{email}}', description: 'Lead email' },
  { name: '{{companyName}}', description: 'Company name' },
  { name: '{{jobTitle}}', description: 'Job title' },
  { name: '{{industry}}', description: 'Industry' },
  { name: '{{city}}', description: 'City' },
  { name: '{{country}}', description: 'Country' },
]

export function TemplateEditor({ data, onChange }: TemplateEditorProps) {
  return (
    <Card withBorder radius="md" p="xl" bg="white" mt="md">
      <Stack gap="lg">
        <div>
          <Text fw={600} size="lg" mb="xs">
            Email Content
          </Text>
          <Text size="sm" c="dimmed">
            Write your email subject and body. Use variables for personalization.
          </Text>
        </div>

        <TextInput
          label="Subject Line"
          placeholder="e.g., Quick question about {{companyName}}"
          required
          value={data.subject}
          onChange={(e) => onChange({ subject: e.currentTarget.value })}
          size="md"
        />

        <Textarea
          label="Email Body"
          placeholder="Hi {{firstName}},&#10;&#10;I hope this email finds you well..."
          minRows={12}
          value={data.body}
          onChange={(e) => onChange({ body: e.currentTarget.value })}
          required
          size="md"
        />

        <Paper withBorder p="md" radius="md" bg="blue.0">
          <Group gap="xs" mb="sm">
            <IconSparkles size={18} color="#228BE6" />
            <Text size="sm" fw={600}>
              Available Variables
            </Text>
          </Group>
          <Text size="xs" c="dimmed" mb="sm">
            Click to copy and paste into your template:
          </Text>
          <Group gap="xs">
            {variables.map((variable) => (
              <Badge
                key={variable.name}
                size="md"
                variant="light"
                style={{ cursor: 'pointer' }}
                title={variable.description}
              >
                {variable.name}
              </Badge>
            ))}
          </Group>
        </Paper>

        <Paper withBorder p="sm" radius="md" bg="gray.0">
          <Text size="xs" fw={600} mb="xs">
            💡 Pro Tips:
          </Text>
          <Text size="xs" c="dimmed">
            • Keep subject lines under 50 characters for better open rates
            <br />
            • Personalize with variables to increase engagement
            <br />
            • Keep paragraphs short (2-3 lines max)
            <br />
            • End with a clear call-to-action
          </Text>
        </Paper>
      </Stack>
    </Card>
  )
}
