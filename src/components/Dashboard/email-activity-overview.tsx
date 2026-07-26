import { Card, Group, Text, Select, Box } from '@mantine/core';
import { LineChart } from '@mantine/charts';

const data = [
  { date: 'May 7', sent: 4200, replies: 700 },
  { date: 'May 8', sent: 6100, replies: 900 },
  { date: 'May 9', sent: 7600, replies: 1000 },
  { date: 'May 10', sent: 6300, replies: 1000 },
  { date: 'May 11', sent: 6500, replies: 1300 },
  { date: 'May 12', sent: 5300, replies: 1200 },
  { date: 'May 13', sent: 3900, replies: 900 },
];

const series = [
  { name: 'sent', label: 'Emails sent', color: 'indigo.6' },
  { name: 'replies', label: 'Replies', color: 'gray.5' },
];

export function EmailActivityOverview() {
  return (
    <Card withBorder radius="md" p="lg" bg="white"  className="w-full">
      <Group justify="space-between" align="center" mb="md">
        <Text fw={600} size="sm" c="dark.7">
          Email activity overview
        </Text>

        <Select
          size="xs"
          data={['Last 7 days', 'Last 14 days', 'Last 30 days']}
          defaultValue="Last 7 days"
          w={140}
          radius="sm"
        />
      </Group>

      <Group gap="lg" mb="sm">
        {series.map((s) => (
          <Group key={s.name} gap={6}>
            <Box
              w={8}
              h={8}
              style={{ borderRadius: 2, backgroundColor: `var(--mantine-color-${s.color.replace('.', '-')})` }}
            />
            <Text size="xs" c="dimmed">
              {s.label}
            </Text>
          </Group>
        ))}
      </Group>

      <LineChart
        h={220}
        data={data}
        dataKey="date"
        series={series}
        curveType="monotone"
        withDots
        dotProps={{ r: 3, strokeWidth: 0 }}
        activeDotProps={{ r: 4 }}
        strokeWidth={2}
        gridAxis="y"
        withYAxis
        withXAxis
        yAxisProps={{ tickFormatter: (v: number) => (v >= 1000 ? `${v / 1000}K` : `${v}`) }}
        tickLine="none"
        withLegend={false}
        withTooltip
      />
    </Card>
  );
}