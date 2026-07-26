import { Card, TextInput, Textarea, Select, Stack, Text } from '@mantine/core'

interface TemplateBasicInfoProps {
  data: {
    name: string
    category: string
    description: string
  }
  onChange: (updates: any) => void
}

const categories = [
  { value: 'cold_outreach', label: 'Cold Outreach' },
  { value: 'follow_up', label: 'Follow-up' },
  { value: 'meeting_request', label: 'Meeting Request' },
  { value: 'partnership', label: 'Partnership' },
  { value: 're_engagement', label: 'Re-engagement' },
  { value: 'thank_you', label: 'Thank You' },
  { value: 'introduction', label: 'Introduction' },
  { value: 'other', label: 'Other' },
]

export function TemplateBasicInfo({ data, onChange }: TemplateBasicInfoProps) {
  return (
    <Card withBorder radius="md" p="xl" bg="white" mt="md">
      <Stack gap="lg">
        <div>
          <Text fw={600} size="lg" mb="xs">
            Template Information
          </Text>
          <Text size="sm" c="dimmed">
            Give your template a name and categorize it
          </Text>
        </div>

        <TextInput
          label="Template Name"
          placeholder="e.g., Cold Outreach - SaaS"
          required
          value={data.name}
          onChange={(e) => onChange({ name: e.currentTarget.value })}
          size="md"
        />

        <Select
          label="Category"
          placeholder="Select a category"
          data={categories}
          value={data.category}
          onChange={(value) => onChange({ category: value || '' })}
          size="md"
          required
        />

        <Textarea
          label="Description (Optional)"
          placeholder="Brief description of when to use this template"
          minRows={2}
          value={data.description}
          onChange={(e) => onChange({ description: e.currentTarget.value })}
          size="md"
        />
      </Stack>
    </Card>
  )
}
