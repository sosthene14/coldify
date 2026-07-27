import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import {
  Stack,
  Text,
  Group,
  UnstyledButton,
  TextInput,
  Avatar,
  Badge,
  ActionIcon,
  Divider,
  Textarea,
  Button,
  Menu,
  Checkbox,
  Tooltip,
  ScrollArea,
  Paper,
  ThemeIcon,
  Select,
} from '@mantine/core'
import {
  IconSearch,
  IconInbox,
  IconMailOpened,
  IconClockPause,
  IconCheck,
  IconThumbUp,
  IconThumbDown,
  IconRobot,
  IconBeach,
  IconHelpCircle,
  IconPaperclip,
  IconDots,
  IconSend,
  IconTemplate,
  IconSparkles,
  IconClockHour4,
  IconUserPlus,
  IconArchive,
  IconStar,
  IconBuilding,
  IconBriefcase,
  IconMapPin,
  IconExternalLink,
  IconCalendarEvent,
  IconMail,
  IconMouse,
  IconClick as IconClickStat,
  IconFlag,
} from '@tabler/icons-react'

 
// ----------------------------------------------------------------------------
// Types & mock data
// ----------------------------------------------------------------------------

type Sentiment = 'interested' | 'not_interested' | 'question' | 'auto_reply' | 'ooo' | null

interface Conversation {
  id: string
  leadName: string
  company: string
  jobTitle: string
  lastMessagePreview: string
  campaign: string
  timestamp: string
  unread: boolean
  sentiment: Sentiment
  hasAttachment: boolean
  leadScore: number
}

const conversations: Conversation[] = [
  {
    id: '1',
    leadName: 'John Doe',
    company: 'Acme Inc',
    jobTitle: 'CEO & Co-Founder',
    lastMessagePreview: "Sounds great, can we do a call next Tuesday around 2pm?",
    campaign: 'Q3 SaaS Outreach',
    timestamp: '10:32 AM',
    unread: true,
    sentiment: 'interested',
    hasAttachment: false,
    leadScore: 85,
  },
  {
    id: '2',
    leadName: 'Jane Smith',
    company: 'TechCo',
    jobTitle: 'CTO',
    lastMessagePreview: "What's the pricing for 50+ seats? Also curious about SSO support.",
    campaign: 'Q3 SaaS Outreach',
    timestamp: '9:14 AM',
    unread: true,
    sentiment: 'question',
    hasAttachment: true,
    leadScore: 65,
  },
  {
    id: '3',
    leadName: 'Bob Johnson',
    company: 'Startup Inc',
    jobTitle: 'Founder',
    lastMessagePreview: "Thanks but we're not looking for this right now.",
    campaign: 'Agency Prospecting',
    timestamp: 'Yesterday',
    unread: false,
    sentiment: 'not_interested',
    hasAttachment: false,
    leadScore: 45,
  },
  {
    id: '4',
    leadName: 'Alice Williams',
    company: 'Agency Co',
    jobTitle: 'Marketing Director',
    lastMessagePreview: "This is very interesting, let's set up time to discuss further details.",
    campaign: 'Q3 SaaS Outreach',
    timestamp: 'Yesterday',
    unread: false,
    sentiment: 'interested',
    hasAttachment: false,
    leadScore: 92,
  },
  {
    id: '5',
    leadName: 'Mailer Daemon',
    company: '—',
    jobTitle: '—',
    lastMessagePreview: 'Delivery has failed to these recipients...',
    campaign: 'Enterprise Outreach',
    timestamp: '2 days ago',
    unread: false,
    sentiment: null,
    hasAttachment: false,
    leadScore: 0,
  },
  {
    id: '6',
    leadName: 'Marc Dupont',
    company: 'Nova Systems',
    jobTitle: 'VP Sales',
    lastMessagePreview: "I'm out of office until August 4th, will respond after.",
    campaign: 'Enterprise Outreach',
    timestamp: '3 days ago',
    unread: false,
    sentiment: 'ooo',
    hasAttachment: false,
    leadScore: 58,
  },
]

const sentimentConfig: Record<NonNullable<Sentiment>, { label: string; color: string; icon: any }> = {
  interested: { label: 'Interested', color: 'green', icon: IconThumbUp },
  not_interested: { label: 'Not Interested', color: 'red', icon: IconThumbDown },
  question: { label: 'Question', color: 'blue', icon: IconHelpCircle },
  auto_reply: { label: 'Auto-reply', color: 'gray', icon: IconRobot },
  ooo: { label: 'Out of Office', color: 'orange', icon: IconBeach },
}

const sidebarFilters = [
  { label: 'Unified Inbox', count: 6, icon: IconInbox },
  { label: 'Unread', count: 2, icon: IconMailOpened },
  { label: 'Needs Reply', count: 3, icon: IconClockPause },
  { label: 'Replied', count: 12, icon: IconCheck },
]

const sentimentFilters = [
  { label: 'Interested', count: 2, color: 'green', icon: IconThumbUp },
  { label: 'Not Interested', count: 1, color: 'red', icon: IconThumbDown },
  { label: 'Question', count: 1, color: 'blue', icon: IconHelpCircle },
  { label: 'Auto-reply / OOO', count: 1, color: 'gray', icon: IconRobot },
]

const mockThread = [
  {
    from: 'You',
    subject: 'Follow-up #2: Enterprise Plan Discussion',
    body: "Hi John,\n\nJust wanted to follow up on my previous email about scaling your outreach with Acme. Would love to show you how teams like yours are using our platform.\n\nWorth a quick 15-min call this week?",
    timestamp: 'Jan 20, 10:30 AM',
    isMe: true,
  },
  {
    from: 'John Doe',
    subject: 'Re: Follow-up #2: Enterprise Plan Discussion',
    body: "Hi, thanks for reaching out — this actually comes at a good time, we're evaluating a few tools right now.\n\nSounds great, can we do a call next Tuesday around 2pm?",
    timestamp: 'Jan 21, 2:20 PM',
    isMe: false,
  },
]

// ----------------------------------------------------------------------------
// Component
// ----------------------------------------------------------------------------

export function InboxPage() {
  const [selectedId, setSelectedId] = useState(conversations[0].id)
  const selected = conversations.find(c => c.id === selectedId)!

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#F8F9FA' }}>
      {/* ============================================================ */}
      {/* SIDEBAR — filtres */}
      {/* ============================================================ */}
      <div style={{ width: 220, borderRight: '1px solid #E9ECEF', padding: 16, flexShrink: 0 }}>
        <Stack gap={20}>
          <Button fullWidth leftSection={<IconSend size={14} />} size="sm">
            Compose
          </Button>

          <Stack gap={2}>
            {sidebarFilters.map((item) => {
              const Icon = item.icon
              const isActive = item.label === 'Unified Inbox'
              return (
                <UnstyledButton
                  key={item.label}
                  py={8}
                  px={10}
                  style={{
                    borderRadius: 6,
                    backgroundColor: isActive ? '#EDF2FF' : 'transparent',
                  }}
                >
                  <Group justify="space-between" wrap="nowrap">
                    <Group gap={8} wrap="nowrap">
                      <Icon size={15} color={isActive ? '#4C6EF5' : '#868E96'} />
                      <Text size="sm" fw={isActive ? 600 : 400} c={isActive ? 'dark.9' : 'dark.7'}>
                        {item.label}
                      </Text>
                    </Group>
                    <Text size="xs" c={isActive ? 'indigo.6' : 'dimmed'} fw={isActive ? 600 : 400}>
                      {item.count}
                    </Text>
                  </Group>
                </UnstyledButton>
              )
            })}
          </Stack>

          <Divider />

          <div>
            <Text size="xs" fw={600} c="dimmed" tt="uppercase" mb={6} px={10}>
              Sentiment
            </Text>
            <Stack gap={2}>
              {sentimentFilters.map((item) => {
                const Icon = item.icon
                return (
                  <UnstyledButton key={item.label} py={8} px={10} style={{ borderRadius: 6 }}>
                    <Group justify="space-between" wrap="nowrap">
                      <Group gap={8} wrap="nowrap">
                        <Icon size={14} color={`var(--mantine-color-${item.color}-6)`} />
                        <Text size="sm" c="dark.7">{item.label}</Text>
                      </Group>
                      <Text size="xs" c="dimmed">{item.count}</Text>
                    </Group>
                  </UnstyledButton>
                )
              })}
            </Stack>
          </div>

          <Divider />

          <div>
            <Text size="xs" fw={600} c="dimmed" tt="uppercase" mb={6} px={10}>
              Campaigns
            </Text>
            <Stack gap={2}>
              {['Q3 SaaS Outreach', 'Agency Prospecting', 'Enterprise Outreach'].map((c) => (
                <UnstyledButton key={c} py={8} px={10} style={{ borderRadius: 6 }}>
                  <Text size="sm" c="dark.7" truncate>{c}</Text>
                </UnstyledButton>
              ))}
            </Stack>
          </div>
        </Stack>
      </div>

      {/* ============================================================ */}
      {/* CONVERSATION LIST */}
      {/* ============================================================ */}
      <div style={{ width: 360, borderRight: '1px solid #E9ECEF', flexShrink: 0, display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: 12, borderBottom: '1px solid #E9ECEF' }}>
          <Group justify="space-between" mb={8}>
            <Text size="sm" fw={700}>Inbox</Text>
            <Select
              size="xs"
              w={120}
              defaultValue="recent"
              data={[
                { value: 'recent', label: 'Most recent' },
                { value: 'priority', label: 'By priority' },
                { value: 'score', label: 'By lead score' },
              ]}
            />
          </Group>
          <TextInput
            placeholder="Search conversations..."
            leftSection={<IconSearch size={14} />}
            size="xs"
          />
        </div>

        <ScrollArea style={{ flex: 1 }}>
          <Stack gap={0}>
            {conversations.map((conv) => {
              const sentiment = conv.sentiment ? sentimentConfig[conv.sentiment] : null
              const isSelected = conv.id === selectedId
              return (
                <UnstyledButton
                  key={conv.id}
                  onClick={() => setSelectedId(conv.id)}
                  p={12}
                  style={{
                    borderBottom: '1px solid #F1F3F5',
                    backgroundColor: isSelected ? '#EDF2FF' : conv.unread ? '#FAFBFF' : 'transparent',
                    borderLeft: isSelected ? '3px solid #4C6EF5' : '3px solid transparent',
                  }}
                >
                  <Group justify="space-between" wrap="nowrap" mb={4}>
                    <Group gap={8} wrap="nowrap" style={{ minWidth: 0 }}>
                      <Checkbox size="xs" onClick={(e) => e.stopPropagation()} />
                      <Avatar size={28} radius="xl" color="indigo">
                        {conv.leadName.split(' ').map(n => n[0]).join('')}
                      </Avatar>
                      <div style={{ minWidth: 0 }}>
                        <Text size="sm" fw={conv.unread ? 700 : 500} truncate>
                          {conv.leadName}
                        </Text>
                        <Text size="xs" c="dimmed" truncate>
                          {conv.company}
                        </Text>
                      </div>
                    </Group>
                    <Text size="xs" c="dimmed" style={{ flexShrink: 0 }}>
                      {conv.timestamp}
                    </Text>
                  </Group>

                  <Text size="xs" c="dimmed" lineClamp={1} mb={6} pl={36}>
                    {conv.hasAttachment && <IconPaperclip size={11} style={{ display: 'inline', marginRight: 4, verticalAlign: 'middle' }} />}
                    {conv.lastMessagePreview}
                  </Text>

                  <Group gap={6} pl={36} wrap="nowrap">
                    {sentiment && (
                      <Badge
                        size="xs"
                        variant="light"
                        color={sentiment.color}
                        leftSection={<sentiment.icon size={10} />}
                      >
                        {sentiment.label}
                      </Badge>
                    )}
                    <Badge size="xs" variant="outline" color="gray">
                      {conv.campaign}
                    </Badge>
                  </Group>
                </UnstyledButton>
              )
            })}
          </Stack>
        </ScrollArea>
      </div>

      {/* ============================================================ */}
      {/* THREAD */}
      {/* ============================================================ */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <div style={{ padding: '14px 20px', borderBottom: '1px solid #E9ECEF' }}>
          <Group justify="space-between">
            <div>
              <Text size="sm" fw={700}>{selected.leadName}</Text>
              <Text size="xs" c="dimmed">{selected.jobTitle} at {selected.company}</Text>
            </div>
            <Group gap={6}>
              <Tooltip label="Mark as Interested">
                <ActionIcon variant="light" color="green"><IconThumbUp size={16} /></ActionIcon>
              </Tooltip>
              <Tooltip label="Mark as Not Interested">
                <ActionIcon variant="light" color="red"><IconThumbDown size={16} /></ActionIcon>
              </Tooltip>
              <Tooltip label="Snooze">
                <ActionIcon variant="subtle" color="gray"><IconClockHour4 size={16} /></ActionIcon>
              </Tooltip>
              <Tooltip label="Assign">
                <ActionIcon variant="subtle" color="gray"><IconUserPlus size={16} /></ActionIcon>
              </Tooltip>
              <Tooltip label="Archive">
                <ActionIcon variant="subtle" color="gray"><IconArchive size={16} /></ActionIcon>
              </Tooltip>
              <Menu shadow="md" width={160}>
                <Menu.Target>
                  <ActionIcon variant="subtle" color="gray"><IconDots size={16} /></ActionIcon>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Item leftSection={<IconStar size={14} />}>Star lead</Menu.Item>
                  <Menu.Item leftSection={<IconFlag size={14} />}>Flag conversation</Menu.Item>
                </Menu.Dropdown>
              </Menu>
            </Group>
          </Group>

          {selected.sentiment === 'interested' && (
            <Paper mt={10} p={8} radius="md" bg="green.0" withBorder style={{ borderColor: '#B2F2BB' }}>
              <Group gap={8}>
                <ThemeIcon size="sm" color="green" variant="light"><IconCalendarEvent size={13} /></ThemeIcon>
                <Text size="xs" c="dark.7">This reply looks like a meeting request.</Text>
                <Button size="compact-xs" variant="light" color="green">Create calendar event</Button>
              </Group>
            </Paper>
          )}
        </div>

        <ScrollArea style={{ flex: 1, padding: 20 }}>
          <Stack gap="lg">
            {mockThread.map((msg, i) => (
              <div key={i}>
                <Group justify="space-between" mb={6}>
                  <Group gap={8}>
                    <Avatar size={26} radius="xl" color={msg.isMe ? 'blue' : 'indigo'}>
                      {msg.from.split(' ').map(n => n[0]).join('')}
                    </Avatar>
                    <Text size="sm" fw={600}>{msg.from}</Text>
                  </Group>
                  <Text size="xs" c="dimmed">{msg.timestamp}</Text>
                </Group>
                <Paper withBorder p="md" radius="md" ml={34} bg={msg.isMe ? 'gray.0' : 'white'}>
                  <Text size="xs" fw={600} c="dimmed" mb={6}>{msg.subject}</Text>
                  <Text size="sm" style={{ whiteSpace: 'pre-line' }}>{msg.body}</Text>
                </Paper>
              </div>
            ))}
          </Stack>
        </ScrollArea>

        {/* Reply box */}
        <div style={{ borderTop: '1px solid #E9ECEF', padding: 16 }}>
          <Paper withBorder radius="md" p="sm">
            <Textarea
              placeholder="Write a reply..."
              autosize
              minRows={3}
              variant="unstyled"
            />
            <Group justify="space-between" mt={8}>
              <Group gap={4}>
                <Tooltip label="Insert template">
                  <ActionIcon variant="subtle" color="gray"><IconTemplate size={16} /></ActionIcon>
                </Tooltip>
                <Tooltip label="Attach file">
                  <ActionIcon variant="subtle" color="gray"><IconPaperclip size={16} /></ActionIcon>
                </Tooltip>
                <Tooltip label="AI suggested reply">
                  <ActionIcon variant="subtle" color="grape"><IconSparkles size={16} /></ActionIcon>
                </Tooltip>
              </Group>
              <Button size="xs" leftSection={<IconSend size={14} />}>Send</Button>
            </Group>
          </Paper>
        </div>
      </div>

      {/* ============================================================ */}
      {/* LEAD CONTEXT PANEL */}
      {/* ============================================================ */}
      <div style={{ width: 260, borderLeft: '1px solid #E9ECEF', flexShrink: 0, padding: 16, overflowY: 'auto' }}>
        <Stack gap="md">
          <Stack align="center" gap={4}>
            <Avatar size={56} radius="xl" color="indigo">
              {selected.leadName.split(' ').map(n => n[0]).join('')}
            </Avatar>
            <Text size="sm" fw={700}>{selected.leadName}</Text>
            <Text size="xs" c="dimmed" ta="center">{selected.jobTitle}</Text>
            <Badge size="lg" radius="xl" color={selected.leadScore > 80 ? 'green' : selected.leadScore > 60 ? 'yellow' : 'gray'} mt={4}>
              Score {selected.leadScore}
            </Badge>
          </Stack>

          <Divider />

          <Stack gap={8}>
            <Group gap={8}>
              <IconBuilding size={13} color="#868E96" />
              <Text size="xs">{selected.company}</Text>
            </Group>
            <Group gap={8}>
              <IconBriefcase size={13} color="#868E96" />
              <Text size="xs">{selected.jobTitle}</Text>
            </Group>
            <Group gap={8}>
              <IconMapPin size={13} color="#868E96" />
              <Text size="xs">San Francisco, CA</Text>
            </Group>
          </Stack>

          <Divider />

          <div>
            <Text size="xs" fw={600} c="dimmed" tt="uppercase" mb={6}>
              Campaign
            </Text>
            <Badge size="sm" variant="light" color="indigo" mb={4}>{selected.campaign}</Badge>
            <Text size="xs" c="dimmed">Step 2 of 4</Text>
          </div>

          <Divider />

          <div>
            <Text size="xs" fw={600} c="dimmed" tt="uppercase" mb={6}>
              Engagement
            </Text>
            <Stack gap={6}>
              <Group justify="space-between">
                <Group gap={6}><IconMail size={12} color="#868E96" /><Text size="xs" c="dimmed">Sent</Text></Group>
                <Text size="xs" fw={500}>3</Text>
              </Group>
              <Group justify="space-between">
                <Group gap={6}><IconMouse size={12} color="#228BE6" /><Text size="xs" c="dimmed">Opened</Text></Group>
                <Text size="xs" fw={500}>3</Text>
              </Group>
              <Group justify="space-between">
                <Group gap={6}><IconClickStat size={12} color="#5C7CFA" /><Text size="xs" c="dimmed">Clicked</Text></Group>
                <Text size="xs" fw={500}>2</Text>
              </Group>
            </Stack>
          </div>

          <Divider />

          <div>
            <Text size="xs" fw={600} c="dimmed" tt="uppercase" mb={6}>
              Tags
            </Text>
            <Group gap={4}>
              <Badge size="xs" variant="outline" color="indigo">hot-lead</Badge>
              <Badge size="xs" variant="outline" color="indigo">enterprise</Badge>
            </Group>
          </div>

          <Button variant="light" size="xs" fullWidth rightSection={<IconExternalLink size={12} />}>
            View full profile
          </Button>
        </Stack>
      </div>
    </div>
  )
}