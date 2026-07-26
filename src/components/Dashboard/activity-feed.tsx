import { Card, Text, Group, Stack, Anchor, ThemeIcon, Timeline } from '@mantine/core';
import {
  IconPlayerPlay,
  IconUsers,
  IconMail,
  IconArrowBackUp,
  IconPlayerPause,
} from '@tabler/icons-react';

// ---------- Activity feed ----------

type Activity = {
  icon: React.ReactNode;
  color: string;
  text: string;
  time: string;
};

const activities: Activity[] = [
  { icon: <IconPlayerPlay size={14} />, color: 'indigo', text: 'Q3 SaaS Outreach started', time: '2 hours ago' },
  { icon: <IconUsers size={14} />, color: 'green', text: '120 leads imported to Agency Prospecting', time: '5 hours ago' },
  { icon: <IconMail size={14} />, color: 'violet', text: 'SMTP connected for team@roxshield.com', time: '1 day ago' },
  { icon: <IconArrowBackUp size={14} />, color: 'blue', text: 'New reply from Sarah Williams', time: '1 day ago' },
  { icon: <IconPlayerPause size={14} />, color: 'orange', text: 'Campaign Product Launch paused', time: '2 days ago' },
];

function ActivityFeed() {
  return (
    <Card withBorder radius="md" p="lg" bg="white">
      <Group justify="space-between" align="center" mb="md">
        <Text fw={600} size="sm" c="dark.7">
          Activity feed
        </Text>
        <Anchor size="xs" fw={500} c="indigo.6" underline="never">
          View all
        </Anchor>
      </Group>

      <Stack gap="md">
        {activities.map((a, i) => (
          <Group
            key={i}
            gap="sm"
            align="flex-start"
            wrap="nowrap"
            className="
              rounded-md
              px-2 py-1.5
              -mx-2
              transition-colors
              duration-150
              hover:bg-gray-50
              hover:cursor-pointer
            "
          >
            <ThemeIcon color={a.color} variant="light" radius="xl" size="md">
              {a.icon}
            </ThemeIcon>
            <Stack gap={2}>
              <Text size="sm" c="dark.7">
                {a.text}
              </Text>
              <Text size="xs" c="dimmed">
                {a.time}
              </Text>
            </Stack>
          </Group>
        ))}
      </Stack>
    </Card>
  );
}

// ---------- Performance summary ----------

type Metric = {
  label: string;
  value: string;
  delta: string;
  positive: boolean;
};

const metrics: Metric[] = [
  { label: 'Emails sent', value: '4,820', delta: '+12.5%', positive: true },
  { label: 'Open rate', value: '47.8%', delta: '+3.2%', positive: true },
  { label: 'Reply rate', value: '8.4%', delta: '+1.1%', positive: true },
  { label: 'Bounce rate', value: '1.2%', delta: '-0.3%', positive: false },
  { label: 'Opportunities', value: '24', delta: '+9', positive: true },
];

function PerformanceSummary() {
  return (
    <Card withBorder radius="md" p="lg" bg="white">
      <Group justify="space-between" align="center" mb="md">
        <Text fw={600} size="sm" c="dark.7">
          Performance summary
        </Text>
        <Anchor size="xs" fw={500} c="indigo.6" underline="never">
          View report
        </Anchor>
      </Group>

      <Stack gap="sm">
        {metrics.map((m) => (
          <Group
            key={m.label}
            justify="space-between"
            align="center"
            className="
              rounded-md
              px-2 py-1
              -mx-2
              transition-colors
              duration-150
              hover:bg-gray-50
              hover:cursor-pointer
            "
          >
            <Text size="sm" c="dimmed">
              {m.label}
            </Text>
            <Group gap={8}>
              <Text size="sm" fw={600} c="dark.7">
                {m.value}
              </Text>
              <Text size="xs" fw={500} c={m.positive ? 'green.6' : 'red.6'}>
                {m.delta}
              </Text>
            </Group>
          </Group>
        ))}
      </Stack>
    </Card>
  );
}

// ---------- Upcoming schedule ----------

type ScheduleItem = {
  campaign: string;
  step: string;
  time: string;
};

const schedule: ScheduleItem[] = [
  { campaign: 'Q3 SaaS Outreach', step: 'Follow-up email', time: 'in 2 hours' },
  { campaign: 'Agency Prospecting', step: 'Step 3 - Follow-up', time: 'in 5 hours' },
  { campaign: 'Enterprise Outreach', step: 'Step 2 - Follow-up', time: 'in 1 day' },
];

function UpcomingSchedule() {
  return (
    <Card withBorder radius="md" p="lg" bg="white">
      <Group justify="space-between" align="center" mb="md">
        <Text fw={600} size="sm" c="dark.7">
          Upcoming schedule
        </Text>
        <Anchor size="xs" fw={500} c="indigo.6" underline="never">
          View calendar
        </Anchor>
      </Group>

      <Timeline active={-1} bulletSize={10} lineWidth={2} color="indigo.6">
        {schedule.map((s) => (
          <Timeline.Item key={s.campaign}>
            <Group
              justify="space-between"
              align="flex-start"
              wrap="nowrap"
              className="
                rounded-md
                px-2 py-1
                -mx-2
                transition-colors
                duration-150
                hover:bg-gray-50
                hover:cursor-pointer
              "
            >
              <Stack gap={2}>
                <Text size="sm" fw={500} c="dark.7">
                  {s.campaign}
                </Text>
                <Text size="xs" c="dimmed">
                  {s.step}
                </Text>
              </Stack>
              <Text size="xs" c="dimmed" style={{ whiteSpace: 'nowrap' }}>
                {s.time}
              </Text>
            </Group>
          </Timeline.Item>
        ))}
      </Timeline>

      <Anchor size="sm" fw={500} c="indigo.6" underline="never" mt="sm">
        Full schedule →
      </Anchor>
    </Card>
  );
}

// ---------- Sidebar ----------

export function ActivitySidebar() {
  return (
    <Stack gap="xs">
      <ActivityFeed />
      <PerformanceSummary />
      <UpcomingSchedule />
    </Stack>
  );
}