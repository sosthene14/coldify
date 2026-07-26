import { Card, Text, Table, Anchor, Badge, ActionIcon, Group } from '@mantine/core';
import { IconDots } from '@tabler/icons-react';

type Status = 'Running' | 'Paused' | 'Draft' | 'Completed';

type Campaign = {
  name: string;
  status: Status;
  leads: number;
  sent: number;
  openRate: string;
  replyRate: string;
  replies: number;
  lastActivity: string;
};

const statusColor: Record<Status, string> = {
  Running: 'green',
  Paused: 'yellow',
  Draft: 'gray',
  Completed: 'blue',
};

const campaigns: Campaign[] = [
  { name: 'Q3 SaaS Outreach', status: 'Running', leads: 2450, sent: 1240, openRate: '52%', replyRate: '9.2%', replies: 114, lastActivity: '2h ago' },
  { name: 'Agency Prospecting', status: 'Running', leads: 860, sent: 410, openRate: '44%', replyRate: '7.3%', replies: 30, lastActivity: '5h ago' },
  { name: 'Enterprise Outreach', status: 'Running', leads: 1320, sent: 980, openRate: '48%', replyRate: '6.1%', replies: 60, lastActivity: '1d ago' },
  { name: 'Product Launch', status: 'Paused', leads: 620, sent: 0, openRate: '0%', replyRate: '0%', replies: 0, lastActivity: '2d ago' },
  { name: 'Re-engagement Q2', status: 'Running', leads: 1150, sent: 320, openRate: '36%', replyRate: '5.0%', replies: 16, lastActivity: '2d ago' },
  { name: 'Outbound Q2', status: 'Draft', leads: 530, sent: 0, openRate: '0%', replyRate: '0%', replies: 0, lastActivity: '—' },
  { name: 'North America Leads', status: 'Completed', leads: 750, sent: 750, openRate: '41%', replyRate: '4.8%', replies: 36, lastActivity: '5d ago' },
];

const headers = ['Campaign', 'Status', 'Leads', 'Sent', 'Open rate', 'Reply rate', 'Replies', 'Last activity', ''];

export function RecentCampaigns() {
  return (
    <Card withBorder radius="md" p="lg" bg="white">
      <Text fw={600} size="sm" c="dark.7" mb="md">
        Recent campaigns
      </Text>

      <Table
        className='hover:cursor-pointer'
        verticalSpacing="sm"
        horizontalSpacing="md"
        highlightOnHover
        highlightOnHoverColor="gray.0"
      >
        <Table.Thead>
          <Table.Tr>
            {headers.map((h) => (
              <Table.Th key={h}>
                {h && (
                  <Text size="xs" fw={600} c="dimmed" tt="uppercase">
                    {h}
                  </Text>
                )}
              </Table.Th>
            ))}
          </Table.Tr>
        </Table.Thead>

        <Table.Tbody>
          {campaigns.map((c) => (
            <Table.Tr key={c.name}>
              <Table.Td>
                <Anchor size="sm" fw={500} c="indigo.6" underline="never">
                  {c.name}
                </Anchor>
              </Table.Td>
              <Table.Td>
                <Badge color={statusColor[c.status]} variant="light" size="sm" radius="sm" tt="none" fw={500}>
                  {c.status}
                </Badge>
              </Table.Td>
              <Table.Td>
                <Text size="sm" c="dark.7">
                  {c.leads.toLocaleString()}
                </Text>
              </Table.Td>
              <Table.Td>
                <Text size="sm" c="dark.7">
                  {c.sent.toLocaleString()}
                </Text>
              </Table.Td>
              <Table.Td>
                <Text size="sm" c="dark.7">
                  {c.openRate}
                </Text>
              </Table.Td>
              <Table.Td>
                <Text size="sm" c="dark.7">
                  {c.replyRate}
                </Text>
              </Table.Td>
              <Table.Td>
                <Text size="sm" c="dark.7">
                  {c.replies}
                </Text>
              </Table.Td>
              <Table.Td>
                <Text size="sm" c="dimmed">
                  {c.lastActivity}
                </Text>
              </Table.Td>
              <Table.Td>
                <Group justify="flex-end">
                  <ActionIcon variant="subtle" color="gray" size="sm">
                    <IconDots size={16} />
                  </ActionIcon>
                </Group>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </Card>
  );
}