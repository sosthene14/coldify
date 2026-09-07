import { Alert, Button, Group, Stack, Text } from '@mantine/core'
import { IconAlertTriangle, IconArrowLeft, IconHome } from '@tabler/icons-react'
import { Link, createFileRoute } from '@tanstack/react-router'
import { AuthLayout } from '#/components/Layout/AuthLayout'

export const Route = createFileRoute('/auth/error')({
  validateSearch: (search: Record<string, unknown>) => ({
    error: typeof search.error === 'string' ? search.error : 'unknown_error',
    error_description:
      typeof search.error_description === 'string' ? search.error_description : undefined,
  }),
  component: AuthErrorPage,
})

function AuthErrorPage() {
  const { error, error_description: errorDescription } = Route.useSearch()

  return (
    <AuthLayout
      title="Impossible de terminer la connexion"
      subtitle="L'autorisation n'a pas pu être finalisée."
    >
      <Stack gap="lg">
        <Alert
          color="red"
          icon={<IconAlertTriangle size={20} />}
          title="Une erreur est survenue"
        >
          {errorDescription || "La connexion a été refusée ou interrompue. Vous pouvez réessayer."}
        </Alert>

        <Text size="sm" c="dimmed">
          Code d'erreur : <strong>{error}</strong>
        </Text>

        <Group grow>
          <Button component={Link} to="/login" leftSection={<IconArrowLeft size={16} />} variant="light">
            Réessayer
          </Button>
          <Button component={Link} to="/" leftSection={<IconHome size={16} />}>
            Accueil
          </Button>
        </Group>
      </Stack>
    </AuthLayout>
  )
}