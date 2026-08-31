
// components/MailboxSelector.tsx
import { Select, Text, Group, Badge } from '@mantine/core'
import { useQuotaStore } from '../../stores/quota.store'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

interface Mailbox {
  id: string
  email: string
  status: string
}

interface MailboxSelectorProps {
  selectedMailbox: string | null
  onChange: (value: string | null) => void
  mailboxes: Mailbox[]
}

export function MailboxSelector({ 
  selectedMailbox, 
  onChange, 
  mailboxes 
}: MailboxSelectorProps) {
  const { t } = useTranslation()
  const { stats, fetchStats } = useQuotaStore()

  useEffect(() => {
    fetchStats()
  }, [])

  const dailyUsed = stats?.dailyUsed || 0
  const dailyLimit = stats?.dailyLimit || 0
  const remaining = dailyLimit - dailyUsed

  return (
    <div>
      <Select
        label={
          <Group justify="space-between" w="100%">
            <Text size="sm" fw={500}>{t('from')}</Text>
            {stats && (
              <Badge 
                size="xs" 
                variant="light" 
                color={remaining < dailyLimit * 0.1 ? 'red' : remaining < dailyLimit * 0.3 ? 'orange' : 'blue'}
              >
                {t('sent_today_global', { used: dailyUsed, limit: dailyLimit })}
              </Badge>
            )}
          </Group>
        }
        placeholder={t('select_mailbox')}
        value={selectedMailbox}
        onChange={onChange}
        data={mailboxes.map((mb) => ({
          value: mb.id,
          label: mb.email,
        }))}
        required
      />
    </div>
  )
}