import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Stack, Text, Button, Group, Card, Table, Badge, ActionIcon, Menu, TextInput, Select, Avatar, Progress, Tooltip, HoverCard } from '@mantine/core'
import { IconPlus, IconSearch, IconDots, IconFileImport, IconEdit, IconTrash, IconMail, IconExternalLink, IconStar, IconStarFilled } from '@tabler/icons-react'
import type { Lead, LeadStatus } from '#/types/lead'
import { LeadsSkeleton } from '#/components/Leads/LeadsSkeleton'

const statusColors: Record<LeadStatus, string> = {
  new: 'gray',
  contacted: 'blue',
  opened: 'cyan',
  clicked: 'indigo',
  replied: 'green',
  interested: 'teal',
  not_interested: 'orange',
  bounced: 'red',
  unsubscribed: 'red',
  do_not_contact: 'dark',
}

// Mock data with campaign-specific statuses
const mockLeads: Lead[] = [
  {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    fullName: 'John Doe',
    email: 'john.doe@acme.com',
    phone: '+1 (555) 123-4567',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
    jobTitle: 'CEO & Co-Founder',
    companyName: 'Acme Inc',
    companyWebsite: 'acme.com',
    companyDomain: 'acme.com',
    industry: 'SaaS',
    companySize: '51-200',
    linkedinUrl: 'https://linkedin.com/in/johndoe',
    country: 'United States',
    city: 'San Francisco',
    timezone: 'America/Los_Angeles',
    status: 'replied', // Statut global (le meilleur)
    campaignIds: ['1', '3'],
    campaignStatuses: [
      {
        campaignId: '1',
        campaignName: 'Q3 SaaS Outreach',
        status: 'replied',
        sequenceStep: 2,
        lastContactedAt: '2024-01-20T10:30:00Z',
        lastActivityAt: '2024-01-21T14:20:00Z',
      },
      {
        campaignId: '3',
        campaignName: 'Enterprise Outreach',
        status: 'clicked',
        sequenceStep: 1,
        lastContactedAt: '2024-01-19T15:00:00Z',
        lastActivityAt: '2024-01-19T16:30:00Z',
      },
    ],
    lastContactedAt: '2024-01-20T10:30:00Z',
    lastRepliedAt: '2024-01-21T14:20:00Z',
    emailsSentCount: 3,
    emailsOpenedCount: 3,
    emailsClickedCount: 2,
    leadScore: 85,
    tags: ['hot-lead', 'enterprise', 'decision-maker'],
    source: 'linkedin_scraper',
    gdprConsent: true,
    isUnsubscribed: false,
    createdAt: '2024-01-15T09:00:00Z',
    updatedAt: '2024-01-21T14:20:00Z',
  },
  {
    id: '2',
    firstName: 'Jane',
    lastName: 'Smith',
    fullName: 'Jane Smith',
    email: 'jane.smith@gmail.com', // Changed to Gmail
    phone: '+1 (555) 234-5678',
    jobTitle: 'CTO',
    companyName: 'TechCo',
    companyWebsite: 'techco.io',
    companyDomain: 'techco.io',
    industry: 'Technology',
    companySize: '11-50',
    country: 'United States',
    city: 'New York',
    status: 'opened',
    campaignIds: ['1'],
    campaignStatuses: [
      {
        campaignId: '1',
        campaignName: 'Q3 SaaS Outreach',
        status: 'opened',
        sequenceStep: 1,
        lastContactedAt: '2024-01-22T08:15:00Z',
        lastActivityAt: '2024-01-22T10:30:00Z',
      },
    ],
    lastContactedAt: '2024-01-22T08:15:00Z',
    emailsSentCount: 1,
    emailsOpenedCount: 1,
    emailsClickedCount: 0,
    leadScore: 65,
    tags: ['technical', 'follow-up'],
    source: 'csv_import',
    gdprConsent: true,
    isUnsubscribed: false,
    createdAt: '2024-01-18T11:00:00Z',
    updatedAt: '2024-01-22T08:15:00Z',
  },
  {
    id: '3',
    firstName: 'Bob',
    lastName: 'Johnson',
    fullName: 'Bob Johnson',
    email: 'bob@outlook.com', // Changed to Outlook
    jobTitle: 'Founder',
    companyName: 'Startup Inc',
    companyDomain: 'startup.io',
    industry: 'Fintech',
    companySize: '1-10',
    country: 'United Kingdom',
    city: 'London',
    status: 'contacted',
    campaignIds: ['2'],
    campaignStatuses: [
      {
        campaignId: '2',
        campaignName: 'Agency Prospecting',
        status: 'contacted',
        sequenceStep: 1,
        lastContactedAt: '2024-01-23T09:00:00Z',
      },
    ],
    lastContactedAt: '2024-01-23T09:00:00Z',
    emailsSentCount: 1,
    emailsOpenedCount: 0,
    emailsClickedCount: 0,
    leadScore: 45,
    tags: ['startup', 'warm'],
    source: 'manual',
    gdprConsent: true,
    isUnsubscribed: false,
    createdAt: '2024-01-20T10:00:00Z',
    updatedAt: '2024-01-23T09:00:00Z',
  },
  {
    id: '4',
    firstName: 'Alice',
    lastName: 'Williams',
    fullName: 'Alice Williams',
    email: 'alice.w@agency.com',
    phone: '+44 20 1234 5678',
    jobTitle: 'Marketing Director',
    companyName: 'Agency Co',
    companyDomain: 'agency.com',
    industry: 'Marketing',
    companySize: '201-500',
    country: 'United Kingdom',
    city: 'Manchester',
    status: 'interested',
    campaignIds: ['1', '2'],
    campaignStatuses: [
      {
        campaignId: '1',
        campaignName: 'Q3 SaaS Outreach',
        status: 'interested',
        sequenceStep: 3,
        lastContactedAt: '2024-01-19T15:30:00Z',
        lastActivityAt: '2024-01-20T11:45:00Z',
      },
      {
        campaignId: '2',
        campaignName: 'Agency Prospecting',
        status: 'opened',
        sequenceStep: 1,
        lastContactedAt: '2024-01-18T14:00:00Z',
        lastActivityAt: '2024-01-18T16:20:00Z',
      },
    ],
    lastContactedAt: '2024-01-19T15:30:00Z',
    lastRepliedAt: '2024-01-20T11:45:00Z',
    emailsSentCount: 4,
    emailsOpenedCount: 4,
    emailsClickedCount: 3,
    leadScore: 92,
    tags: ['hot-lead', 'marketing', 'qualified'],
    source: 'apollo',
    gdprConsent: true,
    isUnsubscribed: false,
    createdAt: '2024-01-10T08:00:00Z',
    updatedAt: '2024-01-20T11:45:00Z',
  },
]

export function LeadsPage() {
  const navigate = useNavigate()

  const getEngagementRate = (lead: Lead) => {
    if (lead.emailsSentCount === 0) return 0
    return Math.round(((lead.emailsOpenedCount + lead.emailsClickedCount * 2) / (lead.emailsSentCount * 2)) * 100)
  }

  const getEmailProvider = (email: string): string => {
    const domain = email.split('@')[1]?.toLowerCase()
    
    if (!domain) return 'unknown'
    
    // Map common domains to providers
    if (domain.includes('gmail.com')) return 'Gmail'
    if (domain.includes('outlook.com') || domain.includes('hotmail.com') || domain.includes('live.com')) return 'Outlook'
    if (domain.includes('yahoo.com')) return 'Yahoo'
    if (domain.includes('icloud.com') || domain.includes('me.com')) return 'iCloud'
    if (domain.includes('protonmail.com') || domain.includes('proton.me')) return 'ProtonMail'
    
    // For company domains, return "Corporate"
    return 'Corporate'
  }

  // Get unique email providers from all leads
  const emailProviders = Array.from(
    new Set(mockLeads.map(lead => getEmailProvider(lead.email)))
  ).sort()

  return (
    <div className="p-4 bg-slate-50/10 min-h-screen">
      <Stack gap="md">
        <Group justify="space-between">
          <div>
            <Text size="xl" fw={700}>
              Leads
            </Text>
            <Group gap="md">
              <Text size="sm" c="dimmed">
                {mockLeads.length} leads • {mockLeads.filter(l => l.campaignStatuses?.some(c => c.status === 'replied')).length} replied • {mockLeads.filter(l => l.leadScore && l.leadScore > 80).length} hot leads
              </Text>
              <Group gap="xs">
                {emailProviders.map(provider => (
                  <Badge key={provider} size="sm" variant="light" color={
                    provider === 'Corporate' ? 'blue' :
                    provider === 'Gmail' ? 'red' :
                    provider === 'Outlook' ? 'cyan' :
                    'gray'
                  }>
                    {provider}: {mockLeads.filter(l => getEmailProvider(l.email) === provider).length}
                  </Badge>
                ))}
              </Group>
            </Group>
          </div>
          <Group gap="sm">
            <Button
              variant="default"
              leftSection={<IconFileImport size={16} />}
              onClick={() => navigate({ to: '/dashboard/leads/import' })}
            >
              Import Leads
            </Button>
            <Button
              leftSection={<IconPlus size={16} />}
              color="blue"
            >
              Add Lead
            </Button>
          </Group>
        </Group>

        <Group gap="sm" wrap="wrap">
          <TextInput
            placeholder="Search leads..."
            leftSection={<IconSearch size={16} />}
            w={300}
          />
          <Select
            placeholder="All Status"
            data={[
              { value: 'all', label: 'All Status' },
              { value: 'new', label: 'New' },
              { value: 'contacted', label: 'Contacted' },
              { value: 'replied', label: 'Replied' },
              { value: 'interested', label: 'Interested' },
            ]}
            w={150}
            defaultValue="all"
          />
          <Select
            placeholder="All Sources"
            data={[
              { value: 'all', label: 'All Sources' },
              { value: 'manual', label: 'Manual' },
              { value: 'csv_import', label: 'CSV Import' },
              { value: 'apollo', label: 'Apollo' },
              { value: 'linkedin_scraper', label: 'LinkedIn' },
            ]}
            w={150}
            defaultValue="all"
          />
          <Select
            placeholder="All Campaigns"
            data={['All Campaigns', 'Q3 SaaS Outreach', 'Agency Prospecting']}
            w={180}
            defaultValue="All Campaigns"
          />
          <Select
            placeholder="Email Provider"
            data={[
              { value: 'all', label: 'All Providers' },
              ...emailProviders.map(provider => ({ value: provider, label: provider }))
            ]}
            w={150}
            defaultValue="all"
          />
        </Group>

        <Card withBorder radius="md" p="lg" bg="white">
          <Table
            verticalSpacing="sm"
            horizontalSpacing="md"
            highlightOnHover
            highlightOnHoverColor="gray.0"
          >
            <Table.Thead>
              <Table.Tr>
                <Table.Th>
                  <Text size="xs" fw={600} c="dimmed" tt="uppercase">
                    Lead
                  </Text>
                </Table.Th>
                <Table.Th>
                  <Text size="xs" fw={600} c="dimmed" tt="uppercase">
                    Company
                  </Text>
                </Table.Th>
                <Table.Th>
                  <Text size="xs" fw={600} c="dimmed" tt="uppercase">
                    Campaign Status
                  </Text>
                </Table.Th>
                <Table.Th>
                  <Text size="xs" fw={600} c="dimmed" tt="uppercase">
                    Engagement
                  </Text>
                </Table.Th>
                <Table.Th>
                  <Text size="xs" fw={600} c="dimmed" tt="uppercase">
                    Score
                  </Text>
                </Table.Th>
                <Table.Th>
                  <Text size="xs" fw={600} c="dimmed" tt="uppercase">
                    Actions
                  </Text>
                </Table.Th>
              </Table.Tr>
            </Table.Thead>

            <Table.Tbody>
              {mockLeads.map((lead) => {
                const engagementRate = getEngagementRate(lead)
                
                return (
                  <Table.Tr 
                    key={lead.id}
                    style={{ cursor: 'pointer' }}
                    onClick={() => navigate({ to: `/dashboard/leads/${lead.id}` })}
                  >
                    <Table.Td>
                      <Group gap="sm" wrap="nowrap">
                        <Avatar
                          src={lead.avatarUrl}
                          size={36}
                          radius="xl"
                        >
                          {lead.firstName[0]}{lead.lastName[0]}
                        </Avatar>
                        <div style={{ flex: 1 }}>
                          <Group gap={4}>
                            <Text size="sm" fw={500}>
                              {lead.fullName}
                            </Text>
                            {lead.leadScore && lead.leadScore > 80 && (
                              <IconStarFilled size={12} color="#FAB005" />
                            )}
                          </Group>
                          <Group gap={4}>
                            <Text size="xs" c="dimmed">
                              {lead.email}
                            </Text>
                            <Badge 
                              size="xs" 
                              variant="dot" 
                              color={
                                getEmailProvider(lead.email) === 'Corporate' ? 'blue' :
                                getEmailProvider(lead.email) === 'Gmail' ? 'red' :
                                getEmailProvider(lead.email) === 'Outlook' ? 'cyan' :
                                'gray'
                              }
                            >
                              {getEmailProvider(lead.email)}
                            </Badge>
                          </Group>
                        </div>
                      </Group>
                    </Table.Td>
                    <Table.Td>
                      <div>
                        <Text size="sm" fw={500}>
                          {lead.companyName}
                        </Text>
                        <Text size="xs" c="dimmed">
                          {lead.jobTitle}
                        </Text>
                      </div>
                    </Table.Td>
                    <Table.Td>
                      {lead.campaignStatuses && lead.campaignStatuses.length > 0 ? (
                        <HoverCard width={280} shadow="md" position="right">
                          <HoverCard.Target>
                            <div style={{ cursor: 'pointer' }}>
                              <Group gap={4}>
                                <Badge
                                  color={statusColors[lead.campaignStatuses[0].status]}
                                  variant="light"
                                  size="sm"
                                >
                                  {lead.campaignStatuses[0].status.replace('_', ' ')}
                                </Badge>
                                {lead.campaignStatuses.length > 1 && (
                                  <Badge variant="light" color="gray" size="sm">
                                    +{lead.campaignStatuses.length - 1}
                                  </Badge>
                                )}
                              </Group>
                              <Text size="xs" c="dimmed" mt={2}>
                                {lead.campaignStatuses[0].campaignName}
                              </Text>
                            </div>
                          </HoverCard.Target>
                          <HoverCard.Dropdown>
                            <Stack gap="xs">
                              <Text size="sm" fw={600}>Campaign Statuses</Text>
                              {lead.campaignStatuses.map((cs) => (
                                <div key={cs.campaignId}>
                                  <Group justify="space-between" mb={2}>
                                    <Text size="xs" fw={500}>
                                      {cs.campaignName}
                                    </Text>
                                    <Badge
                                      color={statusColors[cs.status]}
                                      variant="light"
                                      size="xs"
                                    >
                                      {cs.status.replace('_', ' ')}
                                    </Badge>
                                  </Group>
                                  <Text size="xs" c="dimmed">
                                    Step {cs.sequenceStep} • Last activity:{' '}
                                    {cs.lastActivityAt 
                                      ? new Date(cs.lastActivityAt).toLocaleDateString()
                                      : 'No activity'}
                                  </Text>
                                </div>
                              ))}
                            </Stack>
                          </HoverCard.Dropdown>
                        </HoverCard>
                      ) : (
                        <Badge color="gray" variant="light" size="sm">
                          No campaigns
                        </Badge>
                      )}
                    </Table.Td>
                    <Table.Td>
                      <div style={{ width: 100 }}>
                        <Group gap={4} mb={4}>
                          <Text size="xs" c="dimmed">
                            {engagementRate}%
                          </Text>
                          <Text size="xs" c="dimmed">
                            ({lead.emailsOpenedCount}/{lead.emailsSentCount})
                          </Text>
                        </Group>
                        <Progress
                          value={engagementRate}
                          color={engagementRate > 70 ? 'green' : engagementRate > 40 ? 'yellow' : 'red'}
                          size="sm"
                          radius="xl"
                        />
                      </div>
                    </Table.Td>
                    <Table.Td>
                      {lead.leadScore ? (
                        <Tooltip label="Lead Score">
                          <Badge
                            color={lead.leadScore > 80 ? 'green' : lead.leadScore > 60 ? 'yellow' : 'gray'}
                            variant="filled"
                            size="lg"
                            style={{ minWidth: 40 }}
                          >
                            {lead.leadScore}
                          </Badge>
                        </Tooltip>
                      ) : (
                        <Text size="sm" c="dimmed">—</Text>
                      )}
                    </Table.Td>
                    <Table.Td>
                      <Group gap="xs">
                        <Tooltip label="Send Email">
                          <ActionIcon
                            variant="subtle"
                            color="blue"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                            }}
                          >
                            <IconMail size={16} />
                          </ActionIcon>
                        </Tooltip>

                        <Menu shadow="md" width={160} position="bottom-end">
                          <Menu.Target>
                            <ActionIcon
                              variant="subtle"
                              color="gray"
                              size="sm"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <IconDots size={16} />
                            </ActionIcon>
                          </Menu.Target>
                          <Menu.Dropdown>
                            <Menu.Item leftSection={<IconEdit size={14} />}>
                              Edit
                            </Menu.Item>
                            <Menu.Item leftSection={<IconExternalLink size={14} />}>
                              View LinkedIn
                            </Menu.Item>
                            <Menu.Divider />
                            <Menu.Item color="red" leftSection={<IconTrash size={14} />}>
                              Delete
                            </Menu.Item>
                          </Menu.Dropdown>
                        </Menu>
                      </Group>
                    </Table.Td>
                  </Table.Tr>
                )
              })}
            </Table.Tbody>
          </Table>

          <Group justify="space-between" mt="md">
            <Text size="sm" c="dimmed">
              Showing 1 to {mockLeads.length} of {mockLeads.length} leads
            </Text>
          </Group>
        </Card>
      </Stack>
    </div>
  )
}
