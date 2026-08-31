import { useEffect, useState } from 'react'
import {
  Card, Stack, Group, Button, Text, Badge, Menu, ActionIcon,
  Loader, Alert, SimpleGrid, List, ThemeIcon, Table, Modal, TextInput,
} from '@mantine/core'
import { useTranslation } from 'react-i18next'
import {
  IconDots, IconEdit, IconRefresh, IconTrash,
  IconAlertCircle, IconMail, IconCheck, IconInfoCircle, IconSend,
} from '@tabler/icons-react'
import { SiGmail } from 'react-icons/si'
import { SectionHeader } from '../components/SectionHeader'
import { SmtpConfigModal } from '../components/SmtpConfigModal'
import { QuotaDisplay } from '../../shared/QuotaDisplay'
import { useMailboxStore } from '../../../stores/mailbox.store'
import { useQuotaStore } from '../../../stores/quota.store'
import type { Mailbox } from '../../../services/mailbox.service'
import { modals } from '@mantine/modals'
import { notifications } from '@mantine/notifications'

type ProviderKey = 'gmail' | 'smtp'

const PROVIDERS: {
  key: ProviderKey
  label: string
  description: string
  features: string[]
  icon?: React.ComponentType<{ size?: number; color?: string }>
  image?: string
  available: boolean
}[] = [
  {
    key: 'gmail',
    label: 'Gmail',
    description: 'gmail_description',
    features: ['secure_oauth2', 'send_emails', 'open_tracking', 'limit_2000_day'],
    icon: SiGmail,
    available: true,
  },
  {
    key: 'smtp',
    label: 'custom_smtp',
    description: 'smtp_description',
    features: ['smtp_connection', 'tls_ssl_supported', 'ports_465_587_25', 'advanced_config'],
    available: true,
  },
]

function ProviderLogo({ provider, size = 20 }: { provider: string; size?: number }) {
  const found = PROVIDERS.find((p) => p.key === provider)
  if (!found) return <IconMail size={size} color="var(--mantine-color-gray-6)" />
  if (found.image) {
    return <img src={found.image} alt={found.label} width={size} height={size} style={{ objectFit: 'contain' }} />
  }
  if (found.icon) {
    const Icon = found.icon
    return <Icon size={size} />
  }
  return <IconMail size={size} color="var(--mantine-color-gray-6)" />
}

export function MailboxesSection() {
  const { t } = useTranslation()
  const { mailboxes, loading, error, fetchMailboxes, connectGmail, disconnect, testConnection } =
    useMailboxStore()
  const { stats: quotaStats, fetchStats: fetchQuotaStats } = useQuotaStore()

  const [smtpModalOpen, setSmtpModalOpen] = useState(false)
  const [editingMailbox, setEditingMailbox] = useState<Mailbox | null>(null)
  const [testEmailModal, setTestEmailModal] = useState<{ open: boolean; mailboxId: string; email: string } | null>(null)
  const [testEmailAddress, setTestEmailAddress] = useState('')
  const [sendingTest, setSendingTest] = useState(false)

  useEffect(() => {
    fetchMailboxes()
    fetchQuotaStats()
  }, [])

  const handleConnect = async (provider: ProviderKey) => {
    if (provider === 'smtp') {
      setEditingMailbox(null) // Clear any editing state
      setSmtpModalOpen(true)
      return
    }
    
    if (provider === 'gmail') {
      try {
        await connectGmail()
      } catch (error: any) {
        notifications.show({ title: t('error_occurred'), message: error.message || t('failed_connect_gmail'), color: 'red' })
      }
    }
  }

  const handleEditSmtp = (mailbox: Mailbox) => {
    setEditingMailbox(mailbox)
    setSmtpModalOpen(true)
  }

  const handleCloseSmtpModal = () => {
    setSmtpModalOpen(false)
    setEditingMailbox(null)
  }

  const handleDisconnect = (id: string, email: string) => {
    modals.openConfirmModal({
      title: t('disconnect_mailbox_title'),
      children: (
        <Text size="sm">
          {t('disconnect_mailbox_confirm', { email })}
        </Text>
      ),
      labels: { confirm: t('disconnect_confirm'), cancel: t('cancel_confirm') },
      confirmProps: { color: 'red' },
      onConfirm: async () => {
        try {
          await disconnect(id)
          notifications.show({ 
            title: t('success'), 
            message: t('disconnect_success'), 
            color: 'green' 
          })
        } catch (error: any) {
          notifications.show({ 
            title: t('error_occurred'), 
            message: error.message || t('disconnect_failed'), 
            color: 'red' 
          })
        }
      },
    })
  }

  const handleTestConnection = async (id: string) => {
    try {
      const success = await testConnection(id)
      notifications.show({
        title: success ? t('success') : t('error_occurred'),
        message: success ? t('connection_test_passed') : t('connection_test_failed'),
        color: success ? 'green' : 'red',
      })
    } catch (error: any) {
      notifications.show({ title: t('error_occurred'), message: error.message || t('failed_test_connection'), color: 'red' })
    }
  }

  const handleSendTestEmail = async () => {
    if (!testEmailModal || !testEmailAddress) return

    setSendingTest(true)
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/mailboxes/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          mailboxId: testEmailModal.mailboxId,
          to: [testEmailAddress],
          subject: '✅ Test Email from So-mails',
          html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #3b82f6;">🎉 Your mailbox is working!</h2>
              <p>This is a test email sent from <strong>${testEmailModal.email}</strong></p>
              <p>If you received this email, your mailbox configuration is correct and working properly.</p>
              <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
              <p style="color: #6b7280; font-size: 14px;">
                Sent via So-mails - Email automation platform
              </p>
            </div>
          `,
        }),
      })

      const data = await response.json()

      if (data.success) {
        notifications.show({
          title: t('test_email_sent'),
          message: t('check_inbox_at', { email: testEmailAddress }),
          color: 'green',
        })
        setTestEmailModal(null)
        setTestEmailAddress('')
      } else {
        throw new Error(data.error || t('failed_send_test'))
      }
    } catch (error: any) {
      notifications.show({
        title: t('error_occurred'),
        message: error.message || t('failed_send_test'),
        color: 'red',
      })
    } finally {
      setSendingTest(false)
    }
  }

  return (
    <Stack gap="lg">
      <Group justify="space-between" align="flex-start">
        <SectionHeader
          title={t('mail_connectors')}
          description={t('mail_connectors_description')}
        />
      </Group>

      {/* Global Organization Email Quota */}
      {quotaStats && <QuotaDisplay stats={quotaStats} />}

      {error && (
        <Alert icon={<IconAlertCircle size={16} />} color="red">
          {error}
        </Alert>
      )}

      <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
        {PROVIDERS.map((p) => (
          <Card key={p.key} withBorder radius="md" p="lg" bg="white">
            <Stack gap="sm" h="100%">
              <ProviderLogo provider={p.key} size={28} />

              <div>
                <Text size="sm" fw={600}>{t(p.label)}</Text>
                <Text size="xs" c="dimmed" mt={2}>{t(p.description)}</Text>
              </div>



              <List spacing={4} size="xs" center icon={
                <ThemeIcon color="blue" size={14} radius="xl" variant="light">
                  <IconCheck size={10} />
                </ThemeIcon>
              }>
                {p.features.map((f) => (
                  <List.Item key={f} style={{fontWeight:'400'}}>{t(f)}</List.Item>
                ))}
              </List>

              <div style={{ marginTop: 'auto', paddingTop: 8 }}>
                <Button
                  fullWidth
                  radius="sm"
                  variant={p.available ? 'filled' : 'default'}
                  color="blue"
                  disabled={!p.available}
                  onClick={() => handleConnect(p.key)}
                >
                  {p.available ? `${t('connect')} ${t(p.label)}` : t('coming_soon')}
                </Button>
              </div>
            </Stack>
          </Card>
        ))}
      </SimpleGrid>

      <Card withBorder radius="md" p="lg" bg="white" mb='lg'>
        <Stack gap="md">
          <div>
            <Text size="md" fw={600}>{t('connected_providers')}</Text>
            <Text size="xs" c="dimmed">{t('manage_connections')}</Text>
          </div>

          {loading ? (
            <Group justify="center" py="xl">
              <Loader size="sm" />
            </Group>
          ) : mailboxes.length === 0 ? (
            <Stack align="center" gap="md" py="xl">
              <div
                style={{
                  width: 56, height: 56, borderRadius: '50%',
                  backgroundColor: 'var(--mantine-color-blue-0)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                <IconMail size={26} color="var(--mantine-color-blue-6)" stroke={1.5} />
              </div>
              <Text size="sm" c="dimmed" ta="center">
                {t('no_mailboxes_connected')}
              </Text>
            </Stack>
          ) : (
            <Table verticalSpacing="sm" horizontalSpacing="xs">
              <Table.Thead visibleFrom="sm">
                <Table.Tr>
                  <Table.Th>{t('provider')}</Table.Th>
                  <Table.Th>{t('status')}</Table.Th>
                  <Table.Th ta="right">{t('actions')}</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {mailboxes.map((mb) => (
                  <Table.Tr key={mb.id}>
                    <Table.Td>
                      {/* Desktop view */}
                      <Group gap={10} visibleFrom="sm">
                        <ProviderLogo provider={mb.provider} size={20} />
                        <div>
                          <Text size="sm" fw={500}>{mb.email}</Text>
                          <Text size="xs" c="dimmed">{mb.provider.toUpperCase()}</Text>
                        </div>
                      </Group>

                      {/* Mobile view - compact with status */}
                      <Stack gap={4} hiddenFrom="sm">
                        <Group gap={8} wrap="nowrap">
                          <ProviderLogo provider={mb.provider} size={18} />
                          <Text size="xs" fw={500} lineClamp={1} style={{ flex: 1 }}>
                            {mb.email}
                          </Text>
                        </Group>
                        <Group gap={6}>
                          <Badge
                            size="xs"
                            color={mb.status === 'connected' ? 'green' : 'red'}
                            variant="light"
                          >
                            {mb.status === 'connected' ? t('connected') : t('error')}
                          </Badge>
                          <Text size="xs" c="dimmed">{mb.provider.toUpperCase()}</Text>
                        </Group>
                      </Stack>
                    </Table.Td>
                    
                    <Table.Td visibleFrom="sm">
                      <Badge color={mb.status === 'connected' ? 'green' : 'red'} variant="light">
                        {mb.status === 'connected' ? t('connected') : t('auth_error')}
                      </Badge>
                    </Table.Td>
                    
                    <Table.Td>
                      <Group gap={4} justify="flex-end">
                        <Menu shadow="md" width='full'>
                          <Menu.Target>
                            <ActionIcon variant="subtle" color="gray" size="sm">
                              <IconDots size={16} />
                            </ActionIcon>
                          </Menu.Target>
                          <Menu.Dropdown>
                            {mb.provider === 'smtp' && (
                              <>
                                <Menu.Item leftSection={<IconEdit size={14} />} onClick={() => handleEditSmtp(mb)}>
                                  {t('edit_smtp_config')}
                                </Menu.Item>
                                <Menu.Divider />
                              </>
                            )}
                            <Menu.Item 
                              leftSection={<IconSend size={14} />} 
                              onClick={() => {
                                setTestEmailModal({ open: true, mailboxId: mb.id, email: mb.email })
                                setTestEmailAddress('')
                              }}
                            >
                              {t('send_test_email')}
                            </Menu.Item>
                            <Menu.Item leftSection={<IconEdit size={14} />} onClick={() => {
                              notifications.show({
                                title: t('edit_signature'),
                                message: t('signature_soon'),
                                color: 'blue',
                              })
                            }}>
                              {t('edit_signature')}
                            </Menu.Item>
                            {mb.provider === 'gmail' && (
                              <Menu.Item leftSection={<IconRefresh size={14} />} onClick={() => handleTestConnection(mb.id)}>
                                {t('test_connection')}
                              </Menu.Item>
                            )}
                            <Menu.Divider />
                            <Menu.Item color="red" leftSection={<IconTrash size={14} />} onClick={() => handleDisconnect(mb.id, mb.email)}>
                              {t('disconnect')}
                            </Menu.Item>
                          </Menu.Dropdown>
                        </Menu>
                      </Group>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          )}

          {mailboxes.some((mb) => mb.lastError) && (
            <Stack gap={6}>
              {mailboxes.filter((mb) => mb.lastError).map((mb) => (
                <Alert key={mb.id} icon={<IconAlertCircle size={14} />} color="red" variant="light">
                  <Text size="xs">{mb.email}: {mb.lastError}</Text>
                </Alert>
              ))}
            </Stack>
          )}
        </Stack>
      </Card>

      {/* SMTP Configuration Modal */}
      <SmtpConfigModal
        opened={smtpModalOpen}
        onClose={handleCloseSmtpModal}
        editingMailbox={editingMailbox}
      />

      {/* Test Email Modal */}
      <Modal
        opened={testEmailModal?.open || false}
        onClose={() => {
          setTestEmailModal(null)
          setTestEmailAddress('')
        }}
        title={t('send_test_email')}
        size="md"
      >
        <Stack gap="md">
          <Alert icon={<IconInfoCircle size={16} />} color="blue" variant="light">
            <Text size="sm">
              {t('send_test_email_from', { email: testEmailModal?.email })}
            </Text>
          </Alert>

          <TextInput
            label={t('recipient_email')}
            placeholder="your@email.com"
            value={testEmailAddress}
            onChange={(e) => setTestEmailAddress(e.target.value)}
            type="email"
            required
            description={t('enter_recipient_email')}
          />

          <Group justify="flex-end" mt="md">
            <Button 
              variant="default" 
              onClick={() => {
                setTestEmailModal(null)
                setTestEmailAddress('')
              }}
              disabled={sendingTest}
            >
              {t('cancel')}
            </Button>
            <Button 
              onClick={handleSendTestEmail}
              color="blue"
              loading={sendingTest}
              disabled={!testEmailAddress || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(testEmailAddress)}
              leftSection={<IconSend size={16} />}
            >
              {t('send_test_email')}
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Stack>
  )
}