import { previewLeads, type PreviewDevice } from '#/types/template.ts';
import { Card, Group, Text, SegmentedControl, Paper, Select } from '@mantine/core'
import { IconDeviceDesktop, IconDeviceMobile } from '@tabler/icons-react'
 
interface PreviewCardProps {
  previewDevice: PreviewDevice
  setPreviewDevice: (device: PreviewDevice) => void
}

export function PreviewCard({ previewDevice, setPreviewDevice }: PreviewCardProps) {
  return (
    <Card withBorder radius="md" p="lg" bg="white">
      <Group justify="space-between" mb="sm">
        <Text size="sm" fw={600}>Preview</Text>
        <SegmentedControl
          size="xs"
          value={previewDevice}
          onChange={(v) => setPreviewDevice(v as PreviewDevice)}
          data={[
            { label: <IconDeviceDesktop size={14} />, value: 'desktop' },
            { label: <IconDeviceMobile size={14} />, value: 'mobile' },
          ]}
        />
      </Group>
      <Paper withBorder p="md" radius="md" bg="gray.0" mih={220}>
        <Text size="xs" c="dimmed" ta="center" mt={90}>
          Live preview with sample lead data
        </Text>
      </Paper>
      <Select
        mt="sm"
        size="xs"
        label="Preview with lead"
        placeholder="Select a real lead"
        data={previewLeads}
      />
    </Card>
  )
}