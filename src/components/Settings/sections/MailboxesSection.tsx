import { useEffect, useState } from 'react'
import {
  Card, Stack, Group, Button, Text, Badge, Menu, ActionIcon,
  Loader, Alert, SimpleGrid, List, ThemeIcon, Table, Modal, TextInput, Anchor,
} from '@mantine/core'
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
    description: 'Connectez votre compte Gmail ou Google Workspace.',
    features: ['OAuth2 sécurisé', 'Envoi d\'emails', 'Suivi des ouvertures', 'Limite : 2 000 emails/jour'],
    icon: SiGmail,
    available: true,
  },
  {
    key: 'smtp',
    label: 'SMTP personnalisé',
    description: 'Utilisez votre propre serveur SMTP pour envoyer des emails.',
    features: ['Connexion SMTP', 'TLS/SSL supporté', 'Ports 465, 587, 25', 'Configuration avancée'],
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
        notifications.show({ title: 'Error', message: error.message || 'Failed to connect Gmail', color: 'red' })
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
      title: 'Déconnecter la boîte mail',
      children: (
        <Text size="sm">
          Êtes-vous sûr de vouloir déconnecter <strong>{email}</strong> ? Cette action est irréversible.
        </Text>
      ),
      labels: { confirm: 'Déconnecter', cancel: 'Annuler' },
      confirmProps: { color: 'red' },
      onConfirm: async () => {
        try {
          await disconnect(id)
          notifications.show({ 
            title: 'Succès', 
            message: 'Boîte mail déconnectée avec succès', 
            color: 'green' 
          })
        } catch (error: any) {
          notifications.show({ 
            title: 'Erreur', 
            message: error.message || 'Échec de la déconnexion', 
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
        title: success ? 'Success' : 'Error',
        message: success ? 'Connection test passed' : 'Connection test failed',
        color: success ? 'green' : 'red',
      })
    } catch (error: any) {
      notifications.show({ title: 'Error', message: error.message || 'Failed to test connection', color: 'red' })
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
          title: 'Test email sent!',
          message: `Check your inbox at ${testEmailAddress}`,
          color: 'green',
        })
        setTestEmailModal(null)
        setTestEmailAddress('')
      } else {
        throw new Error(data.error || 'Failed to send test email')
      }
    } catch (error: any) {
      notifications.show({
        title: 'Error',
        message: error.message || 'Failed to send test email',
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
          title="Connecteurs de mail"
          description="Connectez vos fournisseurs de messagerie pour envoyer des emails via le service de votre choix."
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
                <Text size="sm" fw={600}>{p.label}</Text>
                <Text size="xs" c="dimmed" mt={2}>{p.description}</Text>
              </div>



              <List spacing={4} size="xs" center icon={
                <ThemeIcon color="blue" size={14} radius="xl" variant="light">
                  <IconCheck size={10} />
                </ThemeIcon>
              }>
                {p.features.map((f) => (
                  <List.Item key={f} style={{fontWeight:'400'}}>{f}</List.Item>
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
                  {p.available ? `Connecter ${p.label}` : 'Bientôt disponible'}
                </Button>
              </div>
            </Stack>
          </Card>
        ))}
      </SimpleGrid>

      <Card withBorder radius="md" p="lg" bg="white" mb='lg'>
        <Stack gap="md">
          <div>
            <Text size="md" fw={600}>Fournisseurs connectés</Text>
            <Text size="xs" c="dimmed">Gérez vos connexions actives et vos paramètres.</Text>
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
                No mailboxes connected yet. Connect an account above to start sending emails.
              </Text>
            </Stack>
          ) : (
            <Table verticalSpacing="sm" horizontalSpacing="xs">
              <Table.Thead visibleFrom="sm">
                <Table.Tr>
                  <Table.Th>Fournisseur</Table.Th>
                  <Table.Th>Statut</Table.Th>
                  <Table.Th ta="right">Actions</Table.Th>
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
                            {mb.status === 'connected' ? 'Connecté' : 'Erreur'}
                          </Badge>
                          <Text size="xs" c="dimmed">{mb.provider.toUpperCase()}</Text>
                        </Group>
                      </Stack>
                    </Table.Td>
                    
                    <Table.Td visibleFrom="sm">
                      <Badge color={mb.status === 'connected' ? 'green' : 'red'} variant="light">
                        {mb.status === 'connected' ? 'Connecté' : 'Erreur auth'}
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
                                  Edit SMTP config
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
                              Send test email
                            </Menu.Item>
                            <Menu.Item leftSection={<IconEdit size={14} />} onClick={() => {
                              notifications.show({
                                title: 'Edit Signature',
                                message: 'Signature editor will be available soon',
                                color: 'blue',
                              })
                            }}>
                              Edit signature
                            </Menu.Item>
                            {mb.provider === 'gmail' && (
                              <Menu.Item leftSection={<IconRefresh size={14} />} onClick={() => handleTestConnection(mb.id)}>
                                Test connection
                              </Menu.Item>
                            )}
                            <Menu.Divider />
                            <Menu.Item color="red" leftSection={<IconTrash size={14} />} onClick={() => handleDisconnect(mb.id, mb.email)}>
                              Disconnect
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
        title="Send test email"
        size="md"
      >
        <Stack gap="md">
          <Alert icon={<IconInfoCircle size={16} />} color="blue" variant="light">
            <Text size="sm">
              Send a test email from <strong>{testEmailModal?.email}</strong> to verify your mailbox configuration.
            </Text>
          </Alert>

          <TextInput
            label="Recipient email"
            placeholder="your@email.com"
            value={testEmailAddress}
            onChange={(e) => setTestEmailAddress(e.target.value)}
            type="email"
            required
            description="Enter the email address where you want to receive the test"
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
              Cancel
            </Button>
            <Button 
              onClick={handleSendTestEmail}
              color="blue"
              loading={sendingTest}
              disabled={!testEmailAddress || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(testEmailAddress)}
              leftSection={<IconSend size={16} />}
            >
              Send test email
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Stack>
  )
}