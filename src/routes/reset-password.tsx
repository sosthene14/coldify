import { createFileRoute, useNavigate, useSearch } from '@tanstack/react-router'
import { useState } from 'react'
import { PasswordInput, Button, Text, Stack, Alert } from '@mantine/core'
import { AuthLayout } from '#/components/Layout/AuthLayout'
import { authClient } from '#/lib/auth-client'

export const Route = createFileRoute('/reset-password')({
  component: ResetPasswordPage,
})

function ResetPasswordPage() {
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
      setError('Les mots de passe ne correspondent pas')
      setLoading(false)
      return
    }

    if (password.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères')
      setLoading(false)
      return
    }

    try {
      const token = searchParams.token

      if (!token) {
        setError('Token de réinitialisation manquant')
        setLoading(false)
        return
      }

      const { error: resetError } = await authClient.resetPassword({
        newPassword: password,
        token,
      })

      if (resetError) {
        setError(resetError.message ?? 'Impossible de réinitialiser le mot de passe')
      } else {
        navigate({ to: '/login' })
      }
    } catch {
      setError('Une erreur inattendue est survenue')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout title="Nouveau mot de passe" subtitle="Entre ton nouveau mot de passe">
      <Stack gap="md">
        {error && (
          <Alert color="red" radius="md">
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Stack gap="sm">
            <PasswordInput
              label="Nouveau mot de passe"
              placeholder="Au moins 8 caractères"
              value={password}
              onChange={(e) => setPassword(e.currentTarget.value)}
              radius="md"
              required
            />
            <PasswordInput
              label="Confirmer le mot de passe"
              placeholder="Retape ton mot de passe"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.currentTarget.value)}
              radius="md"
              required
            />

            <Button type="submit" color="blue" radius="md" fullWidth mt="xs" loading={loading}>
              Réinitialiser le mot de passe
            </Button>
          </Stack>
        </form>

        <Text size="xs" c="dimmed" ta="center">
          Après réinitialisation, tu seras redirigé vers la page de connexion
        </Text>
      </Stack>
    </AuthLayout>
  )
}
