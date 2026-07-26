import { Card, Select, Stack, Text, MultiSelect, NumberInput, Group, Badge, Paper } from '@mantine/core'
import { IconUsers, IconFilter } from '@tabler/icons-react'
import type { CampaignFormData } from './CreateCampaign'

interface CampaignAudienceProps {
  data: CampaignFormData
  onChange: (updates: Partial<CampaignFormData>) => void
}

const leadLists = [
  { value: 'list-1', label: 'Enterprise SaaS Leads (2,450)' },
  { value: 'list-2', label: 'SMB Prospects (1,320)' },
  { value: 'list-3', label: 'Agency Contacts (860)' },
  { value: 'list-4', label: 'Tech Startups (620)' }
]

const locations = [
  { value: 'us', label: 'United States' },
  { value: 'uk', label: 'United Kingdom' },
  { value: 'ca', label: 'Canada' },
  { value: 'de', label: 'Germany' },
  { value: 'fr', label: 'France' }
]

const industries = [
  { value: 'saas', label: 'SaaS' },
  { value: 'fintech', label: 'Fintech' },
  { value: 'healthcare', label: 'Healthcare' },
  { value: 'ecommerce', label: 'E-commerce' },
  { value: 'consulting', label: 'Consulting' }
]

const companySizes = [
  { value: '1-10', label: '1-10 employees' },
  { value: '11-50', label: '11-50 employees' },
  { value: '51-200', label: '51-200 employees' },
  { value: '201-500', label: '201-500 employees' },
  { value: '501+', label: '501+ employees' }
]

export function CampaignAudience({ data, onChange }: CampaignAudienceProps) {
  const updateFilters = (key: string, value: string[]) => {
    onChange({
      filters: {
        ...data.filters,
        [key]: value
      }
    })
  }

  return (
    <Stack gap="md" mt="md">
      <Card withBorder radius="md" p="xl" bg="white">
        <Stack gap="lg">
          <div>
            <Text fw={600} size="lg" mb="xs">
              Select Your Audience
            </Text>
            <Text size="sm" c="dimmed">
              Choose a lead list and apply filters to target specific prospects
            </Text>
          </div>

          <Select
            label="Lead List"
            placeholder="Select a lead list"
            data={leadLists}
            value={data.leadList}
            onChange={(value) => {
              onChange({ leadList: value || '' })
              // Simulate getting total leads count
              const selectedList = leadLists.find(l => l.value === value)
              if (selectedList) {
                const match = selectedList.label.match(/\(([0-9,]+)\)/)
                if (match) {
                  const count = Number.parseInt(match[1].replace(/,/g, ''))
                  onChange({ totalLeads: count })
                }
              }
            }}
            size="md"
            required
            leftSection={<IconUsers size={16} />}
          />

          <Paper withBorder p="md" radius="md" bg="blue.0">
            <Group>
              <IconFilter size={18} />
              <div>
                <Text size="sm" fw={600}>
                  Apply Filters
                </Text>
                <Text size="xs" c="dimmed">
                  Narrow down your audience with advanced filters
                </Text>
              </div>
            </Group>
          </Paper>

          <MultiSelect
            label="Location"
            placeholder="Select locations"
            data={locations}
            value={data.filters.location || []}
            onChange={(value) => updateFilters('location', value)}
            size="md"
            clearable
          />

          <MultiSelect
            label="Industry"
            placeholder="Select industries"
            data={industries}
            value={data.filters.industry || []}
            onChange={(value) => updateFilters('industry', value)}
            size="md"
            clearable
          />

          <MultiSelect
            label="Company Size"
            placeholder="Select company sizes"
            data={companySizes}
            value={data.filters.companySize || []}
            onChange={(value) => updateFilters('companySize', value)}
            size="md"
            clearable
          />
        </Stack>
      </Card>

      {data.totalLeads > 0 && (
        <Card withBorder radius="md" p="md" bg="indigo.0">
          <Group justify="space-between" align="center">
            <div>
              <Text size="sm" c="dimmed">
                Total Leads Selected
              </Text>
              <Text size="xl" fw={700} c="indigo.7">
                {data.totalLeads.toLocaleString()}
              </Text>
            </div>
            <Badge size="lg" color="indigo" variant="light">
              Ready to Launch
            </Badge>
          </Group>
        </Card>
      )}
    </Stack>
  )
}
