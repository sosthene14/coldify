// ForgotPasswordPage.tsx
import { useState } from 'react'
import { TextInput, Button, Stack, Text, ThemeIcon, Alert } from '@mantine/core'
import { IconMailCheck } from '@tabler/icons-react'
import { Link } from '@tanstack/react-router'
import { AuthLayout } from '../Layout/AuthLayout'
import { authClient } from '#/lib/auth-client.ts'

export function ForgotPasswordPage() {
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
      setError(resetError.message ?? "Une erreur est survenue")
      return
    }

    setSent(true)
  }

  if (sent) {
    return (
      <AuthLayout title="Check your inbox" subtitle="We've sent you a reset link">
        <Stack align="center" gap="md" py="xl">
          <ThemeIcon color="blue" variant="light" radius="xl" size={56}>
            <IconMailCheck size={28} />
          </ThemeIcon>
          <Text size="sm" c="dimmed" ta="center">
            If an account exists for <Text span fw={500} c="dark.7">{email}</Text>, you'll receive a password reset link shortly.
          </Text>
          <Button component={Link} to="/login" variant="default" radius="md" fullWidth mt="sm">
            Back to login
          </Button>
        </Stack>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout title="Forgot password?" subtitle="Enter your email to reset your password">
      <Stack gap="sm">
        {error && (
          <Alert color="red" radius="md">
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Stack gap="sm">
            <TextInput
              label="Email"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.currentTarget.value)}
              radius="md"
              required
            />

            <Button type="submit" color="blue" radius="md" fullWidth mt="xs" loading={loading}>
              Send reset link
            </Button>
          </Stack>
        </form>

        <Text size="sm" c="dimmed" ta="center">
          Remembered your password?{' '}
          <Link className="text-blue-400" to="/login">
            Log in
          </Link>
        </Text>
      </Stack>
    </AuthLayout>
  )
}