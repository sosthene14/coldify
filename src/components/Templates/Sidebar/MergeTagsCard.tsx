import { mergeTagGroups } from '#/types/template.ts';
import { Card, Text, ScrollArea, Stack, Group, ActionIcon, CopyButton } from '@mantine/core'
import { IconCheck, IconCopy } from '@tabler/icons-react'
 
export function MergeTagsCard() {
  return (
    <Card withBorder radius="md" p="lg" bg="white">
      <Text size="sm" fw={600} mb="sm">Merge tags</Text>
      <ScrollArea h={180}>
        <Stack gap={6}>
          {mergeTagGroups.map(group => (
            <div key={group.label}>
              <Text size="xs" fw={600} c="dimmed" tt="uppercase" mb={4}>
                {group.label}
              </Text>
              <Stack gap={4}>
                {group.tags.map(tag => (
                  <Group key={tag} justify="space-between">
                    <Text size="xs" style={{ fontFamily: 'monospace' }}>
                      {`{{${tag}}}`}
                    </Text>
                    <CopyButton value={`{{${tag}}}`}>
                      {({ copied, copy }) => (
                        <ActionIcon size="xs" variant="subtle" color={copied ? 'green' : 'gray'} onClick={copy}>
                          {copied ? <IconCheck size={12} /> : <IconCopy size={12} />}
                        </ActionIcon>
                      )}
                    </CopyButton>
                  </Group>
                ))}
              </Stack>
            </div>
          ))}
        </Stack>
      </ScrollArea>
    </Card>
  )
}