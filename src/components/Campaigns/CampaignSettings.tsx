import { Card, Stack, Text, NumberInput, Group, Switch, MultiSelect, Paper } from '@mantine/core'
import { DatePickerInput } from '@mantine/dates'
import { IconCalendar, IconMail, IconSettings } from '@tabler/icons-react'
import type { CampaignFormData } from './CreateCampaign'

interface CampaignSettingsProps {
  data: CampaignFormData
  onChange: (updates: Partial<CampaignFormData>) => void
}

const availableMailboxes = [
  { value: 'alex@roxshield.com', label: 'alex@roxshield.com (Score: 98)' },
  { value: 'team@roxshield.com', label: 'team@roxshield.com (Score: 96)' },
  { value: 'outreach@roxshield.com', label: 'outreach@roxshield.com (Score: 97)' },
  { value: 'sales@roxshield.com', label: 'sales@roxshield.com (Score: 95)' }
]

const timeZones = [
  { value: 'UTC', label: 'UTC (Coordinated Universal Time)' },
  { value: 'America/New_York', label: 'Eastern Time (ET)' },
  { value: 'America/Chicago', label: 'Central Time (CT)' },
  { value: 'America/Denver', label: 'Mountain Time (MT)' },
  { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
  { value: 'Europe/London', label: 'London (GMT)' },
  { value: 'Europe/Paris', label: 'Paris (CET)' }
]

export function CampaignSettings({ data, onChange }: CampaignSettingsProps) {
  const updateSchedule = (field: string, value: Date | null | string | number) => {
    onChange({
      sendingSchedule: {
        ...data.sendingSchedule,
        [field]: value
      }
    })
  }

  return (
    <Stack gap="md" mt="md">
      <Card withBorder radius="md" p="xl" bg="white">
        <Stack gap="lg">
          <Group gap="xs">
            <IconCalendar size={20} />
            <div>
              <Text fw={600} size="lg">
                Sending Schedule
              </Text>
              <Text size="sm" c="dimmed">
                Configure when and how your emails will be sent
              </Text>
            </div>
          </Group>

          <Group grow>
            <DatePickerInput
              label="Start Date"
              placeholder="Select start date"
              value={data.sendingSchedule.startDate}
              onChange={(value) => updateSchedule('startDate', value)}
              minDate={new Date()}
              size="md"
              required
            />

            <DatePickerInput
              label="End Date (Optional)"
              placeholder="Select end date"
              value={data.sendingSchedule.endDate}
              onChange={(value) => updateSchedule('endDate', value)}
              minDate={data.sendingSchedule.startDate || new Date()}
              size="md"
            />
          </Group>

          <NumberInput
            label="Daily Sending Limit"
            description="Maximum number of emails to send per day"
            min={10}
            max={1000}
            step={10}
            value={data.sendingSchedule.dailyLimit}
            onChange={(value) => updateSchedule('dailyLimit', Number(value))}
            size="md"
            required
          />
        </Stack>
      </Card>

      <Card withBorder radius="md" p="xl" bg="white">
        <Stack gap="lg">
          <Group gap="xs">
            <IconMail size={20} />
            <div>
              <Text fw={600} size="lg">
                Mailbox Configuration
              </Text>
              <Text size="sm" c="dimmed">
                Select which mailboxes to use for sending
              </Text>
            </div>
          </Group>

          <MultiSelect
            label="Sending Mailboxes"
            placeholder="Select mailboxes"
            data={availableMailboxes}
            value={data.mailboxes}
            onChange={(value) => onChange({ mailboxes: value })}
            size="md"
            required
            description="Emails will be distributed evenly across selected mailboxes"
          />
        </Stack>
      </Card>

      <Card withBorder radius="md" p="xl" bg="white">
        <Stack gap="lg">
          <Group gap="xs">
            <IconSettings size={20} />
            <div>
              <Text fw={600} size="lg">
                Tracking & Automation
              </Text>
              <Text size="sm" c="dimmed">
                Configure tracking and automation settings
              </Text>
            </div>
          </Group>

          <Stack gap="md">
            <Switch
              label="Track email opens"
              description="Monitor when recipients open your emails"
              checked={data.trackOpens}
              onChange={(e) => onChange({ trackOpens: e.currentTarget.checked })}
              size="md"
            />

            <Switch
              label="Track link clicks"
              description="Track when recipients click links in your emails"
              checked={data.trackClicks}
              onChange={(e) => onChange({ trackClicks: e.currentTarget.checked })}
              size="md"
            />

            <Switch
              label="Stop on reply"
              description="Automatically stop sending follow-ups when a recipient replies"
              checked={data.stopOnReply}
              onChange={(e) => onChange({ stopOnReply: e.currentTarget.checked })}
              size="md"
            />
          </Stack>
        </Stack>
      </Card>

      <Paper withBorder p="md" radius="md" bg="yellow.0">
        <Text size="sm" fw={500} mb="xs">
          ⚠️ Important Reminders
        </Text>
        <Text size="xs" c="dimmed">
          • Ensure your emails comply with anti-spam regulations (CAN-SPAM, GDPR)
          <br />
          • Include an unsubscribe link in all emails
          <br />
          • Monitor your mailbox reputation scores regularly
        </Text>
      </Paper>
    </Stack>
  )
}
