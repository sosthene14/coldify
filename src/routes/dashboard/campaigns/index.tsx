import { useState } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Group, Text, Stack, Button, Tabs, TextInput, Select, ActionIcon, Card, Badge } from '@mantine/core'
import { IconPlus, IconSearch, IconAdjustments } from '@tabler/icons-react'
import { CampaignsList } from '#/components/Campaigns'
import { CampaignsSidebar } from '#/components/Campaigns/CampaignsSidebar'

export const Route = createFileRoute('/dashboard/campaigns/')({
  component: CampaignsPage,
})

function CampaignsPage() {
  const navigate = useNavigate()
  const [activeFilter, setActiveFilter] = useState<string>('All Campaigns')
  const [activeTab, setActiveTab] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')

  // Map filter to status
  const getStatusFilter = (filter: string, tab: string) => {
    // Tab takes priority
    if (tab !== 'all') {
      switch (tab) {
        case 'running': return 'Running'
        case 'paused': return 'Paused'
        case 'completed': return 'Completed'
        case 'draft': return 'Draft'
      }
    }
    
    // Then sidebar filter
    switch (filter) {
      case 'All Campaigns': return 'All'
      case 'Starred': return 'Starred'
      case 'Archived': return 'Archived'
      case 'Running': return 'Running'
      case 'Paused': return 'Paused'
      case 'Completed': return 'Completed'
      case 'Draft': return 'Draft'
      default: return 'All'
    }
  }

  return (
    <div className="bg-white min-h-screen">
      <Group align="flex-start" gap={0} wrap="nowrap">
        {/* Left Sidebar */}
        <div style={{ 
          width: 240, 
          borderRight: '1px solid #E9ECEF',
          minHeight: '100vh',
          padding: '16px'
        }}>
          <Button
            leftSection={<IconPlus size={16} />}
            color="blue"
            fullWidth
            mb="lg"
            onClick={() => navigate({ to: '/dashboard/campaigns/new' })}
          >
            New Campaign
          </Button>

          <CampaignsSidebar 
            activeItem={activeFilter}
            onItemChange={setActiveFilter}
          />
        </div>

        {/* Main Content */}
        <div style={{ flex: 1, padding: '24px' }}>
          <Stack gap="md">
            {/* Title */}
            <Text size="xl" fw={700}>
              Campaigns
            </Text>

            {/* Tabs for status filter */}
           <Tabs value={activeTab} onChange={(v) => setActiveTab(v || "all")}>
  <Tabs.List>

    <Tabs.Tab value="all">
      <Group gap={8} wrap="nowrap">
        <Text size="sm" fw={500}>
          All Campaigns
        </Text>
        <Badge
          variant="light"
          radius="xl"
          size="sm"
          color="blue"
          px={8}
        >
          24
        </Badge>
      </Group>
    </Tabs.Tab>

    <Tabs.Tab value="running">
      <Group gap={8} wrap="nowrap">
        <Text size="sm" fw={500}>
          Running
        </Text>
        <Badge
          variant="light"
          radius="xl"
          size="sm"
          color="green"
          px={8}
        >
          8
        </Badge>
      </Group>
    </Tabs.Tab>

    <Tabs.Tab value="paused">
      <Group gap={8} wrap="nowrap">
        <Text size="sm" fw={500}>
          Paused
        </Text>
        <Badge
          variant="light"
          radius="xl"
          size="sm"
          color="yellow"
          px={8}
        >
          4
        </Badge>
      </Group>
    </Tabs.Tab>

    <Tabs.Tab value="completed">
      <Group gap={8} wrap="nowrap">
        <Text size="sm" fw={500}>
          Completed
        </Text>
        <Badge
          variant="light"
          radius="xl"
          size="sm"
          color="gray"
          px={8}
        >
          6
        </Badge>
      </Group>
    </Tabs.Tab>

    <Tabs.Tab value="draft">
      <Group gap={8} wrap="nowrap">
        <Text size="sm" fw={500}>
          Draft
        </Text>
        <Badge
          variant="light"
          radius="xl"
          size="sm"
          color="gray"
          px={8}
        >
          6
        </Badge>
      </Group>
    </Tabs.Tab>

  </Tabs.List>
</Tabs>

            {/* Search and Filters */}
            <Group justify="space-between" wrap="nowrap">
              <Group gap="sm">
                <TextInput
                  placeholder="Search campaigns..."
                  leftSection={<IconSearch size={16} />}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.currentTarget.value)}
                  w={250}
                />
                <Select
                  placeholder="All Folders"
                  data={['All Folders', 'Outbound Q2', 'SaaS Outreach', 'Agencies']}
                  w={150}
                  defaultValue="All Folders"
                />
                <Select
                  placeholder="All Status"
                  data={['All Status', 'Running', 'Paused', 'Draft', 'Completed']}
                  w={150}
                  defaultValue="All Status"
                />
                <Select
                  placeholder="Last Updated"
                  data={['Last Updated', 'Created Date', 'Name A-Z', 'Name Z-A']}
                  w={150}
                  defaultValue="Last Updated"
                />
              </Group>

              <ActionIcon variant="default" size="lg">
                <IconAdjustments size={18} />
              </ActionIcon>
            </Group>

            {/* Campaigns List */}
            <Card withBorder radius="md" p={0} bg="white">
              <CampaignsList 
                filterStatus={getStatusFilter(activeFilter, activeTab) as any}
                searchQuery={searchQuery}
              />
            </Card>
          </Stack>
        </div>
      </Group>
    </div>
  )
}
