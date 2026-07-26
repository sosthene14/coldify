import { Card, TextInput, Textarea, Select, Stack, Text } from '@mantine/core'
import type { CampaignFormData } from './CreateCampaign'

interface CampaignBasicInfoProps {
  data: CampaignFormData
  onChange: (updates: Partial<CampaignFormData>) => void
}

const categories = [
  { value: 'outbound', label: 'Outbound Sales' },
  { value: 'partnership', label: 'Partnership Outreach' },
  { value: 'recruitment', label: 'Recruitment' },
  { value: 'event', label: 'Event Promotion' },
  { value: 'reengagement', label: 'Re-engagement' },
  { value: 'other', label: 'Other' }
]

export function CampaignBasicInfo({ data, onChange }: CampaignBasicInfoProps) {
  return (
    <Card withBorder radius="md" p="xl" bg="white" mt="md">
      <Stack gap="lg">
        <div>
          <Text fw={600} size="lg" mb="xs">
            Campaign Information
          </Text>
          <Text size="sm" c="dimmed">
            Provide basic details about your campaign
          </Text>
        </div>

        <TextInput
          label="Campaign Name"
          placeholder="e.g., Q4 SaaS Outreach"
          required
          value={data.name}
          onChange={(e) => onChange({ name: e.currentTarget.value })}
          size="md"
        />

        <Textarea
          label="Description"
          placeholder="Brief description of your campaign goals and target audience"
          minRows={3}
          value={data.description}
          onChange={(e) => onChange({ description: e.currentTarget.value })}
          size="md"
        />

        <Select
          label="Category"
          placeholder="Select campaign category"
          data={categories}
          value={data.category}
          onChange={(value) => onChange({ category: value || '' })}
          size="md"
        />
      </Stack>
    </Card>
  )
}
