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
import { notifications } from '@mantine/notifications'
import { useMailboxStore } from '../../../stores/mailbox.store'
import type { Mailbox } from '../../../services/mailbox.service'

interface SmtpConfigModalProps {
  opened: boolean
  onClose: () => void
  editingMailbox?: Mailbox | null
}

export function SmtpConfigModal({ opened, onClose, editingMailbox }: SmtpConfigModalProps) {
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
        notifications.show({
          title: 'Validation Error',
          message: 'Please fill in all required fields',
          color: 'red',
        })
        return
      }
    } else {
      // When creating, all fields are required
      if (!config.email || !config.host || !config.username || !config.password) {
        notifications.show({
          title: 'Validation Error',
          message: 'Please fill in all required fields',
          color: 'red',
        })
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

        notifications.show({
          title: 'Success',
          message: 'SMTP configuration updated successfully',
          color: 'green',
        })
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

        notifications.show({
          title: 'Success',
          message: 'SMTP mailbox connected successfully',
          color: 'green',
        })
      }

      onClose()
    } catch (error: any) {
      notifications.show({
        title: 'Error',
        message: error.message || `Failed to ${editingMailbox ? 'update' : 'connect'} SMTP mailbox`,
        color: 'red',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={editingMailbox ? 'Edit SMTP Configuration' : 'Configure SMTP'}
      size="lg"
    >
      <Stack gap="md">
        <TextInput
          label="Email Address"
          placeholder="your@email.com"
          required
          value={config.email}
          onChange={(e) => setConfig({ ...config, email: e.target.value })}
          disabled={!!editingMailbox} // Can't change email when editing
        />

        <TextInput
          label="Display Name"
          placeholder="Your Name"
          value={config.displayName}
          onChange={(e) => setConfig({ ...config, displayName: e.target.value })}
          description="The name that will appear as the sender"
        />

        <Divider label="SMTP Server Configuration" />

        <TextInput
          label="SMTP Host"
          placeholder="smtp.example.com"
          required
          value={config.host}
          onChange={(e) => setConfig({ ...config, host: e.target.value })}
          description="Your SMTP server address"
        />

        <Group grow>
          <NumberInput
            label="Port"
            placeholder="587"
            required
            min={1}
            max={65535}
            value={config.port}
            onChange={(value) => setConfig({ ...config, port: value as number })}
            description="Common: 587 (TLS), 465 (SSL), 25"
          />
          <Switch
            label="Use SSL/TLS"
            checked={config.secure}
            onChange={(e) => setConfig({ ...config, secure: e.currentTarget.checked })}
            description="Enable for port 465"
            mt="xl"
          />
        </Group>

        <TextInput
          label="Username"
          placeholder="username"
          required
          value={config.username}
          onChange={(e) => setConfig({ ...config, username: e.target.value })}
          description="Usually your email address"
        />

        <PasswordInput
          label="Password"
          placeholder="••••••••"
          required={!editingMailbox}
          value={config.password}
          onChange={(e) => setConfig({ ...config, password: e.target.value })}
          description={
            editingMailbox
              ? 'Leave blank to keep current password'
              : 'Your SMTP password or app-specific password'
          }
        />

        <Alert icon={<IconInfoCircle size={16} />} color="blue" variant="light">
          <Text size="xs">
            For Gmail, use port 587 with TLS and create an app-specific password.
            For most providers, use port 587 without SSL/TLS.
          </Text>
        </Alert>

        <Group justify="flex-end" mt="md">
          <Button variant="default" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="blue" loading={loading}>
            {editingMailbox ? 'Update Configuration' : 'Connect SMTP'}
          </Button>
        </Group>
      </Stack>
    </Modal>
  )
}
