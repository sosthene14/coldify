// components/AttachmentsSection.tsx
import { Stack, Group, Text, FileButton, Button, Card, ActionIcon } from '@mantine/core'
import { IconPaperclip, IconX } from '@tabler/icons-react'
import type { Attachment } from './ComposeEmailPage';

interface AttachmentsSectionProps {
  attachments: Attachment[]
  onAddAttachments: (files: File[]) => void
  onRemoveAttachment: (index: number) => void
  formatFileSize: (bytes: number) => string
}

export function AttachmentsSection({
  attachments,
  onAddAttachments,
  onRemoveAttachment,
  formatFileSize,
}: AttachmentsSectionProps) {
  return (
    <div>
      <Group justify="space-between" mb="xs">
        <Text size="sm" fw={500}>
          Attachments
        </Text>
        <FileButton onChange={onAddAttachments} accept="*/*" multiple>
          {(props) => (
            <Button
              {...props}
              size="compact-sm"
              variant="light"
              leftSection={<IconPaperclip size={14} />}
            >
              Add Files
            </Button>
          )}
        </FileButton>
      </Group>

      {attachments.length > 0 && (
        <Stack gap="xs">
          {attachments.map((attachment, index) => (
            <Card key={index} withBorder p="xs">
              <Group justify="space-between">
                <Group gap="xs">
                  <IconPaperclip size={16} />
                  <div>
                    <Text size="sm">{attachment.name}</Text>
                    <Text size="xs" c="dimmed">
                      {formatFileSize(attachment.size)}
                    </Text>
                  </div>
                </Group>
                <ActionIcon
                  variant="subtle"
                  color="red"
                  onClick={() => onRemoveAttachment(index)}
                >
                  <IconX size={16} />
                </ActionIcon>
              </Group>
            </Card>
          ))}
        </Stack>
      )}

      <Text size="xs" c="dimmed" mt="xs">
        Maximum 25MB total. Dangerous file types (.exe, .bat, etc.) are blocked.
      </Text>
    </div>
  )
}