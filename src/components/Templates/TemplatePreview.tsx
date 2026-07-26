import { Card, Stack, Text, Paper, Divider, Group, Badge } from '@mantine/core'
import { IconMail, IconUser, IconBuilding } from '@tabler/icons-react'

interface TemplatePreviewProps {
  data: {
    subject: string
    body: string
  }
}

export function TemplatePreview({ data }: TemplatePreviewProps) {
  // Replace variables with sample data for preview
  const sampleData = {
    '{{firstName}}': 'John',
    '{{lastName}}': 'Doe',
    '{{fullName}}': 'John Doe',
    '{{email}}': 'john.doe@example.com',
    '{{companyName}}': 'Acme Inc',
    '{{jobTitle}}': 'CEO',
    '{{industry}}': 'SaaS',
    '{{city}}': 'San Francisco',
    '{{country}}': 'United States',
  }

  const renderPreview = (text: string) => {
    let preview = text
    Object.entries(sampleData).forEach(([variable, value]) => {
      preview = preview.replace(new RegExp(variable.replace(/[{}]/g, '\\$&'), 'g'), value)
    })
    return preview
  }

  return (
    <Card withBorder radius="md" p="xl" bg="white" mt="md">
      <Stack gap="lg">
        <div>
          <Text fw={600} size="lg" mb="xs">
            Preview
          </Text>
          <Text size="sm" c="dimmed">
            See how your email will look with sample data
          </Text>
        </div>

        <Paper withBorder radius="md" p={0} style={{ overflow: 'hidden' }}>
          {/* Email Header */}
          <div style={{ padding: '12px 16px', backgroundColor: '#F8F9FA', borderBottom: '1px solid #E9ECEF' }}>
            <Group justify="space-between" mb={8}>
              <Group gap={8}>
                <IconUser size={16} color="#868E96" />
                <Text size="sm" fw={500}>
                  You
                </Text>
              </Group>
              <Text size="xs" c="dimmed">
                Now
              </Text>
            </Group>
            <Text size="xs" c="dimmed" mb={4}>
              To: john.doe@example.com
            </Text>
            <Text size="sm" fw={600}>
              {renderPreview(data.subject) || 'Subject line will appear here'}
            </Text>
          </div>

          {/* Email Body */}
          <div style={{ padding: '20px', backgroundColor: '#FFFFFF' }}>
            <div style={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit', fontSize: '14px', lineHeight: '1.6' }}>
              {renderPreview(data.body) || 'Email body will appear here...'}
            </div>

            {!data.body && (
              <Text size="sm" c="dimmed" ta="center" py="xl" style={{ fontStyle: 'italic' }}>
                Start typing your email to see the preview
              </Text>
            )}
          </div>

          {/* Email Footer */}
          <div style={{ padding: '12px 16px', backgroundColor: '#F8F9FA', borderTop: '1px solid #E9ECEF' }}>
            <Text size="xs" c="dimmed">
              Variables used in this template:
            </Text>
            <Group gap={4} mt={8}>
              {Object.keys(sampleData).filter(v => 
                data.subject?.includes(v) || data.body?.includes(v)
              ).map(variable => (
                <Badge key={variable} size="xs" variant="light">
                  {variable}
                </Badge>
              ))}
              {Object.keys(sampleData).filter(v => 
                data.subject?.includes(v) || data.body?.includes(v)
              ).length === 0 && (
                <Text size="xs" c="dimmed" style={{ fontStyle: 'italic' }}>
                  No variables used yet
                </Text>
              )}
            </Group>
          </div>
        </Paper>
      </Stack>
    </Card>
  )
}
