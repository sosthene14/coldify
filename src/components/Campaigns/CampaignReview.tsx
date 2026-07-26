import { Card, Stack, Text, Group, Badge, Divider, Paper, List, ThemeIcon } from '@mantine/core'
import { IconCheck, IconMail, IconUsers, IconCalendar, IconSettings } from '@tabler/icons-react'
import type { CampaignFormData } from './CreateCampaign'

interface CampaignReviewProps {
  data: CampaignFormData
}

export function CampaignReview({ data }: CampaignReviewProps) {
  const formatDate = (date: Date | null) => {
    if (!date) return 'Not set'
    return new Date(date).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  return (
    <Stack gap="md" mt="md">
      <Paper withBorder p="lg" radius="md" bg="green.0">
        <Group>
          <ThemeIcon size="xl" radius="md" color="green" variant="light">
            <IconCheck size={24} />
          </ThemeIcon>
          <div>
            <Text fw={600} size="lg">
              Campaign Ready to Launch
            </Text>
            <Text size="sm" c="dimmed">
              Review your campaign details below before launching
            </Text>
          </div>
        </Group>
      </Paper>

      <Card withBorder radius="md" p="lg" bg="white">
        <Stack gap="lg">
          <Group gap="xs">
            <IconMail size={20} />
            <Text fw={600} size="md">
              Campaign Information
            </Text>
          </Group>

          <Stack gap="xs">
            <Group justify="space-between">
              <Text size="sm" c="dimmed">Campaign Name</Text>
              <Text size="sm" fw={500}>{data.name || 'Not set'}</Text>
            </Group>
            
            <Group justify="space-between">
              <Text size="sm" c="dimmed">Description</Text>
              <Text size="sm" fw={500} maw={300} ta="right">
                {data.description || 'Not set'}
              </Text>
            </Group>

            <Group justify="space-between">
              <Text size="sm" c="dimmed">Category</Text>
              <Badge variant="light" size="sm">
                {data.category || 'Not set'}
              </Badge>
            </Group>
          </Stack>
        </Stack>
      </Card>

      <Card withBorder radius="md" p="lg" bg="white">
        <Stack gap="lg">
          <Group gap="xs">
            <IconUsers size={20} />
            <Text fw={600} size="md">
              Audience
            </Text>
          </Group>

          <Stack gap="xs">
            <Group justify="space-between">
              <Text size="sm" c="dimmed">Total Leads</Text>
              <Text size="sm" fw={600} c="indigo">
                {data.totalLeads.toLocaleString()}
              </Text>
            </Group>

            {data.filters.location && data.filters.location.length > 0 && (
              <Group justify="space-between">
                <Text size="sm" c="dimmed">Locations</Text>
                <Group gap="xs">
                  {data.filters.location.map((loc) => (
                    <Badge key={loc} size="xs" variant="light">
                      {loc.toUpperCase()}
                    </Badge>
                  ))}
                </Group>
              </Group>
            )}

            {data.filters.industry && data.filters.industry.length > 0 && (
              <Group justify="space-between">
                <Text size="sm" c="dimmed">Industries</Text>
                <Group gap="xs">
                  {data.filters.industry.slice(0, 3).map((ind) => (
                    <Badge key={ind} size="xs" variant="light">
                      {ind}
                    </Badge>
                  ))}
                  {data.filters.industry.length > 3 && (
                    <Badge size="xs" variant="light">
                      +{data.filters.industry.length - 3}
                    </Badge>
                  )}
                </Group>
              </Group>
            )}
          </Stack>
        </Stack>
      </Card>

      <Card withBorder radius="md" p="lg" bg="white">
        <Stack gap="lg">
          <Group justify="space-between" align="center">
            <Group gap="xs">
              <IconMail size={20} />
              <Text fw={600} size="md">
                Email Sequence
              </Text>
            </Group>
            <Badge size="lg" color="blue" variant="light">
              {data.emails.length} {data.emails.length === 1 ? 'Email' : 'Emails'}
            </Badge>
          </Group>

          <List
            spacing="sm"
            size="sm"
            center
            icon={
              <ThemeIcon color="blue" size={20} radius="xl" variant="light">
                <IconCheck size={12} />
              </ThemeIcon>
            }
          >
            {data.emails.map((email, index) => (
              <List.Item key={email.id}>
                <Text size="sm">
                  <strong>{index === 0 ? 'Initial Email' : `Follow-up ${index}`}</strong>
                  {index > 0 && ` (Day ${email.delayDays})`}
                </Text>
                <Text size="xs" c="dimmed" truncate>
                  {email.subject || 'No subject'}
                </Text>
              </List.Item>
            ))}
          </List>
        </Stack>
      </Card>

      <Card withBorder radius="md" p="lg" bg="white">
        <Stack gap="lg">
          <Group gap="xs">
            <IconCalendar size={20} />
            <Text fw={600} size="md">
              Schedule & Settings
            </Text>
          </Group>

          <Stack gap="xs">
            <Group justify="space-between">
              <Text size="sm" c="dimmed">Start Date</Text>
              <Text size="sm" fw={500}>
                {formatDate(data.sendingSchedule.startDate)}
              </Text>
            </Group>

            <Group justify="space-between">
              <Text size="sm" c="dimmed">Daily Limit</Text>
              <Text size="sm" fw={500}>
                {data.sendingSchedule.dailyLimit} emails/day
              </Text>
            </Group>

            <Group justify="space-between">
              <Text size="sm" c="dimmed">Mailboxes</Text>
              <Text size="sm" fw={500}>
                {data.mailboxes.length} selected
              </Text>
            </Group>

            <Divider my="xs" />

            <Group justify="space-between">
              <Text size="sm" c="dimmed">Track Opens</Text>
              <Badge 
                size="sm" 
                color={data.trackOpens ? 'green' : 'gray'} 
                variant="light"
              >
                {data.trackOpens ? 'Enabled' : 'Disabled'}
              </Badge>
            </Group>

            <Group justify="space-between">
              <Text size="sm" c="dimmed">Track Clicks</Text>
              <Badge 
                size="sm" 
                color={data.trackClicks ? 'green' : 'gray'} 
                variant="light"
              >
                {data.trackClicks ? 'Enabled' : 'Disabled'}
              </Badge>
            </Group>

            <Group justify="space-between">
              <Text size="sm" c="dimmed">Stop on Reply</Text>
              <Badge 
                size="sm" 
                color={data.stopOnReply ? 'green' : 'gray'} 
                variant="light"
              >
                {data.stopOnReply ? 'Enabled' : 'Disabled'}
              </Badge>
            </Group>
          </Stack>
        </Stack>
      </Card>

      <Paper withBorder p="md" radius="md" bg="blue.0">
        <Text size="sm" fw={500} mb="xs">
          📊 Estimated Campaign Reach
        </Text>
        <Text size="xs" c="dimmed">
          With {data.totalLeads.toLocaleString()} leads and a daily limit of {data.sendingSchedule.dailyLimit} emails,
          your initial email will be sent over approximately{' '}
          <strong>{Math.ceil(data.totalLeads / data.sendingSchedule.dailyLimit)} days</strong>.
        </Text>
      </Paper>
    </Stack>
  )
}
