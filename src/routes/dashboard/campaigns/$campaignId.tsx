import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Card, Stack, Text, Group, Badge, Button, Tabs, Grid } from '@mantine/core'
import { IconArrowLeft, IconEdit, IconPlayerPause, IconTrash } from '@tabler/icons-react'
import { PageHeader } from '#/components/PageHeader'

export const Route = createFileRoute('/dashboard/campaigns/$campaignId')({
  component: CampaignDetailPage,
})

function CampaignDetailPage() {
  const navigate = useNavigate()
  const { campaignId } = Route.useParams()

  // Mock data - in real app, fetch from API
  const campaign = {
    id: campaignId,
    name: 'Q3 SaaS Outreach',
    status: 'Running',
    leads: 2450,
    sent: 1240,
    openRate: 52,
    replyRate: 9.2,
    replies: 114,
    category: 'Outbound Sales',
    createdAt: '2024-01-15',
  }

  return (
    <div className="p-4 bg-slate-50/10 min-h-screen">
      <Stack gap="md">
        <Button
          variant="subtle"
          leftSection={<IconArrowLeft size={16} />}
          onClick={() => navigate({ to: '/dashboard/campaigns' })}
          w="fit-content"
        >
          Back to Campaigns
        </Button>

        <Group justify="space-between" align="center">
          <div>
            <Group gap="sm">
              <Text size="xl" fw={700}>
                {campaign.name}
              </Text>
              <Badge color="green" variant="light" size="lg">
                {campaign.status}
              </Badge>
            </Group>
            <Text size="sm" c="dimmed" mt="xs">
              Campaign ID: {campaign.id} • Created: {campaign.createdAt}
            </Text>
          </div>

          <Group gap="sm">
            <Button
              variant="default"
              leftSection={<IconEdit size={16} />}
              onClick={() => navigate({ to: `/dashboard/campaigns/${campaignId}/edit` })}
            >
              Edit
            </Button>
            <Button
              variant="default"
              leftSection={<IconPlayerPause size={16} />}
            >
              Pause
            </Button>
            <Button
              variant="outline"
              color="red"
              leftSection={<IconTrash size={16} />}
            >
              Delete
            </Button>
          </Group>
        </Group>

        {/* Stats Cards */}
        <Grid>
          <Grid.Col span={3}>
            <Card withBorder radius="md" p="lg" bg="white">
              <Text size="xs" c="dimmed" tt="uppercase" fw={600}>
                Total Leads
              </Text>
              <Text size="xl" fw={700} mt="xs">
                {campaign.leads.toLocaleString()}
              </Text>
            </Card>
          </Grid.Col>
          <Grid.Col span={3}>
            <Card withBorder radius="md" p="lg" bg="white">
              <Text size="xs" c="dimmed" tt="uppercase" fw={600}>
                Emails Sent
              </Text>
              <Text size="xl" fw={700} mt="xs">
                {campaign.sent.toLocaleString()}
              </Text>
            </Card>
          </Grid.Col>
          <Grid.Col span={3}>
            <Card withBorder radius="md" p="lg" bg="white">
              <Text size="xs" c="dimmed" tt="uppercase" fw={600}>
                Open Rate
              </Text>
              <Text size="xl" fw={700} mt="xs" c="blue">
                {campaign.openRate}%
              </Text>
            </Card>
          </Grid.Col>
          <Grid.Col span={3}>
            <Card withBorder radius="md" p="lg" bg="white">
              <Text size="xs" c="dimmed" tt="uppercase" fw={600}>
                Reply Rate
              </Text>
              <Text size="xl" fw={700} mt="xs" c="green">
                {campaign.replyRate}%
              </Text>
            </Card>
          </Grid.Col>
        </Grid>

        {/* Tabs for different views */}
        <Card withBorder radius="md" bg="white">
          <Tabs defaultValue="overview">
            <Tabs.List>
              <Tabs.Tab value="overview">Overview</Tabs.Tab>
              <Tabs.Tab value="leads">Leads</Tabs.Tab>
              <Tabs.Tab value="emails">Email Sequence</Tabs.Tab>
              <Tabs.Tab value="analytics">Analytics</Tabs.Tab>
              <Tabs.Tab value="settings">Settings</Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="overview" pt="lg">
              <Text size="sm" c="dimmed">
                Campaign overview content will go here...
              </Text>
            </Tabs.Panel>

            <Tabs.Panel value="leads" pt="lg">
              <Text size="sm" c="dimmed">
                Leads list will go here...
              </Text>
            </Tabs.Panel>

            <Tabs.Panel value="emails" pt="lg">
              <Text size="sm" c="dimmed">
                Email sequence details will go here...
              </Text>
            </Tabs.Panel>

            <Tabs.Panel value="analytics" pt="lg">
              <Text size="sm" c="dimmed">
                Analytics and charts will go here...
              </Text>
            </Tabs.Panel>

            <Tabs.Panel value="settings" pt="lg">
              <Text size="sm" c="dimmed">
                Campaign settings will go here...
              </Text>
            </Tabs.Panel>
          </Tabs>
        </Card>
      </Stack>
    </div>
  )
}
