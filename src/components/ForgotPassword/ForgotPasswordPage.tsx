// ForgotPasswordPage.tsx
import { useState } from 'react'
import { TextInput, Button, Stack, Text, ThemeIcon, Alert } from '@mantine/core'
import { IconMailCheck } from '@tabler/icons-react'
import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { AuthLayout } from '../Layout/AuthLayout'
import { authClient } from '#/lib/auth-client.ts'

export function ForgotPasswordPage() {
  const { t } = useTranslation()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error: resetError } = await authClient.requestPasswordReset({
      email,
      redirectTo:`${import.meta.env.VITE_FRONTEND_URL}/reset-password`,
    })

    setLoading(false)

    if (resetError) {
      setError(resetError.message ?? t('error_occurred'))
      return
    }

    setSent(true)
  }

  if (sent) {
    return (
      <AuthLayout title={t('check_your_inbox')} subtitle={t('reset_link_sent')}>
        <Stack align="center" gap="md" py="xl">
          <ThemeIcon color="blue" variant="light" radius="xl" size={56}>
            <IconMailCheck size={28} />
          </ThemeIcon>
          <Text size="sm" c="dimmed" ta="center">
            {t('reset_link_message', { email })}
          </Text>
          <Button component={Link} to="/login" variant="default" radius="md" fullWidth mt="sm">
            {t('back_to_login')}
          </Button>
        </Stack>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout title={t('forgot_password_title')} subtitle={t('enter_email_reset')}>
      <Stack gap="sm">
        {error && (
          <Alert color="red" radius="md">
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Stack gap="sm">
            <TextInput
              label={t('email')}
              placeholder={t('you_company_com')}
              value={email}
              onChange={(e) => setEmail(e.currentTarget.value)}
              radius="md"
              required
            />

            <Button type="submit" color="blue" radius="md" fullWidth mt="xs" loading={loading}>
              {t('send_reset_link')}
            </Button>
          </Stack>
        </form>

        <Text size="sm" c="dimmed" ta="center">
          {t('remembered_password')}{' '}
          <Link className="text-blue-400" to="/login">
            {t('log_in')}
          </Link>
        </Text>
      </Stack>
    </AuthLayout>
  )
}