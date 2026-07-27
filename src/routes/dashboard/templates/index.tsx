import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Stack, Text, Button, Group, Card, Grid, Badge, ActionIcon, Menu, TextInput, Select, Tabs, Progress, Divider } from '@mantine/core'
import { IconPlus, IconSearch, IconDots, IconEdit, IconCopy, IconTrash, IconStar, IconStarFilled, IconMail, IconClock, IconTrendingUp, IconMessageCircle2 } from '@tabler/icons-react'
import { TemplatesSkeleton } from '#/components/Templates/TemplatesSkeleton'

export const Route = createFileRoute('/dashboard/templates/')({
  component: TemplatesPage,
  pendingComponent: TemplatesSkeleton,
})

interface Template {
  id: string
  name: string
  subject: string
  category: string
  language: string
  preview: string
  usageCount: number
  openRate: number
  replyRate: number
  starred: boolean
  createdAt: string
  lastUsed?: string
}

// Mock data
const mockTemplates: Template[] = [
  {
    id: '1',
    name: 'Cold Outreach - SaaS',
    subject: 'Quick question about {{companyName}}',
    category: 'Cold Outreach',
    language: 'English',
    preview: 'Hi {{firstName}}, I noticed that {{companyName}} is...',
    usageCount: 145,
    openRate: 52,
    replyRate: 8.5,
    starred: true,
    createdAt: '2024-01-10T10:00:00Z',
    lastUsed: '2024-01-22T14:30:00Z',
  },
  {
    id: '2',
    name: 'Follow-up #1',
    subject: 'Re: {{previousSubject}}',
    category: 'Follow-up',
    language: 'English',
    preview: 'Hi {{firstName}}, Just wanted to follow up on my previous email...',
    usageCount: 230,
    openRate: 45,
    replyRate: 12.3,
    starred: true,
    createdAt: '2024-01-08T09:00:00Z',
    lastUsed: '2024-01-23T11:20:00Z',
  },
  {
    id: '3',
    name: 'Introduction - Partnership',
    subject: 'Partnership opportunity for {{companyName}}',
    category: 'Partnership',
    language: 'English',
    preview: 'Hi {{firstName}}, I hope this email finds you well. I wanted to reach out...',
    usageCount: 67,
    openRate: 38,
    replyRate: 6.2,
    starred: false,
    createdAt: '2024-01-15T14:00:00Z',
    lastUsed: '2024-01-20T16:45:00Z',
  },
  {
    id: '4',
    name: 'Meeting Request',
    subject: 'Can we schedule a quick 15-min call?',
    category: 'Meeting Request',
    language: 'English',
    preview: "Hi {{firstName}}, I'd love to schedule a brief call to discuss...",
    usageCount: 89,
    openRate: 48,
    replyRate: 15.7,
    starred: false,
    createdAt: '2024-01-12T11:00:00Z',
    lastUsed: '2024-01-21T09:30:00Z',
  },
  {
    id: '5',
    name: 'Re-engagement',
    subject: 'Still interested in improving {{pain_point}}?',
    category: 'Re-engagement',
    language: 'English',
    preview: "Hi {{firstName}}, It's been a while since we last connected...",
    usageCount: 34,
    openRate: 28,
    replyRate: 4.1,
    starred: false,
    createdAt: '2024-01-18T13:00:00Z',
    lastUsed: '2024-01-19T15:20:00Z',
  },
  {
    id: '6',
    name: 'Thank You - Post Demo',
    subject: 'Thanks for your time today',
    category: 'Thank You',
    language: 'English',
    preview: 'Hi {{firstName}}, Thank you for taking the time to speak with me today...',
    usageCount: 56,
    openRate: 72,
    replyRate: 18.9,
    starred: true,
    createdAt: '2024-01-05T10:00:00Z',
    lastUsed: '2024-01-23T10:15:00Z',
  },
]

const categories = ['All Categories', 'Cold Outreach', 'Follow-up', 'Partnership', 'Meeting Request', 'Re-engagement', 'Thank You']

// Une couleur par catégorie pour qu'on repère les templates d'un coup d'oeil
const categoryColors: Record<string, string> = {
  'Cold Outreach': 'indigo',
  'Follow-up': 'cyan',
  'Partnership': 'grape',
  'Meeting Request': 'teal',
  'Re-engagement': 'orange',
  'Thank You': 'pink',
}

function formatRelativeTime(dateStr?: string): string {
  if (!dateStr) return 'Never used'
  const diffDays = Math.floor((Date.now() - new Date(dateStr).getTime()) / (1000 * 60 * 60 * 24))
  if (diffDays === 0) return 'Used today'
  if (diffDays === 1) return 'Used yesterday'
  return `Used ${diffDays}d ago`
}

function TemplatesPage() {
  const navigate = useNavigate()
  const starredCount = mockTemplates.filter(t => t.starred).length
  const avgReplyRate = (
    mockTemplates.reduce((sum, t) => sum + t.replyRate, 0) / mockTemplates.length
  ).toFixed(1)

  return (
    <div className="p-4 bg-slate-50/10 min-h-screen">
      <Stack gap="lg">
        {/* Header */}
        <Group justify="space-between" align="flex-start">
          <div>
            <Text size="xl" fw={700}>
              Email Templates
            </Text>
            <Group gap={6} mt={4}>
              <Text size="sm" c="dimmed">
                {mockTemplates.length} templates
              </Text>
              <Text size="sm" c="dimmed">•</Text>
              <Text size="sm" c="dimmed">
                {starredCount} starred
              </Text>
              <Text size="sm" c="dimmed">•</Text>
              <Text size="sm" c="dimmed">
                {avgReplyRate}% avg reply rate
              </Text>
            </Group>
          </div>
          <Button
            leftSection={<IconPlus size={16} />}
            color="blue"
            onClick={() => navigate({ to: '/dashboard/templates/new' })}
          >
            New Template
          </Button>
        </Group>

        {/* Tabs + filtres regroupés dans une seule barre */}
        <Card withBorder radius="md" p="md" bg="white">
          <Stack gap="sm">
            <Tabs defaultValue="all" variant="pills">
              <Tabs.List>
                <Tabs.Tab value="all">
                  All Templates
                  <Badge size="sm" ml={6} variant="light" color="gray">{mockTemplates.length}</Badge>
                </Tabs.Tab>
                <Tabs.Tab value="starred">
                  Starred
                  <Badge size="sm" ml={6} variant="light" color="yellow">{starredCount}</Badge>
                </Tabs.Tab>
                <Tabs.Tab value="recent">
                  Recently Used
                </Tabs.Tab>
              </Tabs.List>
            </Tabs>

            <Divider />

            <Group gap="sm">
              <TextInput
                placeholder="Search templates..."
                leftSection={<IconSearch size={16} />}
                w={300}
              />
              <Select
                placeholder="Category"
                data={categories}
                w={180}
                defaultValue="All Categories"
              />
              <Select
                placeholder="Sort by"
                data={['Most Used', 'Highest Open Rate', 'Highest Reply Rate', 'Recently Created', 'Recently Used']}
                w={200}
                defaultValue="Most Used"
              />
            </Group>
          </Stack>
        </Card>

        {/* Grille de templates */}
        <Grid>
          {mockTemplates.map((template) => {
            const color = categoryColors[template.category] || 'gray'
            return (
              <Grid.Col key={template.id} span={4}>
                <Card
                  withBorder
                  radius="md"
                  p={0}
                  bg="white"
                  style={{
                    cursor: 'pointer',
                    height: '100%',
                    overflow: 'hidden',
                    transition: 'box-shadow 150ms ease, border-color 150ms ease',
                  }}
                  className="hover:shadow-md"
                  onClick={() => navigate({ to: `/dashboard/templates/${template.id}/edit` })}
                >
                  {/* Bandeau couleur de catégorie */}
                  <div style={{ height: 4, backgroundColor: `var(--mantine-color-${color}-5)` }} />

                  <Stack gap="sm" p="lg" h="100%">
                    <Group justify="space-between" wrap="nowrap" align="flex-start">
                      <Badge size="sm" variant="light" color={color} radius="sm">
                        {template.category}
                      </Badge>

                      <Group gap={2} wrap="nowrap">
                        <ActionIcon
                          variant="subtle"
                          color={template.starred ? 'yellow' : 'gray'}
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                          }}
                        >
                          {template.starred ? <IconStarFilled size={16} /> : <IconStar size={16} />}
                        </ActionIcon>

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
                            <Menu.Item
                              leftSection={<IconEdit size={14} />}
                              onClick={() => navigate({ to: `/dashboard/templates/${template.id}/edit` })}
                            >
                              Edit
                            </Menu.Item>
                            <Menu.Item leftSection={<IconCopy size={14} />}>
                              Duplicate
                            </Menu.Item>
                            <Menu.Divider />
                            <Menu.Item color="red" leftSection={<IconTrash size={14} />}>
                              Delete
                            </Menu.Item>
                          </Menu.Dropdown>
                        </Menu>
                      </Group>
                    </Group>

                    <div>
                      <Text size="md" fw={600} mb={6} lineClamp={1}>
                        {template.name}
                      </Text>
                      <Group gap={4} mb={6} wrap="nowrap">
                        <IconMail size={13} color="#868E96" style={{ flexShrink: 0 }} />
                        <Text size="xs" c="dimmed" lineClamp={1}>
                          {template.subject}
                        </Text>
                      </Group>
                      <Text size="sm" c="dimmed" lineClamp={2} style={{ lineHeight: 1.5 }}>
                        {template.preview}
                      </Text>
                    </div>

                    <div style={{ marginTop: 'auto' }}>
                      <Group justify="space-between" mb={8}>
                        <Group gap={4}>
                          <IconClock size={12} color="#ADB5BD" />
                          <Text size="xs" c="dimmed">{formatRelativeTime(template.lastUsed)}</Text>
                        </Group>
                        <Text size="xs" fw={500} c="dimmed">{template.usageCount} uses</Text>
                      </Group>

                      <Divider mb={10} />

                      <Group grow gap="lg">
                        <div>
                          <Group gap={4} mb={4}>
                            <IconTrendingUp size={12} color="#228BE6" />
                            <Text size="xs" c="dimmed">Open rate</Text>
                          </Group>
                          <Group gap={6} align="baseline">
                            <Text size="sm" fw={700} c="blue.7">{template.openRate}%</Text>
                          </Group>
                          <Progress value={template.openRate} size={4} radius="xl" color="blue" mt={4} />
                        </div>
                        <div>
                          <Group gap={4} mb={4}>
                            <IconMessageCircle2 size={12} color="#40C057" />
                            <Text size="xs" c="dimmed">Reply rate</Text>
                          </Group>
                          <Group gap={6} align="baseline">
                            <Text size="sm" fw={700} c="green.7">{template.replyRate}%</Text>
                          </Group>
                          <Progress value={template.replyRate} size={4} radius="xl" color="green" mt={4} />
                        </div>
                      </Group>
                    </div>
                  </Stack>
                </Card>
              </Grid.Col>
            )
          })}
        </Grid>
      </Stack>
    </div>
  )
}