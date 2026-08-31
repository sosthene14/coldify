// components/RecipientsSection.tsx
import { Group, ActionIcon, Alert, Text, Button } from '@mantine/core'
import { IconX } from '@tabler/icons-react'
import { useTranslation } from 'react-i18next'
import { EmailPillsInput } from './EmailPillsInput'

interface RecipientsSectionProps {
  to: string[]
  cc: string[]
  bcc: string[]
  showCc: boolean
  showBcc: boolean
  onToChange: (value: string[]) => void
  onCcChange: (value: string[]) => void
  onBccChange: (value: string[]) => void
  onToggleCc: () => void
  onToggleBcc: () => void
}

export function RecipientsSection({
  to,
  cc,
  bcc,
  showCc,
  showBcc,
  onToChange,
  onCcChange,
  onBccChange,
  onToggleCc,
  onToggleBcc,
}: RecipientsSectionProps) {
  const { t } = useTranslation()

  return (
    <>
      <EmailPillsInput
        label={t('to')}
        placeholder={t('recipient_placeholder')}
        value={to}
        onChange={onToChange}
        required
      />
      
      {to.length > 1 && (
        <Alert color="blue" variant="light" p="xs">
          <Text size="xs">
            {t('each_recipient_individual')}
          </Text>
        </Alert>
      )}

      <Group gap="xs">
        {!showCc && (
          <Button size="compact-sm" variant="subtle" onClick={onToggleCc}>
            {t('add_cc')}
          </Button>
        )}
        {!showBcc && (
          <Button size="compact-sm" variant="subtle" onClick={onToggleBcc}>
            {t('add_bcc')}
          </Button>
        )}
      </Group>

      {showCc && (
        <Group align="flex-start" gap="xs">
          <div style={{ flex: 1 }}>
            <EmailPillsInput
              label={t('cc')}
              placeholder="cc@example.com"
              value={cc}
              onChange={onCcChange}
            />
          </div>
          <ActionIcon
            variant="subtle"
            color="gray"
            onClick={() => {
              onCcChange([])
              onToggleCc()
            }}
            mt={28}
          >
            <IconX size={14} />
          </ActionIcon>
        </Group>
      )}

      {showBcc && (
        <Group align="flex-start" gap="xs">
          <div style={{ flex: 1 }}>
            <EmailPillsInput
              label={t('bcc')}
              placeholder="bcc@example.com"
              value={bcc}
              onChange={onBccChange}
            />
          </div>
          <ActionIcon
            variant="subtle"
            color="gray"
            onClick={() => {
              onBccChange([])
              onToggleBcc()
            }}
            mt={28}
          >
            <IconX size={14} />
          </ActionIcon>
        </Group>
      )}
    </>
  )
}