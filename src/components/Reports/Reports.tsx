import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import {
  Stack,
  Text,
  Button,
  Group,
  Card,
  Grid,
  Badge,
  Select,
  Tabs,
  Table,
  Progress,
  Divider,
  ThemeIcon,
  Checkbox,
  Paper,
  ActionIcon,
  Menu,
  SegmentedControl,
  RingProgress,
} from '@mantine/core'
import { AreaChart, BarChart, DonutChart } from '@mantine/charts'
import {
  IconMail,
  IconMailOpened,
  IconClick,
  IconMessageCircle2,
  IconCalendarEvent,
  IconTrendingUp,
  IconTrendingDown,
  IconDownload,
  IconFileTypePdf,
  IconFileTypeCsv,
  IconDots,
  IconUsers,
  IconChartBar,
  IconTarget,
  IconRefresh,
} from '@tabler/icons-react'


// ----------------------------------------------------------------------------
// Mock data
// ----------------------------------------------------------------------------

const kpis = [
  { label: 'Emails Sent', value: '4,832', delta: '+12%', up: true, icon: IconMail, color: 'blue' },
  { label: 'Open Rate', value: '48.3%', delta: '+3.2%', up: true, icon: IconMailOpened, color: 'cyan' },
  { label: 'Reply Rate', value: '9.7%', delta: '-0.8%', up: false, icon: IconMessageCircle2, color: 'green' },
  { label: 'Meetings Booked', value: '38', delta: '+18%', up: true, icon: IconCalendarEvent, color: 'grape' },
  { label: 'Click Rate', value: '14.1%', delta: '+1.4%', up: true, icon: IconClick, color: 'indigo' },
]

const trendData = [
  { date: 'Jan 1', sent: 210, opened: 98, replied: 18 },
  { date: 'Jan 8', sent: 340, opened: 165, replied: 29 },
  { date: 'Jan 15', sent: 410, opened: 205, replied: 41 },
  { date: 'Jan 22', sent: 380, opened: 190, replied: 35 },
  { date: 'Jan 29', sent: 520, opened: 260, replied: 52 },
  { date: 'Feb 5', sent: 610, opened: 310, replied: 61 },
]

const campaignReports = [
  { name: 'Q3 SaaS Outreach', sent: 1450, openRate: 52, replyRate: 12.3, meetings: 14, status: 'Running' },
  { name: 'Agency Prospecting', sent: 890, openRate: 38, replyRate: 6.2, meetings: 5, status: 'Running' },
  { name: 'Enterprise Outreach', sent: 620, openRate: 61, replyRate: 15.7, meetings: 9, status: 'Running' },
  { name: 'Re-engagement Q1', sent: 340, openRate: 28, replyRate: 4.1, meetings: 2, status: 'Paused' },
  { name: 'Partnership Intro', sent: 210, openRate: 45, replyRate: 9.8, meetings: 3, status: 'Completed' },
]

const funnelStages = [
  { label: 'Leads Contacted', value: 4832, color: 'blue' },
  { label: 'Opened', value: 2334, color: 'cyan' },
  { label: 'Clicked', value: 682, color: 'indigo' },
  { label: 'Replied', value: 469, color: 'teal' },
  { label: 'Interested', value: 187, color: 'green' },
  { label: 'Meeting Booked', value: 38, color: 'grape' },
]

const sourceBreakdown = [
  { name: 'Apollo', value: 1820, color: 'indigo.6' },
  { name: 'LinkedIn Scraper', value: 1340, color: 'blue.6' },
  { name: 'CSV Import', value: 980, color: 'cyan.6' },
  { name: 'Manual', value: 420, color: 'gray.5' },
  { name: 'API', value: 272, color: 'grape.6' },
]

const teamReports = [
  { name: 'John Doe', sent: 1240, replyRate: 11.2, meetings: 12, dealsClosed: 4 },
  { name: 'Sarah Lee', sent: 980, replyRate: 14.8, meetings: 15, dealsClosed: 6 },
  { name: 'Marc Diop', sent: 1560, replyRate: 7.9, meetings: 8, dealsClosed: 2 },
  { name: 'Fatou Sy', sent: 1052, replyRate: 9.4, meetings: 9, dealsClosed: 3 },
]

const availableMetrics = [
  'Emails Sent', 'Open Rate', 'Click Rate', 'Reply Rate', 'Bounce Rate',
  'Unsubscribe Rate', 'Meetings Booked', 'Deals Closed', 'Lead Score Avg',
]

function statusColor(status: string) {
  if (status === 'Running') return 'green'
  if (status === 'Paused') return 'orange'
  return 'gray'
}

export function ReportsPage() {
  const [dateRange, setDateRange] = useState('30d')
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>(['Open Rate', 'Reply Rate', 'Meetings Booked'])
  const [groupBy, setGroupBy] = useState('campaign')
  const [chartType, setChartType] = useState('bar')

  const toggleMetric = (metric: string) => {
    setSelectedMetrics(prev =>
      prev.includes(metric) ? prev.filter(m => m !== metric) : [...prev, metric]
    )
  }

  return (
    <div className="p-4 bg-slate-50/10 min-h-screen">
      <Stack gap="lg">
        {/* Header */}
        <Group justify="space-between" align="flex-start">
          <div>
            <Text size="xl" fw={700}>Reports</Text>
            <Text size="sm" c="dimmed">Performance across campaigns, leads and team</Text>
          </div>
          <Group gap="sm">
            <Select
              value={dateRange}
              onChange={(v) => setDateRange(v || '30d')}
              data={[
                { value: '7d', label: 'Last 7 days' },
                { value: '30d', label: 'Last 30 days' },
                { value: '90d', label: 'Last 90 days' },
                { value: 'custom', label: 'Custom range' },
              ]}
              w={160}
            />
            <Button variant="default" leftSection={<IconRefresh size={16} />}>
              Refresh
            </Button>
            <Menu shadow="md" width={180}>
              <Menu.Target>
                <Button leftSection={<IconDownload size={16} />}>Export</Button>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Item leftSection={<IconFileTypePdf size={14} />}>Export as PDF</Menu.Item>
                <Menu.Item leftSection={<IconFileTypeCsv size={14} />}>Export as CSV</Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </Group>
        </Group>

        {/* KPI cards */}
        <Grid>
          {kpis.map((kpi) => {
            const Icon = kpi.icon
            const TrendIcon = kpi.up ? IconTrendingUp : IconTrendingDown
            return (
              <Grid.Col key={kpi.label} span={2.4}>
                <Card withBorder radius="md" p="md" bg="white">
                  <Group gap="xs" mb="xs">
                    <ThemeIcon size="sm" color={kpi.color} variant="light">
                      <Icon size={14} />
                    </ThemeIcon>
                    <Text size="xs" tt="uppercase" fw={600} c="dimmed">
                      {kpi.label}
                    </Text>
                  </Group>
                  <Group justify="space-between" align="flex-end">
                    <Text size="xl" fw={700}>{kpi.value}</Text>
                    <Group gap={2}>
                      <TrendIcon size={13} color={kpi.up ? '#40C057' : '#FA5252'} />
                      <Text size="xs" fw={600} c={kpi.up ? 'green' : 'red'}>
                        {kpi.delta}
                      </Text>
                    </Group>
                  </Group>
                </Card>
              </Grid.Col>
            )
          })}
        </Grid>

        {/* Tabs */}
        <Card withBorder radius="md" p="lg" bg="white">
          <Tabs defaultValue="overview">
            <Tabs.List>
              <Tabs.Tab value="overview" leftSection={<IconChartBar size={14} />}>
                Overview
              </Tabs.Tab>
              <Tabs.Tab value="campaigns" leftSection={<IconMail size={14} />}>
                Campaigns
              </Tabs.Tab>
              <Tabs.Tab value="leads" leftSection={<IconTarget size={14} />}>
                Leads Funnel
              </Tabs.Tab>
              <Tabs.Tab value="team" leftSection={<IconUsers size={14} />}>
                Team
              </Tabs.Tab>
              <Tabs.Tab value="builder" leftSection={<IconChartBar size={14} />}>
                Custom Report
              </Tabs.Tab>
            </Tabs.List>

            {/* ---------------- OVERVIEW ---------------- */}
            <Tabs.Panel value="overview" pt="lg">
              <Stack gap="lg">
                <div>
                  <Text size="sm" fw={600} mb="sm">Engagement over time</Text>
                  <AreaChart
                    h={280}
                    data={trendData}
                    dataKey="date"
                    series={[
                      { name: 'sent', color: 'gray.5' },
                      { name: 'opened', color: 'blue.6' },
                      { name: 'replied', color: 'green.6' },
                    ]}
                    curveType="monotone"
                    withLegend
                    withGradient
                  />
                </div>

                <Divider />

                <div>
                  <Text size="sm" fw={600} mb="sm">Top campaigns by reply rate</Text>
                  <BarChart
                    h={240}
                    data={campaignReports}
                    dataKey="name"
                    series={[{ name: 'replyRate', color: 'indigo.6' }]}
                    tickLine="y"
                  />
                </div>
              </Stack>
            </Tabs.Panel>

            {/* ---------------- CAMPAIGNS ---------------- */}
            <Tabs.Panel value="campaigns" pt="lg">
              <Table verticalSpacing="sm" horizontalSpacing="md" highlightOnHover>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Campaign</Table.Th>
                    <Table.Th>Status</Table.Th>
                    <Table.Th>Sent</Table.Th>
                    <Table.Th>Open Rate</Table.Th>
                    <Table.Th>Reply Rate</Table.Th>
                    <Table.Th>Meetings</Table.Th>
                    <Table.Th></Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {campaignReports.map((c) => (
                    <Table.Tr key={c.name}>
                      <Table.Td>
                        <Text size="sm" fw={500}>{c.name}</Text>
                      </Table.Td>
                      <Table.Td>
                        <Badge size="sm" color={statusColor(c.status)} variant="light">
                          {c.status}
                        </Badge>
                      </Table.Td>
                      <Table.Td>
                        <Text size="sm">{c.sent.toLocaleString()}</Text>
                      </Table.Td>
                      <Table.Td>
                        <Group gap={6}>
                          <Text size="sm" fw={600}>{c.openRate}%</Text>
                          <Progress value={c.openRate} size={4} w={50} color="blue" radius="xl" />
                        </Group>
                      </Table.Td>
                      <Table.Td>
                        <Group gap={6}>
                          <Text size="sm" fw={600}>{c.replyRate}%</Text>
                          <Progress value={c.replyRate * 4} size={4} w={50} color="green" radius="xl" />
                        </Group>
                      </Table.Td>
                      <Table.Td>
                        <Text size="sm">{c.meetings}</Text>
                      </Table.Td>
                      <Table.Td>
                        <ActionIcon variant="subtle" color="gray" size="sm">
                          <IconDots size={16} />
                        </ActionIcon>
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            </Tabs.Panel>

            {/* ---------------- LEADS FUNNEL ---------------- */}
            <Tabs.Panel value="leads" pt="lg">
              <Grid>
                <Grid.Col span={7}>
                  <Text size="sm" fw={600} mb="md">Conversion funnel</Text>
                  <Stack gap="sm">
                    {funnelStages.map((stage, i) => {
                      const prevValue = i === 0 ? stage.value : funnelStages[i - 1].value
                      const percentOfPrev = i === 0 ? 100 : Math.round((stage.value / prevValue) * 100)
                      const percentOfTotal = Math.round((stage.value / funnelStages[0].value) * 100)
                      return (
                        <Paper key={stage.label} withBorder p="sm" radius="md">
                          <Group justify="space-between" mb={6}>
                            <Text size="sm" fw={500}>{stage.label}</Text>
                            <Group gap={8}>
                              <Text size="sm" fw={700}>{stage.value.toLocaleString()}</Text>
                              {i > 0 && (
                                <Badge size="xs" variant="light" color="gray">
                                  {percentOfPrev}% of previous
                                </Badge>
                              )}
                            </Group>
                          </Group>
                          <Progress value={percentOfTotal} color={stage.color} size="md" radius="xl" />
                        </Paper>
                      )
                    })}
                  </Stack>
                </Grid.Col>

                <Grid.Col span={5}>
                  <Text size="sm" fw={600} mb="md">Leads by source</Text>
                  <Group justify="center">
                    <DonutChart
                      data={sourceBreakdown}
                      size={200}
                      thickness={26}
                      withLabelsLine
                      withLabels
                    />
                  </Group>
                  <Stack gap={6} mt="md">
                    {sourceBreakdown.map((s) => (
                      <Group key={s.name} justify="space-between">
                        <Group gap={6}>
                          <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: `var(--mantine-color-${s.color.replace('.', '-')})` }} />
                          <Text size="xs" c="dimmed">{s.name}</Text>
                        </Group>
                        <Text size="xs" fw={500}>{s.value.toLocaleString()}</Text>
                      </Group>
                    ))}
                  </Stack>
                </Grid.Col>
              </Grid>
            </Tabs.Panel>

            {/* ---------------- TEAM ---------------- */}
            <Tabs.Panel value="team" pt="lg">
              <Table verticalSpacing="sm" horizontalSpacing="md" highlightOnHover>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Rep</Table.Th>
                    <Table.Th>Emails Sent</Table.Th>
                    <Table.Th>Reply Rate</Table.Th>
                    <Table.Th>Meetings Booked</Table.Th>
                    <Table.Th>Deals Closed</Table.Th>
                    <Table.Th>Performance</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {teamReports.map((rep) => (
                    <Table.Tr key={rep.name}>
                      <Table.Td>
                        <Text size="sm" fw={500}>{rep.name}</Text>
                      </Table.Td>
                      <Table.Td>
                        <Text size="sm">{rep.sent.toLocaleString()}</Text>
                      </Table.Td>
                      <Table.Td>
                        <Text size="sm" fw={600}>{rep.replyRate}%</Text>
                      </Table.Td>
                      <Table.Td>
                        <Text size="sm">{rep.meetings}</Text>
                      </Table.Td>
                      <Table.Td>
                        <Badge size="sm" color="green" variant="light">{rep.dealsClosed}</Badge>
                      </Table.Td>
                      <Table.Td>
                        <RingProgress
                          size={40}
                          thickness={4}
                          sections={[{ value: rep.replyRate * 5, color: rep.replyRate > 10 ? 'green' : 'yellow' }]}
                        />
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            </Tabs.Panel>

            {/* ---------------- CUSTOM REPORT BUILDER ---------------- */}
            <Tabs.Panel value="builder" pt="lg">
              <Grid>
                <Grid.Col span={4}>
                  <Stack gap="md">
                    <div>
                      <Text size="sm" fw={600} mb="xs">Metrics to include</Text>
                      <Stack gap={6}>
                        {availableMetrics.map((metric) => (
                          <Checkbox
                            key={metric}
                            label={metric}
                            checked={selectedMetrics.includes(metric)}
                            onChange={() => toggleMetric(metric)}
                          />
                        ))}
                      </Stack>
                    </div>

                    <Divider />

                    <Select
                      label="Group by"
                      value={groupBy}
                      onChange={(v) => setGroupBy(v || 'campaign')}
                      data={[
                        { value: 'campaign', label: 'Campaign' },
                        { value: 'rep', label: 'Team member' },
                        { value: 'source', label: 'Lead source' },
                        { value: 'week', label: 'Week' },
                      ]}
                    />

                    <div>
                      <Text size="sm" fw={500} mb={6}>Chart type</Text>
                      <SegmentedControl
                        fullWidth
                        value={chartType}
                        onChange={setChartType}
                        data={[
                          { label: 'Bar', value: 'bar' },
                          { label: 'Line', value: 'line' },
                          { label: 'Table', value: 'table' },
                        ]}
                      />
                    </div>

                    <Button leftSection={<IconChartBar size={16} />}>
                      Generate report
                    </Button>
                    <Button variant="default" leftSection={<IconDownload size={16} />}>
                      Save as template
                    </Button>
                  </Stack>
                </Grid.Col>

                <Grid.Col span={8}>
                  <Paper withBorder p="lg" radius="md" mih={400} bg="gray.0">
                    <Stack align="center" justify="center" h="100%" gap="xs">
                      <ThemeIcon size={48} variant="light" color="gray" radius="xl">
                        <IconChartBar size={24} />
                      </ThemeIcon>
                      <Text size="sm" c="dimmed" ta="center">
                        Select your metrics and click "Generate report"<br />
                        to see the {chartType} view grouped by {groupBy}
                      </Text>
                    </Stack>
                  </Paper>
                </Grid.Col>
              </Grid>
            </Tabs.Panel>
          </Tabs>
        </Card>
      </Stack>
    </div>
  )
}