import { type PreviewDevice } from '#/types/template.ts'
import { Card, Group, Text, SegmentedControl, Paper, Skeleton } from '@mantine/core'
import { IconDeviceDesktop, IconDeviceMobile } from '@tabler/icons-react'
import { useEffect, useState } from 'react'
import { replaceMinIOWithSignedUrls } from '#/lib/image-upload.ts'

interface PreviewCardProps {
  previewDevice: PreviewDevice
  setPreviewDevice: (device: PreviewDevice) => void
  subjectLine: string
  htmlContent: string
  isLoading?: boolean
}

export function PreviewCard({ previewDevice, setPreviewDevice, subjectLine, htmlContent, isLoading }: PreviewCardProps) {
  const [processedContent, setProcessedContent] = useState(htmlContent)
  const [isProcessing, setIsProcessing] = useState(false)

  // Transformer les références MinIO en URLs signées pour la preview
  useEffect(() => {
    const processContent = async () => {
      if (htmlContent.includes('minio://')) {
        setIsProcessing(true)
        try {
          const transformed = await replaceMinIOWithSignedUrls(htmlContent)
          setProcessedContent(transformed)
        } catch (error) {
          console.error('Failed to process MinIO URLs:', error)
          setProcessedContent(htmlContent)
        } finally {
          setIsProcessing(false)
        }
      } else {
        setProcessedContent(htmlContent)
      }
    }

    processContent()
  }, [htmlContent])

  const srcDoc = `
    <html>
      <head>
        <meta charset="utf-8" />
        <style>
          body { font-family: -apple-system, Arial, sans-serif; font-size: 14px; color: #212529; margin: 0; padding: 16px; }
          img { max-width: 100%; height: auto; }
        </style>
      </head>
      <body>${processedContent || '<p style="color:#adb5bd">Nothing to preview yet</p>'}</body>
    </html>
  `

  return (
    <Card
    
    withBorder radius="md" p="lg" bg="white" className="h-auto">
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

      <Paper withBorder radius="md" bg="gray.0" p={0} style={{ overflow: 'hidden' }}>
        <div style={{ padding: '10px 12px', borderBottom: '1px solid #E9ECEF', backgroundColor: '#fff' }}>
          <Text size="xs" c="dimmed">Subject</Text>
          <Text size="sm" fw={500} truncate>
            {subjectLine || <span style={{ color: '#adb5bd' }}>No subject</span>}
          </Text>
        </div>

        <div
          style={{
            position: 'relative',
            display: 'flex',
            justifyContent: 'center',
            backgroundColor: '#f1f3f5',
            padding: previewDevice === 'mobile' ? '16px 0' : 0,
          }}
        >
          <iframe
            title="Email preview"
            sandbox="allow-same-origin"
            srcDoc={srcDoc}
            style={{
              width: previewDevice === 'mobile' ? 375 : '100%',
              height: 420,
              border: 'none',
              backgroundColor: '#fff',
              boxShadow: previewDevice === 'mobile' ? '0 0 0 1px #dee2e6' : 'none',
            }}
          />

          {(isLoading || isProcessing) && (
            <div style={{ position: 'absolute', inset: 0 }}>
              <Skeleton height="100%" radius={0} />
            </div>
          )}
        </div>
      </Paper>
    </Card>
  )
}