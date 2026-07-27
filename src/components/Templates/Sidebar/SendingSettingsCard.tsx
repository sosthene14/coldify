import { Card, Text, Stack, Select, Switch } from '@mantine/core'

export function SendingSettingsCard() {
  return (
    <Card withBorder radius="md" p="lg" bg="white">
      <Text size="sm" fw={600} mb="sm">Sending settings</Text>
      <Stack gap="sm">
        <Select
          label="Send from"
          placeholder="Select mailbox"
          data={['john@acme.com', 'sales@acme.com']}
        />
        <Switch label="Send at optimal time (lead's timezone)" defaultChecked size="sm" />
        <Switch label="Track opens" defaultChecked size="sm" />
        <Switch label="Track link clicks" defaultChecked size="sm" />
      </Stack>
    </Card>
  )
}