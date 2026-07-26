import { Card, Text, Table, Anchor, Badge, Group, Stack } from '@mantine/core';

type Reply = {
  name: string;
  email: string;
  campaign: string;
  subject: string;
  preview: string;
  receivedAt: string;
  status: 'Replied';
};

const replies: Reply[] = [
  {
    name: 'Sarah Williams',
    email: 'sarah@saasflow.com',
    campaign: 'Agency Prospecting',
    subject: 'Re: Introduction from RoxShield',
    preview: "Thanks for reaching out! We're actually looking for a solution...",
    receivedAt: '10:21 AM',
    status: 'Replied',
  },
  {
    name: 'Robert Davis',
    email: 'robert@accelerate.io',
    campaign: 'Q3 SaaS Outreach',
    subject: 'Re: Quick question',
    preview: "Yes, we'd be interested in learning more. Can you share...",
    receivedAt: '9:58 AM',
    status: 'Replied',
  },
  {
    name: 'Kevin White',
    email: 'kevin@leadpeak.com',
    campaign: 'Q3 SaaS Outreach',
    subject: "Re: Let's connect",
    preview: 'Not the right time for us right now, but thanks for...',
    receivedAt: '9:15 AM',
    status: 'Replied',
  },
];

export function RepliesReceived() {
  return (
    <Card withBorder radius="md" p="lg" bg="white">
      <Group justify="space-between" align="center" mb="md">
        <Text fw={600} size="sm" c="dark.7">
          Replies received
        </Text>

        <Anchor size="xs" fw={500} c="indigo.6" underline="never">
          View all replies
        </Anchor>
      </Group>

      <Table 
      className='hover:cursor-pointer'
      verticalSpacing="sm"
  horizontalSpacing="md"
  highlightOnHover
  highlightOnHoverColor="gray.0"
      >
        <Table.Thead>
          <Table.Tr>
            <Table.Th>
              <Text size="xs" fw={600} c="dimmed" tt="uppercase">
                From
              </Text>
            </Table.Th>
            <Table.Th>
              <Text size="xs" fw={600} c="dimmed" tt="uppercase">
                Campaign
              </Text>
            </Table.Th>
            <Table.Th>
              <Text size="xs" fw={600} c="dimmed" tt="uppercase">
                Subject / Preview
              </Text>
            </Table.Th>
            <Table.Th>
              <Text size="xs" fw={600} c="dimmed" tt="uppercase">
                Received
              </Text>
            </Table.Th>
            <Table.Th>
              <Text size="xs" fw={600} c="dimmed" tt="uppercase">
                Status
              </Text>
            </Table.Th>
          </Table.Tr>
        </Table.Thead>

        <Table.Tbody>
          {replies.map((r) => (
            <Table.Tr key={r.email}>
              <Table.Td>
                <Stack gap={2}>
                  <Text size="sm" fw={500} c="dark.7">
                    {r.name}
                  </Text>
                  <Text size="xs" c="dimmed">
                    {r.email}
                  </Text>
                </Stack>
              </Table.Td>
              <Table.Td>
                <Text size="sm" c="dark.7">
                  {r.campaign}
                </Text>
              </Table.Td>
              <Table.Td maw={320}>
                <Stack gap={2}>
                  <Text size="sm" fw={500} c="dark.7">
                    {r.subject}
                  </Text>
                  <Text size="xs" c="dimmed" truncate="end">
                    {r.preview}
                  </Text>
                </Stack>
              </Table.Td>
              <Table.Td>
                <Text size="sm" c="dimmed">
                  {r.receivedAt}
                </Text>
              </Table.Td>
              <Table.Td>
                <Badge color="green" variant="light" size="sm" radius="sm" tt="none" fw={500}>
                  {r.status}
                </Badge>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </Card>
  );
}