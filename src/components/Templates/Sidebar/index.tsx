import { Stack, Card, TextInput, Text } from '@mantine/core'
import { PreviewCard } from './PreviewCard'
import { MergeTagsCard } from './MergeTagsCard'
import { SendingSettingsCard } from './SendingSettingsCard'
import { QualityCheckCard } from './QualityCheckCard'
import type { PreviewDevice } from '#/types/template.ts';
 
interface SidebarProps {
  previewDevice: PreviewDevice
  setPreviewDevice: (device: PreviewDevice) => void
}

export function Sidebar({ previewDevice, setPreviewDevice }: SidebarProps) {
  return (
    <Stack gap="md">
      <PreviewCard previewDevice={previewDevice} setPreviewDevice={setPreviewDevice} />
      <MergeTagsCard />
      <SendingSettingsCard />
      <QualityCheckCard />
      <Card withBorder radius="md" p="lg" bg="white">
        <Text size="sm" fw={600} mb="sm">Tags</Text>
        <TextInput placeholder="Add a tag and press enter" size="xs" />
      </Card>
    </Stack>
  )
}