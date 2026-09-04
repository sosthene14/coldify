import { useState, useEffect } from 'react'
import {
  Modal,
  Stack,
  TextInput,
  PasswordInput,
  NumberInput,
  Switch,
  Group,
  Button,
  Divider,
  Alert,
  Text,
} from '@mantine/core'
import { IconInfoCircle } from '@tabler/icons-react'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { useMailboxStore } from '../../../stores/mailbox.store'
import type { Mailbox } from '../../../services/mailbox.service'

interface SmtpConfigModalProps {
  opened: boolean
  onClose: () => void
  editingMailbox?: Mailbox | null
}

export function SmtpConfigModal({ opened, onClose, editingMailbox }: SmtpConfigModalProps) {
  const { t } = useTranslation()
  const { connectSmtp, updateSmtp } = useMailboxStore()
  const [loading, setLoading] = useState(false)
  const [config, setConfig] = useState({
    email: '',
    displayName: '',
    host: '',
    port: 587,
    username: '',
    password: '',
    secure: false,
  })

  // Load existing mailbox data when editing
  useEffect(() => {
    if (opened && editingMailbox) {
      setConfig({
        email: editingMailbox.email,
        displayName: (editingMailbox as any).metadata?.displayName || '',
        host: (editingMailbox as any).smtpHost || '',
        port: (editingMailbox as any).smtpPort || 587,
        username: (editingMailbox as any).smtpUsername || '',
        password: '', // Don't prefill password for security
        secure: (editingMailbox as any).smtpSecure || false,
      })
    } else if (opened && !editingMailbox) {
      // Reset form when creating new
      setConfig({
        email: '',
        displayName: '',
        host: '',
        port: 587,
        username: '',
        password: '',
        secure: false,
      })
    }
  }, [opened, editingMailbox])

  const handleSubmit = async () => {
    // Validate fields
    if (editingMailbox) {
      // When editing, only password is optional
      if (!config.host || !config.username) {
        toast.error(t('fill_required_fields'))
        return
      }
    } else {
      // When creating, all fields are required
      if (!config.email || !config.host || !config.username || !config.password) {
        toast.error(t('fill_required_fields'))
        return
      }
    }

    setLoading(true)
    try {
      if (editingMailbox) {
        // Update existing mailbox
        const updateData: any = {
          displayName: config.displayName || undefined,
          smtpHost: config.host,
          smtpPort: config.port,
          smtpUsername: config.username,
          smtpSecure: config.secure,
        }

        // Only include password if it was changed
        if (config.password) {
          updateData.smtpPassword = config.password
        }

        await updateSmtp(editingMailbox.id, updateData)

        toast.success(t('smtp_updated'))
      } else {
        // Create new mailbox
        await connectSmtp({
          email: config.email,
          displayName: config.displayName || undefined,
          smtpHost: config.host,
          smtpPort: config.port,
          smtpUsername: config.username,
          smtpPassword: config.password,
          smtpSecure: config.secure,
        })

        toast.success(t('smtp_connected'))
      }

      onClose()
    } catch (error: any) {
      toast.error(error.message || t('failed_send_test'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={editingMailbox ? t('edit_smtp_configuration') : t('configure_smtp')}
      size="lg"
    >
      <Stack gap="md">
        <TextInput
          label={t('email_address')}
          placeholder="your@email.com"
          required
          value={config.email}
          onChange={(e) => setConfig({ ...config, email: e.target.value })}
          disabled={!!editingMailbox} // Can't change email when editing
        />

        <TextInput
          label={t('display_name')}
          placeholder="Your Name"
          value={config.displayName}
          onChange={(e) => setConfig({ ...config, displayName: e.target.value })}
          description={t('sender_name')}
        />

        <Divider label={t('smtp_server_configuration')} />

        <TextInput
          label={t('smtp_host')}
          placeholder="smtp.example.com"
          required
          value={config.host}
          onChange={(e) => setConfig({ ...config, host: e.target.value })}
          description={t('smtp_server_address')}
        />

        <Group grow>
          <NumberInput
            label={t('port')}
            placeholder="587"
            required
            min={1}
            max={65535}
            value={config.port}
            onChange={(value) => setConfig({ ...config, port: value as number })}
            description={t('common_ports')}
          />
          <Switch
            label={t('use_ssl_tls')}
            checked={config.secure}
            onChange={(e) => setConfig({ ...config, secure: e.currentTarget.checked })}
            description={t('enable_port_465')}
            mt="xl"
          />
        </Group>

        <TextInput
          label={t('username')}
          placeholder="username"
          required
          value={config.username}
          onChange={(e) => setConfig({ ...config, username: e.target.value })}
          description={t('usually_email')}
        />

        <PasswordInput
          label={t('password')}
          placeholder="••••••••"
          required={!editingMailbox}
          value={config.password}
          onChange={(e) => setConfig({ ...config, password: e.target.value })}
          description={
            editingMailbox
              ? t('leave_blank_password')
              : t('smtp_password_hint')
          }
        />

        <Alert icon={<IconInfoCircle size={16} />} color="blue" variant="light">
          <Text size="xs">
            {t('smtp_gmail_info')}
          </Text>
        </Alert>

        <Group justify="flex-end" mt="md">
          <Button variant="default" onClick={onClose} disabled={loading}>
            {t('cancel')}
          </Button>
          <Button onClick={handleSubmit} color="blue" loading={loading}>
            {editingMailbox ? t('update_configuration') : t('connect_smtp')}
          </Button>
        </Group>
      </Stack>
    </Modal>
  )
}