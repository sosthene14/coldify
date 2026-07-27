import { useState, useMemo } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import {
  Stack,
  Text,
  Button,
  Group,
  Card,
  Badge,
  ActionIcon,
  SegmentedControl,
  Checkbox,
  Avatar,
  Divider,
  Paper,
  ThemeIcon,
  ScrollArea,
  Select,
  UnstyledButton,
} from '@mantine/core'
import {
  IconChevronLeft,
  IconChevronRight,
  IconPlus,
  IconCalendarEvent,
  IconChecklist,
  IconRocket,
  IconFlame,
  IconBan,
  IconVideo,
  IconMapPin,
  IconExternalLink,
  IconDots,
  IconClock,
  IconBriefcase,
} from '@tabler/icons-react'



// ----------------------------------------------------------------------------
// Types & config
// ----------------------------------------------------------------------------

type EventType = 'meeting' | 'task' | 'campaign_start' | 'campaign_end' | 'warmup' | 'pause'

interface CalendarEvent {
  id: string
  date: string // YYYY-MM-DD
  type: EventType
  title: string
  time?: string
  meta?: string
  assignee?: string
}

const eventTypeConfig: Record<EventType, { label: string; color: string; icon: any }> = {
  meeting: { label: 'Meetings', color: 'green', icon: IconVideo },
  task: { label: 'Tasks', color: 'blue', icon: IconChecklist },
  campaign_start: { label: 'Campaign launches', color: 'indigo', icon: IconRocket },
  campaign_end: { label: 'Campaign ends', color: 'grape', icon: IconRocket },
  warmup: { label: 'Warm-up milestones', color: 'orange', icon: IconFlame },
  pause: { label: 'Sending pause', color: 'gray', icon: IconBan },
}

// Mock events — using the current month for relevance
const today = new Date()
const y = today.getFullYear()
const m = today.getMonth()
const d = (day: number) => `${y}-${String(m + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`

const mockEvents: CalendarEvent[] = [
  { id: '1', date: d(3), type: 'campaign_start', title: 'Q3 SaaS Outreach launches', meta: '1,450 leads' },
  { id: '2', date: d(5), type: 'meeting', title: 'Call with John Doe', time: '2:00 PM', meta: 'Acme Inc', assignee: 'John Doe' },
  { id: '3', date: d(5), type: 'task', title: 'Follow up with Bob Johnson', assignee: 'Sarah Lee' },
  { id: '4', date: d(8), type: 'warmup', title: 'marc@acme.com reaches 100% warm-up' },
  { id: '5', date: d(12), type: 'meeting', title: 'Demo with Alice Williams', time: '11:00 AM', meta: 'Agency Co', assignee: 'John Doe' },
  { id: '6', date: d(14), type: 'pause', title: 'No sending — weekend' },
  { id: '7', date: d(15), type: 'pause', title: 'No sending — weekend' },
  { id: '8', date: d(18), type: 'meeting', title: 'Discovery call with TechCo', time: '3:30 PM', meta: 'Jane Smith', assignee: 'Marc Diop' },
  { id: '9', date: d(18), type: 'task', title: 'Prepare proposal for Enterprise Outreach', assignee: 'Sarah Lee' },
  { id: '10', date: d(21), type: 'campaign_end', title: 'Re-engagement Q1 ends' },
  { id: '11', date: d(22), type: 'meeting', title: 'Check-in with Nova Systems', time: '9:00 AM', meta: 'Marc Dupont' },
  { id: '12', date: d(28), type: 'task', title: 'Review Agency Prospecting performance', assignee: 'John Doe' },
]

const teamMembers = ['All members', 'John Doe', 'Sarah Lee', 'Marc Diop']

// ----------------------------------------------------------------------------
// Date helpers
// ----------------------------------------------------------------------------

function getMonthGrid(year: number, month: number) {
  const firstDay = new Date(year, month, 1)
  const startOffset = (firstDay.getDay() + 6) % 7 // lundi = 0
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const daysInPrevMonth = new Date(year, month, 0).getDate()

  const cells: { day: number; currentMonth: boolean; dateStr: string }[] = []

  for (let i = startOffset - 1; i >= 0; i--) {
    cells.push({ day: daysInPrevMonth - i, currentMonth: false, dateStr: '' })
  }
  for (let day = 1; day <= daysInMonth; day++) {
    cells.push({ day, currentMonth: true, dateStr: `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}` })
  }
  while (cells.length % 7 !== 0) {
    const day = cells.length - (startOffset + daysInMonth) + 1
    cells.push({ day, currentMonth: false, dateStr: '' })
  }
  return cells
}

const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export function CalendarPage() {
  const [viewDate, setViewDate] = useState(new Date(y, m, 1))
  const [view, setView] = useState('month')
  const [selectedDate, setSelectedDate] = useState<string>(d(today.getDate()))
  const [activeTypes, setActiveTypes] = useState<EventType[]>(Object.keys(eventTypeConfig) as EventType[])
  const [teamFilter, setTeamFilter] = useState('All members')

  const toggleType = (type: EventType) => {
    setActiveTypes(prev => prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type])
  }

  const visibleEvents = useMemo(
    () => mockEvents.filter(e =>
      activeTypes.includes(e.type) &&
      (teamFilter === 'All members' || e.assignee === teamFilter || !e.assignee)
    ),
    [activeTypes, teamFilter]
  )

  const eventsByDate = useMemo(() => {
    const map: Record<string, CalendarEvent[]> = {}
    visibleEvents.forEach(e => {
      if (!map[e.date]) map[e.date] = []
      map[e.date].push(e)
    })
    return map
  }, [visibleEvents])

  const grid = useMemo(() => getMonthGrid(viewDate.getFullYear(), viewDate.getMonth()), [viewDate])
  const monthLabel = viewDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  const selectedEvents = eventsByDate[selectedDate] || []

  const goToMonth = (offset: number) => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + offset, 1))
  }

  return (
    <div className="p-4 bg-slate-50/10 min-h-screen">
      <Stack gap="md">
        <Group justify="space-between">
          <Text size="xl" fw={700}>Calendar</Text>
          <Group gap="sm">
            <Select
              size="sm"
              w={160}
              value={teamFilter}
              onChange={(v) => setTeamFilter(v || 'All members')}
              data={teamMembers}
            />
            <Button leftSection={<IconPlus size={16} />}>New Event</Button>
          </Group>
        </Group>

        <Group align="flex-start" gap="md" wrap="nowrap">
          {/* ============================================================ */}
          {/* SIDEBAR */}
          {/* ============================================================ */}
          <Card withBorder radius="md" p="md" bg="white" style={{ width: 240, flexShrink: 0 }}>
            <Stack gap="lg">
              <div>
                <Text size="sm" fw={600} mb="xs">{monthLabel}</Text>
                <Text size="xs" c="dimmed">
                  {visibleEvents.length} events this month
                </Text>
              </div>

              <Divider />

              <div>
                <Text size="xs" fw={600} c="dimmed" tt="uppercase" mb={8}>
                  Event types
                </Text>
                <Stack gap={8}>
                  {(Object.keys(eventTypeConfig) as EventType[]).map((type) => {
                    const config = eventTypeConfig[type]
                    const Icon = config.icon
                    return (
                      <Checkbox
                        key={type}
                        size="xs"
                        checked={activeTypes.includes(type)}
                        onChange={() => toggleType(type)}
                        label={
                          <Group gap={6}>
                            <Icon size={13} color={`var(--mantine-color-${config.color}-6)`} />
                            <Text size="xs">{config.label}</Text>
                          </Group>
                        }
                      />
                    )
                  })}
                </Stack>
              </div>

              <Divider />

              <div>
                <Text size="xs" fw={600} c="dimmed" tt="uppercase" mb={8}>
                  Upcoming meetings
                </Text>
                <Stack gap={8}>
                  {mockEvents
                    .filter(e => e.type === 'meeting')
                    .slice(0, 3)
                    .map((ev) => (
                      <Paper key={ev.id} withBorder p={8} radius="sm">
                        <Text size="xs" fw={600} lineClamp={1}>{ev.title}</Text>
                        <Text size="xs" c="dimmed">{ev.time} • {new Date(ev.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</Text>
                      </Paper>
                    ))}
                </Stack>
              </div>
            </Stack>
          </Card>

          {/* ============================================================ */}
          {/* MAIN CALENDAR */}
          {/* ============================================================ */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <Stack gap="md">
              <Card withBorder radius="md" p="lg" bg="white">
                <Group justify="space-between" mb="md">
                  <Group gap={8}>
                    <ActionIcon variant="default" onClick={() => goToMonth(-1)}>
                      <IconChevronLeft size={16} />
                    </ActionIcon>
                    <Text size="md" fw={600} w={160} ta="center">{monthLabel}</Text>
                    <ActionIcon variant="default" onClick={() => goToMonth(1)}>
                      <IconChevronRight size={16} />
                    </ActionIcon>
                    <Button size="xs" variant="default" onClick={() => setViewDate(new Date(y, m, 1))}>
                      Today
                    </Button>
                  </Group>
                  <SegmentedControl
                    size="xs"
                    value={view}
                    onChange={setView}
                    data={[
                      { label: 'Month', value: 'month' },
                      { label: 'Week', value: 'week' },
                      { label: 'Day', value: 'day' },
                    ]}
                  />
                </Group>

                {/* Week day headers */}
                <Group grow gap={0} mb={4}>
                  {weekDays.map((wd) => (
                    <Text key={wd} size="xs" fw={600} c="dimmed" ta="center" tt="uppercase">
                      {wd}
                    </Text>
                  ))}
                </Group>

                {/* Month grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
                  {grid.map((cell, i) => {
                    const dayEvents = cell.dateStr ? (eventsByDate[cell.dateStr] || []) : []
                    const isSelected = cell.dateStr === selectedDate
                    const isToday = cell.dateStr === d(today.getDate())
                    return (
                      <UnstyledButton
                        key={i}
                        onClick={() => cell.currentMonth && setSelectedDate(cell.dateStr)}
                        disabled={!cell.currentMonth}
                        style={{
                          minHeight: 90,
                          border: '1px solid #F1F3F5',
                          borderRadius: 6,
                          padding: 6,
                          backgroundColor: isSelected ? '#EDF2FF' : 'white',
                          opacity: cell.currentMonth ? 1 : 0.35,
                          cursor: cell.currentMonth ? 'pointer' : 'default',
                        }}
                      >
                        <Group justify="space-between" mb={4}>
                          <Text size="xs" fw={isToday ? 700 : 500} c={isToday ? 'indigo.6' : 'dark.7'}>
                            {cell.day}
                          </Text>
                          {isToday && <Badge size="xs" variant="filled" color="indigo" radius="xl">Today</Badge>}
                        </Group>
                        <Stack gap={2}>
                          {dayEvents.slice(0, 2).map((ev) => {
                            const config = eventTypeConfig[ev.type]
                            return (
                              <Badge
                                key={ev.id}
                                size="xs"
                                variant="light"
                                color={config.color}
                                styles={{ root: { textTransform: 'none', fontWeight: 500 } }}
                                fullWidth
                              >
                                <Text size="9px" truncate>{ev.title}</Text>
                              </Badge>
                            )
                          })}
                          {dayEvents.length > 2 && (
                            <Text size="9px" c="dimmed" pl={4}>+{dayEvents.length - 2} more</Text>
                          )}
                        </Stack>
                      </UnstyledButton>
                    )
                  })}
                </div>
              </Card>

              {/* ============================================================ */}
              {/* SELECTED DAY DETAIL */}
              {/* ============================================================ */}
              <Card withBorder radius="md" p="lg" bg="white">
                <Group justify="space-between" mb="md">
                  <Text size="sm" fw={700}>
                    {new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                  </Text>
                  <Button size="xs" variant="light" leftSection={<IconPlus size={14} />}>
                    Add event
                  </Button>
                </Group>

                {selectedEvents.length === 0 ? (
                  <Text size="sm" c="dimmed">No events on this day.</Text>
                ) : (
                  <ScrollArea.Autosize mah={280}>
                    <Stack gap="sm">
                      {selectedEvents.map((ev) => {
                        const config = eventTypeConfig[ev.type]
                        const Icon = config.icon
                        return (
                          <Paper key={ev.id} withBorder p="sm" radius="md">
                            <Group justify="space-between" wrap="nowrap">
                              <Group gap={10} wrap="nowrap">
                                <ThemeIcon variant="light" color={config.color} size="md" radius="xl">
                                  <Icon size={14} />
                                </ThemeIcon>
                                <div>
                                  <Text size="sm" fw={600}>{ev.title}</Text>
                                  <Group gap={8}>
                                    {ev.time && (
                                      <Group gap={3}>
                                        <IconClock size={11} color="#868E96" />
                                        <Text size="xs" c="dimmed">{ev.time}</Text>
                                      </Group>
                                    )}
                                    {ev.meta && (
                                      <Group gap={3}>
                                        <IconBriefcase size={11} color="#868E96" />
                                        <Text size="xs" c="dimmed">{ev.meta}</Text>
                                      </Group>
                                    )}
                                    {ev.assignee && (
                                      <Group gap={3}>
                                        <Avatar size={14} radius="xl">{ev.assignee[0]}</Avatar>
                                        <Text size="xs" c="dimmed">{ev.assignee}</Text>
                                      </Group>
                                    )}
                                  </Group>
                                </div>
                              </Group>
                              <Group gap={4}>
                                <Badge size="xs" variant="light" color={config.color}>
                                  {config.label}
                                </Badge>
                                {ev.type === 'meeting' && (
                                  <ActionIcon variant="subtle" color="blue" size="sm">
                                    <IconExternalLink size={14} />
                                  </ActionIcon>
                                )}
                                <ActionIcon variant="subtle" color="gray" size="sm">
                                  <IconDots size={14} />
                                </ActionIcon>
                              </Group>
                            </Group>
                          </Paper>
                        )
                      })}
                    </Stack>
                  </ScrollArea.Autosize>
                )}
              </Card>
            </Stack>
          </div>
        </Group>
      </Stack>
    </div>
  )
}