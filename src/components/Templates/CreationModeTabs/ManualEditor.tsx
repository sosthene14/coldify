import { mergeTagGroups } from '#/types/template.ts';
import { Stack, TextInput, Group, ActionIcon, Divider, Menu, Button, Textarea, Text } from '@mantine/core'
import { IconBold, IconItalic, IconLink, IconList, IconPhoto, IconVideo, IconMoodSmile, IconPlus } from '@tabler/icons-react'
 

interface ManualEditorProps {
  subjectLine: string
  setSubjectLine: (value: string) => void
  emailBody: string
  setEmailBody: (value: string) => void
}

export function ManualEditor({ subjectLine, setSubjectLine, emailBody, setEmailBody }: ManualEditorProps) {
  return (
    <Stack gap="sm">
      <TextInput
        label="Subject line"
        placeholder="e.g. Quick question about {{companyName}}'s outreach"
        value={subjectLine}
        onChange={(e) => setSubjectLine(e.currentTarget.value)}
      />

      <Group gap={4} p={4} style={{ border: '1px solid #E9ECEF', borderRadius: 6 }}>
        <ActionIcon variant="subtle" color="gray"><IconBold size={16} /></ActionIcon>
        <ActionIcon variant="subtle" color="gray"><IconItalic size={16} /></ActionIcon>
        <ActionIcon variant="subtle" color="gray"><IconLink size={16} /></ActionIcon>
        <ActionIcon variant="subtle" color="gray"><IconList size={16} /></ActionIcon>
        <Divider orientation="vertical" />
        <ActionIcon variant="subtle" color="gray"><IconPhoto size={16} /></ActionIcon>
        <ActionIcon variant="subtle" color="gray"><IconVideo size={16} /></ActionIcon>
        <ActionIcon variant="subtle" color="gray"><IconMoodSmile size={16} /></ActionIcon>
        <Divider orientation="vertical" />
        <Menu shadow="md" width={200}>
          <Menu.Target>
            <Button variant="subtle" size="xs" leftSection={<IconPlus size={12} />}>
              Insert variable
            </Button>
          </Menu.Target>
          <Menu.Dropdown>
            {mergeTagGroups.map(group => (
              <div key={group.label}>
                <Menu.Label>{group.label}</Menu.Label>
                {group.tags.map(tag => (
                  <Menu.Item key={tag}>{`{{${tag}}}`}</Menu.Item>
                ))}
              </div>
            ))}
          </Menu.Dropdown>
        </Menu>
      </Group>

      <Textarea
        placeholder="Hi {{firstName}}, I noticed {{companyName}} is..."
        autosize
        minRows={10}
        value={emailBody}
        onChange={(e) => setEmailBody(e.currentTarget.value)}
      />

      <Group justify="space-between">
        <Text size="xs" c="dimmed">142 words • Spam score: Low</Text>
        <Text size="xs" c="dimmed">Personalization: 3 variables used</Text>
      </Group>
    </Stack>
  )
}