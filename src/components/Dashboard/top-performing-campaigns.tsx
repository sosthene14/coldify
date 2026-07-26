import { Card, Group, Text, Table, Anchor } from '@mantine/core';

type Campaign = {
  name: string;
  replyRate: string;
  replies: number | null;
  sent: number;
};

const campaigns: Campaign[] = [
  { name: 'Q3 SaaS Outreach', replyRate: '9.2%', replies: 114, sent: 1240 },
  { name: 'Agency Prospecting', replyRate: '7.3%', replies: 30, sent: 410 },
  { name: 'Enterprise Outreach', replyRate: '6.1%', replies: 60, sent: 980 },
  { name: 'Re-engagement Q2', replyRate: '5.0%', replies: 16, sent: 320 },
  { name: 'Product Launch', replyRate: '4.2%', replies: null, sent: 0 },
];

export function TopPerformingCampaigns() {
  return (
    <Card withBorder radius="md" bg="white" className="w-full">
      <Group justify="space-between" align="center" mb="md">
        <Text fw={600} size="sm" c="dark.7">
          Top performing campaigns
        </Text>

        <Anchor size="xs" fw={500} c="indigo.6" underline="never">
          View all
        </Anchor>
      </Group>

      <Table  
      className='hover:cursor-pointer'
      verticalSpacing="sm"
  horizontalSpacing="md"
  highlightOnHover
  highlightOnHoverColor="gray.0">
        <Table.Thead>
          <Table.Tr>
            <Table.Th>
              <Text size="xs" fw={600} c="dimmed" tt="uppercase">
                Campaign
              </Text>
            </Table.Th>
            <Table.Th>
              <Text size="xs" fw={600} c="dimmed" tt="uppercase" ta="right">
                Reply rate
              </Text>
            </Table.Th>
            <Table.Th>
              <Text size="xs" fw={600} c="dimmed" tt="uppercase" ta="right">
                Replies
              </Text>
            </Table.Th>
            <Table.Th>
              <Text size="xs" fw={600} c="dimmed" tt="uppercase" ta="right">
                Sent
              </Text>
            </Table.Th>
          </Table.Tr>
        </Table.Thead>

        <Table.Tbody>
  {campaigns.map((c) => (
    <Table.Tr
      key={c.name}
      className="
        transition-colors
        duration-150
        hover:bg-gray-400
      "
    >
      <Table.Td>
        <Text size="sm" c="dark.7">
          {c.name}
        </Text>
      </Table.Td>

      <Table.Td>
        <Text size="sm" c="dark.7" ta="right">
          {c.replyRate}
        </Text>
      </Table.Td>

      <Table.Td>
        <Text size="sm" c="dark.7" ta="right">
          {c.replies ?? "—"}
        </Text>
      </Table.Td>

      <Table.Td>
        <Text size="sm" c="dark.7" ta="right">
          {c.sent}
        </Text>
      </Table.Td>
    </Table.Tr>
  ))}
</Table.Tbody>
      </Table>
    </Card>
  );
}