import { useState } from 'react'
import { Card, TextInput, Textarea, Stack, Text, Button, Group, NumberInput, ActionIcon, Badge, Accordion } from '@mantine/core'
import { IconPlus, IconTrash, IconMail, IconClock } from '@tabler/icons-react'
import type { CampaignFormData } from './CreateCampaign'

interface CampaignEmailSequenceProps {
  data: CampaignFormData
  onChange: (updates: Partial<CampaignFormData>) => void
}

export function CampaignEmailSequence({ data, onChange }: CampaignEmailSequenceProps) {
  const [activeEmail, setActiveEmail] = useState<string>('1')

  const addEmail = () => {
    const newEmail = {
      id: String(data.emails.length + 1),
      subject: '',
      body: '',
      delayDays: data.emails.length > 0 ? 3 : 0
    }
    onChange({ emails: [...data.emails, newEmail] })
    setActiveEmail(newEmail.id)
  }

  const removeEmail = (id: string) => {
    if (data.emails.length > 1) {
      onChange({ emails: data.emails.filter((e) => e.id !== id) })
    }
  }

  const updateEmail = (id: string, field: string, value: string | number) => {
    const updatedEmails = data.emails.map((email) =>
      email.id === id ? { ...email, [field]: value } : email
    )
    onChange({ emails: updatedEmails })
  }

  return (
    <Card withBorder radius="md" p="xl" bg="white" mt="md">
      <Stack gap="lg">
        <div>
          <Group justify="space-between" align="center">
            <div>
              <Text fw={600} size="lg" mb="xs">
                Email Sequence
              </Text>
              <Text size="sm" c="dimmed">
                Create a series of follow-up emails to maximize engagement
              </Text>
            </div>
            <Badge size="lg" color="blue" variant="light">
              {data.emails.length} {data.emails.length === 1 ? 'Email' : 'Emails'}
            </Badge>
          </Group>
        </div>

        <Accordion 
          value={activeEmail} 
          onChange={setActiveEmail}
          variant="separated"
          radius="md"
        >
          {data.emails.map((email, index) => (
            <Accordion.Item key={email.id} value={email.id}>
              <Accordion.Control icon={<IconMail size={18} />}>
                <Group justify="space-between" wrap="nowrap" mr="md">
                  <div>
                    <Text fw={500}>
                      {index === 0 ? 'Initial Email' : `Follow-up ${index}`}
                    </Text>
                    {email.subject && (
                      <Text size="xs" c="dimmed" truncate>
                        {email.subject}
                      </Text>
                    )}
                  </div>
                  {index > 0 && (
                    <Badge size="sm" color="gray" variant="light" leftSection={<IconClock size={12} />}>
                      Day {email.delayDays}
                    </Badge>
                  )}
                </Group>
              </Accordion.Control>

              <Accordion.Panel>
                <Stack gap="md">
                  {index > 0 && (
                    <NumberInput
                      label="Delay (days)"
                      description="Days after previous email"
                      min={1}
                      max={30}
                      value={email.delayDays}
                      onChange={(value) => updateEmail(email.id, 'delayDays', Number(value))}
                      size="sm"
                    />
                  )}

                  <TextInput
                    label="Subject Line"
                    placeholder="e.g., Quick question about [Company Name]"
                    value={email.subject}
                    onChange={(e) => updateEmail(email.id, 'subject', e.currentTarget.value)}
                    required
                    size="md"
                  />

                  <Textarea
                    label="Email Body"
                    placeholder="Hi {{firstName}},&#10;&#10;I noticed that {{companyName}} is..."
                    minRows={8}
                    value={email.body}
                    onChange={(e) => updateEmail(email.id, 'body', e.currentTarget.value)}
                    required
                    size="md"
                    description="Use {{firstName}}, {{lastName}}, {{companyName}} for personalization"
                  />

                  {data.emails.length > 1 && (
                    <Group justify="flex-end">
                      <Button
                        variant="subtle"
                        color="red"
                        size="sm"
                        leftSection={<IconTrash size={16} />}
                        onClick={() => removeEmail(email.id)}
                      >
                        Remove this email
                      </Button>
                    </Group>
                  )}
                </Stack>
              </Accordion.Panel>
            </Accordion.Item>
          ))}
        </Accordion>

        <Button
          variant="light"
          color="indigo"
          leftSection={<IconPlus size={18} />}
          onClick={addEmail}
          fullWidth
        >
          Add Follow-up Email
        </Button>

        <Card withBorder p="sm" radius="md" bg="blue.0">
          <Text size="xs" c="dimmed">
            <strong>Pro tip:</strong> A sequence of 3-5 emails typically yields the best results. 
            Space them 2-4 days apart for optimal engagement.
          </Text>
        </Card>
      </Stack>
    </Card>
  )
}
