import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Stack, Text, Button, Group, Card, Badge, Avatar, Tabs, Timeline, ActionIcon, ThemeIcon, Progress, Grid, Paper, Divider, Tooltip, RingProgress } from '@mantine/core'
import { IconArrowLeft, IconEdit, IconMail, IconPhone, IconBrandLinkedin, IconMapPin, IconBuilding, IconClock, IconTrendingUp, IconStar, IconExternalLink, IconCheck, IconX, IconMouse, IconClick, IconCalendar, IconTag, IconWorld, IconBriefcase, IconUsers, IconChartBar } from '@tabler/icons-react'
import type { Lead, LeadStatus } from '#/types/lead'

export const Route = createFileRoute('/dashboard/leads/$leadId')({
  component: LeadDetailPage,
})

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

// Mock lead data enriched
const mockLead: Lead = {
  id: '1',
  firstName: 'John',
  lastName: 'Doe',
  fullName: 'John Doe',
  email: 'john.doe@acme.com',
  secondaryEmail: 'j.doe@gmail.com',
  phone: '+1 (555) 123-4567',
  avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
  jobTitle: 'CEO & Co-Founder',
  companyName: 'Acme Inc',
  companyWebsite: 'acme.com',
  companyDomain: 'acme.com',
  industry: 'SaaS',
  companySize: '51-200',
  linkedinUrl: 'https://linkedin.com/in/johndoe',
  companyLinkedinUrl: 'https://linkedin.com/company/acme',
  country: 'United States',
  city: 'San Francisco, CA',
  timezone: 'America/Los_Angeles (PST)',
  status: 'replied',
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
  tags: ['hot-lead', 'enterprise', 'decision-maker', 'q2-2024', 'high-priority'],
  source: 'linkedin_scraper',
  customFields: [
    { key: 'Department', value: 'Executive' },
    { key: 'Employee Count', value: '150' },
    { key: 'Annual Revenue', value: '$10M-$50M' },
    { key: 'Tech Stack', value: 'React, Node.js, AWS' },
    { key: 'Current Solution', value: 'Competitor A' },
  ],
  gdprConsent: true,
  isUnsubscribed: false,
  createdAt: '2024-01-15T09:00:00Z',
  updatedAt: '2024-01-21T14:20:00Z',
  notes: 'Very interested in our enterprise plan. Mentioned they are looking to scale their team in Q2. Budget approved for $50k+. Follow up next week.',
}

// Mock campaigns
const mockCampaigns = [
  {
    id: '1',
    name: 'Q3 SaaS Outreach',
    status: 'Running',
    step: 2,
    totalSteps: 4,
    sent: 2,
    opened: 2,
    clicked: 1,
    replied: 1,
    lastEmailSubject: 'Follow-up: Enterprise Plan Discussion',
    nextEmailScheduled: '2024-01-25T10:00:00Z',
  },
  {
    id: '3',
    name: 'Enterprise Outreach',
    status: 'Running',
    step: 1,
    totalSteps: 3,
    sent: 1,
    opened: 1,
    clicked: 1,
    replied: 0,
    lastEmailSubject: 'Introduction to Acme Solutions',
    nextEmailScheduled: '2024-01-24T14:00:00Z',
  },
]

// Mock activity timeline
const mockActivity = [
  {
    date: '2024-01-21T14:20:00Z',
    type: 'reply',
    title: 'Replied to email',
    description: 'Showed interest in enterprise plan. Asked about pricing for 50+ users.',
    campaign: 'Q3 SaaS Outreach',
  },
  {
    date: '2024-01-21T10:15:00Z',
    type: 'click',
    title: 'Clicked link in email',
    description: 'Pricing page - viewed for 3 minutes',
    campaign: 'Q3 SaaS Outreach',
  },
  {
    date: '2024-01-20T14:30:00Z',
    type: 'open',
    title: 'Opened email',
    description: 'Follow-up #2',
    campaign: 'Q3 SaaS Outreach',
  },
  {
    date: '2024-01-20T10:30:00Z',
    type: 'sent',
    title: 'Email sent',
    description: 'Follow-up #2: Enterprise Plan Discussion',
    campaign: 'Q3 SaaS Outreach',
  },
  {
    date: '2024-01-19T16:30:00Z',
    type: 'click',
    title: 'Clicked link',
    description: 'Case studies page',
    campaign: 'Enterprise Outreach',
  },
  {
    date: '2024-01-19T15:00:00Z',
    type: 'sent',
    title: 'Email sent',
    description: 'Introduction to Acme Solutions',
    campaign: 'Enterprise Outreach',
  },
  {
    date: '2024-01-18T09:15:00Z',
    type: 'open',
    title: 'Opened email',
    description: 'Initial email',
    campaign: 'Q3 SaaS Outreach',
  },
  {
    date: '2024-01-18T08:00:00Z',
    type: 'sent',
    title: 'Email sent',
    description: 'Initial email',
    campaign: 'Q3 SaaS Outreach',
  },
  {
    date: '2024-01-16T11:30:00Z',
    type: 'note',
    title: 'Note added',
    description: 'Budget approved for Q2. High priority lead.',
  },
  {
    date: '2024-01-15T14:20:00Z',
    type: 'tag',
    title: 'Tags added',
    description: 'Added tags: hot-lead, enterprise, decision-maker',
  },
  {
    date: '2024-01-15T09:00:00Z',
    type: 'created',
    title: 'Lead created',
    description: 'Added via LinkedIn Scraper',
  },
]

const activityIcons: Record<string, any> = {
  reply: { icon: IconMail, color: 'green' },
  click: { icon: IconClick, color: 'indigo' },
  open: { icon: IconMouse, color: 'blue' },
  sent: { icon: IconMail, color: 'gray' },
  note: { icon: IconEdit, color: 'yellow' },
  tag: { icon: IconTag, color: 'pink' },
  created: { icon: IconCheck, color: 'teal' },
}

function LeadDetailPage() {
  const navigate = useNavigate()
  const { leadId } = Route.useParams()

  const engagementRate = mockLead.emailsSentCount > 0 
    ? Math.round(((mockLead.emailsOpenedCount + mockLead.emailsClickedCount * 2) / (mockLead.emailsSentCount * 2)) * 100)
    : 0

  const openRate = mockLead.emailsSentCount > 0
    ? Math.round((mockLead.emailsOpenedCount / mockLead.emailsSentCount) * 100)
    : 0

  const clickRate = mockLead.emailsSentCount > 0
    ? Math.round((mockLead.emailsClickedCount / mockLead.emailsSentCount) * 100)
    : 0

  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffMins < 60) return `${diffMins} min ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return date.toLocaleDateString()
  }

  const formatScheduled = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className="p-4 bg-slate-50/10 min-h-screen">
      <Stack gap="md">
        <Button
          variant="subtle"
          leftSection={<IconArrowLeft size={16} />}
          onClick={() => navigate({ to: '/dashboard/leads' })}
          w="fit-content"
        >
          Back to Leads
        </Button>

        {/* Enhanced Header with more info */}
        <Card withBorder radius="md" p="lg" bg="white">
          <Grid>
            <Grid.Col span={8}>
              <Group gap="md">
                <Avatar src={mockLead.avatarUrl} size={80} radius="md">
                  {mockLead.firstName[0]}{mockLead.lastName[0]}
                </Avatar>
                <div style={{ flex: 1 }}>
                  <Group gap="sm" mb="xs">
                    <Text size="xl" fw={700}>{mockLead.fullName}</Text>
                    <Badge color={statusColors[mockLead.status]} variant="light">
                      {mockLead.status.replace('_', ' ')}
                    </Badge>
                    {mockLead.leadScore && mockLead.leadScore > 80 && (
                      <Badge color="yellow" variant="filled" leftSection={<IconStar size={12} />}>
                        Hot Lead
                      </Badge>
                    )}
                  </Group>
                  <Text size="sm" c="dimmed" mb="sm">
                    {mockLead.jobTitle} at {mockLead.companyName}
                  </Text>
                  <Group gap="md" wrap="wrap">
                    <Group gap={4}>
                      <IconMail size={14} color="#868E96" />
                      <Text size="xs" c="dimmed">{mockLead.email}</Text>
                    </Group>
                    {mockLead.phone && (
                      <Group gap={4}>
                        <IconPhone size={14} color="#868E96" />
                        <Text size="xs" c="dimmed">{mockLead.phone}</Text>
                      </Group>
                    )}
                    {mockLead.city && (
                      <Group gap={4}>
                        <IconMapPin size={14} color="#868E96" />
                        <Text size="xs" c="dimmed">{mockLead.city}</Text>
                      </Group>
                    )}
                    {mockLead.linkedinUrl && (
                      <Group gap={4} style={{ cursor: 'pointer' }}>
                        <IconBrandLinkedin size={14} color="#0A66C2" />
                        <Text size="xs" c="blue">LinkedIn Profile</Text>
                      </Group>
                    )}
                  </Group>
                  
                  {/* Tags */}
                  <Group gap="xs" mt="sm">
                    {mockLead.tags.slice(0, 4).map((tag) => (
                      <Badge key={tag} size="sm" variant="light" color="indigo">
                        {tag}
                      </Badge>
                    ))}
                    {mockLead.tags.length > 4 && (
                      <Badge size="sm" variant="light" color="gray">
                        +{mockLead.tags.length - 4} more
                      </Badge>
                    )}
                  </Group>
                </div>
              </Group>
            </Grid.Col>
            
            <Grid.Col span={4}>
              <Stack gap="sm" align="flex-end">
                <Group gap="sm">
                  <Button variant="default" leftSection={<IconEdit size={16} />}>
                    Edit
                  </Button>
                  <Button leftSection={<IconMail size={16} />}>
                    Send Email
                  </Button>
                </Group>
                
                {/* Quick Stats */}
                <Paper withBorder p="sm" radius="md" w="100%">
                  <Group justify="space-between" mb="xs">
                    <Group gap={4}>
                      <IconClock size={14} color="#868E96" />
                      <Text size="xs" c="dimmed">Last Contact</Text>
                    </Group>
                    <Text size="xs" fw={500}>
                      {getRelativeTime(mockLead.lastContactedAt!)}
                    </Text>
                  </Group>
                  {mockLead.lastRepliedAt && (
                    <Group justify="space-between">
                      <Group gap={4}>
                        <IconMail size={14} color="#40C057" />
                        <Text size="xs" c="dimmed">Last Reply</Text>
                      </Group>
                      <Text size="xs" fw={500} c="green">
                        {getRelativeTime(mockLead.lastRepliedAt)}
                      </Text>
                    </Group>
                  )}
                </Paper>
              </Stack>
            </Grid.Col>
          </Grid>
        </Card>

        {/* Enhanced Stats Cards */}
        <Grid>
          <Grid.Col span={2.4}>
            <Card withBorder radius="md" p="md" bg="white">
              <Group gap="xs" mb="xs">
                <ThemeIcon size="sm" color="blue" variant="light">
                  <IconMail size={14} />
                </ThemeIcon>
                <Text size="xs" tt="uppercase" fw={600} c="dimmed">
                  Emails Sent
                </Text>
              </Group>
              <Text size="xl" fw={700}>{mockLead.emailsSentCount}</Text>
              <Text size="xs" c="dimmed" mt={4}>
                {mockLead.emailsOpenedCount} opened
              </Text>
            </Card>
          </Grid.Col>

          <Grid.Col span={2.4}>
            <Card withBorder radius="md" p="md" bg="white">
              <Group gap="xs" mb="xs">
                <ThemeIcon size="sm" color="cyan" variant="light">
                  <IconMouse size={14} />
                </ThemeIcon>
                <Text size="xs" tt="uppercase" fw={600} c="dimmed">
                  Open Rate
                </Text>
              </Group>
              <Group align="flex-end" gap={4}>
                <Text size="xl" fw={700}>{openRate}%</Text>
                <RingProgress
                  size={40}
                  thickness={4}
                  sections={[{ value: openRate, color: 'cyan' }]}
                />
              </Group>
            </Card>
          </Grid.Col>

          <Grid.Col span={2.4}>
            <Card withBorder radius="md" p="md" bg="white">
              <Group gap="xs" mb="xs">
                <ThemeIcon size="sm" color="indigo" variant="light">
                  <IconClick size={14} />
                </ThemeIcon>
                <Text size="xs" tt="uppercase" fw={600} c="dimmed">
                  Click Rate
                </Text>
              </Group>
              <Group align="flex-end" gap={4}>
                <Text size="xl" fw={700}>{clickRate}%</Text>
                <RingProgress
                  size={40}
                  thickness={4}
                  sections={[{ value: clickRate, color: 'indigo' }]}
                />
              </Group>
            </Card>
          </Grid.Col>

          <Grid.Col span={2.4}>
            <Card withBorder radius="md" p="md" bg="white">
              <Group gap="xs" mb="xs">
                <ThemeIcon size="sm" color="green" variant="light">
                  <IconTrendingUp size={14} />
                </ThemeIcon>
                <Text size="xs" tt="uppercase" fw={600} c="dimmed">
                  Engagement
                </Text>
              </Group>
              <Text size="xl" fw={700}>{engagementRate}%</Text>
              <Progress value={engagementRate} color="green" size="sm" mt={8} />
            </Card>
          </Grid.Col>

          <Grid.Col span={2.4}>
            <Card withBorder radius="md" p="md" bg="white">
              <Group gap="xs" mb="xs">
                <ThemeIcon size="sm" color="yellow" variant="light">
                  <IconStar size={14} />
                </ThemeIcon>
                <Text size="xs" tt="uppercase" fw={600} c="dimmed">
                  Lead Score
                </Text>
              </Group>
              <Group align="flex-end" gap={8}>
                <Text size="xl" fw={700}>{mockLead.leadScore}</Text>
                <Badge size="sm" color={mockLead.leadScore && mockLead.leadScore > 80 ? 'green' : 'yellow'}>
                  {mockLead.leadScore && mockLead.leadScore > 80 ? 'High' : 'Medium'}
                </Badge>
              </Group>
            </Card>
          </Grid.Col>
        </Grid>

        {/* Tabs: Activity / Campaigns / Details / Notes */}
        <Card withBorder radius="md" p="lg" bg="white">
          <Tabs defaultValue="activity">
            <Tabs.List>
              <Tabs.Tab value="activity" leftSection={<IconChartBar size={14} />}>
                Activity
              </Tabs.Tab>
              <Tabs.Tab value="campaigns" leftSection={<IconMail size={14} />}>
                Campaigns ({mockCampaigns.length})
              </Tabs.Tab>
              <Tabs.Tab value="details" leftSection={<IconBriefcase size={14} />}>
                Company & Details
              </Tabs.Tab>
              <Tabs.Tab value="notes" leftSection={<IconEdit size={14} />}>
                Notes
              </Tabs.Tab>
            </Tabs.List>

            {/* ACTIVITY TAB */}
            <Tabs.Panel value="activity" pt="lg">
              <Timeline active={mockActivity.length} bulletSize={28} lineWidth={2}>
                {mockActivity.map((activity, index) => {
                  const config = activityIcons[activity.type] || activityIcons.sent
                  const Icon = config.icon
                  return (
                    <Timeline.Item
                      key={index}
                      bullet={
                        <ThemeIcon size={22} radius="xl" color={config.color} variant="light">
                          <Icon size={12} />
                        </ThemeIcon>
                      }
                      title={
                        <Group gap={6} justify="space-between">
                          <Text size="sm" fw={600}>{activity.title}</Text>
                          <Text size="xs" c="dimmed">{getRelativeTime(activity.date)}</Text>
                        </Group>
                      }
                    >
                      <Text size="xs" c="dimmed" mt={2}>
                        {activity.description}
                      </Text>
                      {activity.campaign && (
                        <Badge size="xs" variant="outline" color="gray" mt={6}>
                          {activity.campaign}
                        </Badge>
                      )}
                    </Timeline.Item>
                  )
                })}
              </Timeline>
            </Tabs.Panel>

            {/* CAMPAIGNS TAB */}
            <Tabs.Panel value="campaigns" pt="lg">
              <Stack gap="md">
                {mockCampaigns.map((campaign) => (
                  <Paper key={campaign.id} withBorder p="md" radius="md">
                    <Group justify="space-between" mb="sm">
                      <div>
                        <Group gap={8}>
                          <Text size="sm" fw={600}>{campaign.name}</Text>
                          <Badge size="xs" color="green" variant="light">
                            {campaign.status}
                          </Badge>
                        </Group>
                        <Text size="xs" c="dimmed" mt={2}>
                          Step {campaign.step} of {campaign.totalSteps} • Last email: "{campaign.lastEmailSubject}"
                        </Text>
                      </div>
                      <Tooltip label="Next scheduled email">
                        <Badge size="sm" variant="outline" color="blue" leftSection={<IconCalendar size={12} />}>
                          {formatScheduled(campaign.nextEmailScheduled)}
                        </Badge>
                      </Tooltip>
                    </Group>

                    <Progress.Root size={20} radius="sm">
                      <Progress.Section value={(campaign.step / campaign.totalSteps) * 100} color="indigo">
                        <Progress.Label>{campaign.step}/{campaign.totalSteps} steps</Progress.Label>
                      </Progress.Section>
                    </Progress.Root>

                    <Group gap="lg" mt="sm">
                      <Group gap={4}>
                        <IconMail size={13} color="#868E96" />
                        <Text size="xs" c="dimmed">{campaign.sent} sent</Text>
                      </Group>
                      <Group gap={4}>
                        <IconMouse size={13} color="#228BE6" />
                        <Text size="xs" c="dimmed">{campaign.opened} opened</Text>
                      </Group>
                      <Group gap={4}>
                        <IconClick size={13} color="#5C7CFA" />
                        <Text size="xs" c="dimmed">{campaign.clicked} clicked</Text>
                      </Group>
                      <Group gap={4}>
                        <IconCheck size={13} color="#40C057" />
                        <Text size="xs" c="dimmed">{campaign.replied} replied</Text>
                      </Group>
                    </Group>
                  </Paper>
                ))}
              </Stack>
            </Tabs.Panel>

            {/* DETAILS TAB */}
            <Tabs.Panel value="details" pt="lg">
              <Grid>
                <Grid.Col span={6}>
                  <Stack gap="md">
                    <div>
                      <Text size="xs" fw={600} c="dimmed" tt="uppercase" mb="xs">
                        Company
                      </Text>
                      <Paper withBorder p="md" radius="md">
                        <Stack gap="sm">
                          <Group gap={8}>
                            <IconBuilding size={14} color="#868E96" />
                            <Text size="sm">{mockLead.companyName}</Text>
                          </Group>
                          {mockLead.companyWebsite && (
                            <Group gap={8}>
                              <IconWorld size={14} color="#868E96" />
                              <Text size="sm" c="blue" style={{ cursor: 'pointer' }}>
                                {mockLead.companyWebsite}
                              </Text>
                              <IconExternalLink size={12} color="#868E96" />
                            </Group>
                          )}
                          {mockLead.industry && (
                            <Group gap={8}>
                              <IconBriefcase size={14} color="#868E96" />
                              <Text size="sm">{mockLead.industry}</Text>
                            </Group>
                          )}
                          {mockLead.companySize && (
                            <Group gap={8}>
                              <IconUsers size={14} color="#868E96" />
                              <Text size="sm">{mockLead.companySize} employees</Text>
                            </Group>
                          )}
                          {mockLead.companyLinkedinUrl && (
                            <Group gap={8} style={{ cursor: 'pointer' }}>
                              <IconBrandLinkedin size={14} color="#0A66C2" />
                              <Text size="sm" c="blue">Company LinkedIn</Text>
                            </Group>
                          )}
                        </Stack>
                      </Paper>
                    </div>

                    <div>
                      <Text size="xs" fw={600} c="dimmed" tt="uppercase" mb="xs">
                        Location & Timezone
                      </Text>
                      <Paper withBorder p="md" radius="md">
                        <Stack gap="sm">
                          <Group gap={8}>
                            <IconMapPin size={14} color="#868E96" />
                            <Text size="sm">{mockLead.city}, {mockLead.country}</Text>
                          </Group>
                          {mockLead.timezone && (
                            <Group gap={8}>
                              <IconClock size={14} color="#868E96" />
                              <Text size="sm">{mockLead.timezone}</Text>
                            </Group>
                          )}
                        </Stack>
                      </Paper>
                    </div>
                  </Stack>
                </Grid.Col>

                <Grid.Col span={6}>
                  <Stack gap="md">
                    <div>
                      <Text size="xs" fw={600} c="dimmed" tt="uppercase" mb="xs">
                        Custom Fields
                      </Text>
                      <Paper withBorder p="md" radius="md">
                        <Stack gap="xs">
                          {mockLead.customFields?.map((field) => (
                            <Group key={field.key} justify="space-between">
                              <Text size="xs" c="dimmed">{field.key}</Text>
                              <Text size="sm" fw={500}>{field.value}</Text>
                            </Group>
                          ))}
                        </Stack>
                      </Paper>
                    </div>

                    <div>
                      <Text size="xs" fw={600} c="dimmed" tt="uppercase" mb="xs">
                        Lead Info
                      </Text>
                      <Paper withBorder p="md" radius="md">
                        <Stack gap="sm">
                          <Group justify="space-between">
                            <Text size="xs" c="dimmed">Source</Text>
                            <Badge size="sm" variant="light" color="gray">
                              {mockLead.source.replace('_', ' ')}
                            </Badge>
                          </Group>
                          <Group justify="space-between">
                            <Text size="xs" c="dimmed">Added on</Text>
                            <Text size="sm">
                              {new Date(mockLead.createdAt).toLocaleDateString()}
                            </Text>
                          </Group>
                          <Group justify="space-between">
                            <Text size="xs" c="dimmed">GDPR Consent</Text>
                            <Badge size="sm" color={mockLead.gdprConsent ? 'green' : 'red'} variant="light" leftSection={mockLead.gdprConsent ? <IconCheck size={10} /> : <IconX size={10} />}>
                              {mockLead.gdprConsent ? 'Given' : 'Missing'}
                            </Badge>
                          </Group>
                          <Group justify="space-between">
                            <Text size="xs" c="dimmed">Secondary Email</Text>
                            <Text size="sm">{mockLead.secondaryEmail || '—'}</Text>
                          </Group>
                        </Stack>
                      </Paper>
                    </div>

                    <div>
                      <Text size="xs" fw={600} c="dimmed" tt="uppercase" mb="xs">
                        All Tags
                      </Text>
                      <Group gap="xs">
                        {mockLead.tags.map((tag) => (
                          <Badge key={tag} size="sm" variant="light" color="indigo">
                            {tag}
                          </Badge>
                        ))}
                      </Group>
                    </div>
                  </Stack>
                </Grid.Col>
              </Grid>
            </Tabs.Panel>

            {/* NOTES TAB */}
            <Tabs.Panel value="notes" pt="lg">
              <Paper withBorder p="md" radius="md">
                <Group justify="space-between" mb="sm">
                  <Text size="sm" fw={600}>Internal Notes</Text>
                  <ActionIcon variant="subtle" color="gray" size="sm">
                    <IconEdit size={14} />
                  </ActionIcon>
                </Group>
                <Divider mb="sm" />
                <Text size="sm" c="dark.6">
                  {mockLead.notes || 'No notes yet.'}
                </Text>
                <Text size="xs" c="dimmed" mt="md">
                  Last updated {new Date(mockLead.updatedAt).toLocaleDateString()}
                </Text>
              </Paper>
            </Tabs.Panel>
          </Tabs>
        </Card>
      </Stack>
    </div>
  )
}