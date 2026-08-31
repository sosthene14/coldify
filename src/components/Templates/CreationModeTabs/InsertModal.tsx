import { Modal, SegmentedControl, TextInput, FileButton, Button, Stack, Group, Text, Image as MantineImage } from '@mantine/core'
import { IconUpload } from '@tabler/icons-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface ImageInsertModalProps {
  opened: boolean
  onClose: () => void
  onInsert: (src: string) => void
}

export function ImageInsertModal({ opened, onClose, onInsert }: ImageInsertModalProps) {
  const { t } = useTranslation()
  const [mode, setMode] = useState<'url' | 'upload'>('url')
  const [url, setUrl] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)

  const handleFile = (f: File | null) => {
    setFile(f)
    if (!f) return setPreview(null)
    const reader = new FileReader()
    reader.onload = () => setPreview(reader.result as string)
    reader.readAsDataURL(f)
  }

  const handleInsert = () => {
    const src = mode === 'url' ? url : preview
    if (!src) return
    onInsert(src)
    reset()
  }

  const reset = () => {
    setUrl('')
    setFile(null)
    setPreview(null)
    setMode('url')
    onClose()
  }

  return (
    <Modal opened={opened} onClose={reset} title={t('insert_image')} centered>
      <Stack gap="md">
        <SegmentedControl
          fullWidth
          value={mode}
          onChange={(v) => setMode(v as 'url' | 'upload')}
          data={[
            { label: t('from_url'), value: 'url' },
            { label: t('upload_from_computer'), value: 'upload' },
          ]}
        />

        {mode === 'url' ? (
          <TextInput
            placeholder="https://example.com/image.png"
            value={url}
            onChange={(e) => setUrl(e.currentTarget.value)}
          />
        ) : (
          <Stack gap={6}>
            <FileButton onChange={handleFile} accept="image/png,image/jpeg,image/gif,image/webp">
              {(props) => (
                <Button {...props} variant="default" leftSection={<IconUpload size={14} />}>
                  {t('choose_file')}
                </Button>
              )}
            </FileButton>
            {file && <Text size="xs" c="dimmed">{file.name}</Text>}
          </Stack>
        )}

        {preview && mode === 'upload' && (
          <MantineImage src={preview} radius="sm" mah={160} fit="contain" />
        )}

        <Group justify="flex-end">
          <Button variant="subtle" color="gray" onClick={reset}>{t('cancel')}</Button>
          <Button color="blue" onClick={handleInsert} disabled={mode === 'url' ? !url : !preview}>
            {t('insert')}
          </Button>
        </Group>
      </Stack>
    </Modal>
  )
}