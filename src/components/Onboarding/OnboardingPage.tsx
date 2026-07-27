// components/Onboarding/OnboardingPage.tsx
import { useEffect, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { TextInput, Button, Stack, Text, Title, Alert } from '@mantine/core'
import { authClient, useSession } from '#/lib/auth-client'

export function OnboardingPage() {
  const navigate = useNavigate()
  const { data: session, isPending: sessionLoading } = useSession()

  const [organizationName, setOrganizationName] = useState('')
  const [loading, setLoading] = useState(false)
  const [checkingOrg, setCheckingOrg] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Vérifie si l'utilisateur a déjà une organisation
  useEffect(() => {
    const checkExistingOrg = async () => {
      if (!session?.user) return

      const { data: organizations } = await authClient.organization.list()

      if (organizations && organizations.length > 0) {
        navigate({ to: '/dashboard' })
        return
      }

      setCheckingOrg(false)
    }

    if (!sessionLoading && session?.user) {
      checkExistingOrg()
    }
  }, [sessionLoading, session])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const slug = organizationName
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '')

    const { error: orgError } = await authClient.organization.create({
      name: organizationName,
      slug,
    })

    setLoading(false)

    if (orgError) {
      setError(orgError.message ?? "Impossible de créer l'organisation")
      return
    }

     
  }

  if (sessionLoading || checkingOrg) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-sm">
        <Stack gap="md">
          <div>
            <Title order={2}>Créer votre organisation</Title>
            <Text size="sm" c="dimmed" mt={4}>
              Donnez un nom à votre espace de travail pour commencer à gérer vos campagnes.
            </Text>
          </div>

          {error && (
            <Alert color="red" radius="md">
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <Stack gap="sm">
              <TextInput
                label="Nom de l'organisation"
                placeholder="Acme Inc."
                value={organizationName}
                onChange={(e) => setOrganizationName(e.currentTarget.value)}
                radius="md"
                required
                autoFocus
              />

              <Button type="submit" color="blue" radius="md" fullWidth mt="xs" loading={loading}>
                Continuer
              </Button>
            </Stack>
          </form>
        </Stack>
      </div>
    </div>
  )
}