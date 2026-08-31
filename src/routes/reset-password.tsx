import { createFileRoute, useNavigate, useSearch } from '@tanstack/react-router'
import { useState } from 'react'
import { PasswordInput, Button, Text, Stack, Alert } from '@mantine/core'
import { useTranslation } from 'react-i18next'
import { AuthLayout } from '#/components/Layout/AuthLayout'
import { authClient } from '#/lib/auth-client'

export const Route = createFileRoute('/reset-password')({
  component: ResetPasswordPage,
})

function ResetPasswordPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const searchParams = useSearch({ strict: false }) as any
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    if (password !== confirmPassword) {
      setError(t('password_mismatch_error'))
      setLoading(false)
      return
    }

    if (password.length < 8) {
      setError(t('password_min_length_error'))
      setLoading(false)
      return
    }

    try {
      const token = searchParams.token

      if (!token) {
        setError(t('missing_reset_token'))
        setLoading(false)
        return
      }

      const { error: resetError } = await authClient.resetPassword({
        newPassword: password,
        token,
      })

      if (resetError) {
        setError(resetError.message ?? t('unable_reset_password'))
      } else {
        navigate({ to: '/login' })
      }
    } catch {
      setError(t('unexpected_error'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout title={t('new_password_title')} subtitle={t('enter_new_password_subtitle')}>
      <Stack gap="md">
        {error && (
          <Alert color="red" radius="md">
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Stack gap="sm">
            <PasswordInput
              label={t('new_password')}
              placeholder={t('at_least_8_chars')}
              value={password}
              onChange={(e) => setPassword(e.currentTarget.value)}
              radius="md"
              required
            />
            <PasswordInput
              label={t('confirm_password_label')}
              placeholder={t('retype_password_placeholder')}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.currentTarget.value)}
              radius="md"
              required
            />

            <Button type="submit" color="blue" radius="md" fullWidth mt="xs" loading={loading}>
              {t('reset_password_button')}
            </Button>
          </Stack>
        </form>

        <Text size="xs" c="dimmed" ta="center">
          {t('redirect_after_reset')}
        </Text>
      </Stack>
    </AuthLayout>
  )
}