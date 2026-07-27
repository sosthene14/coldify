import { Outlet, createRootRoute, useLocation, useNavigate } from '@tanstack/react-router'
import { Alert, Center, Loader, MantineProvider, createTheme } from '@mantine/core'

import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'

import '../styles.css'
import { Header } from '../components/Header'
import { useSession, signOut, authClient } from '#/lib/auth-client'
import { useEffect, useState } from 'react';

export const Route = createRootRoute({
  component: RootComponent,
})

const theme = createTheme({
  primaryColor: 'brand',
  components: {
    Input: {
      styles: {
        input: { fontWeight: 500 },
      },
    },
    Alert: {
      styles: {
        message: { fontWeight: 500 },
      },
    },
    Checkbox: {
      styles: {
        label: { fontWeight: 400 },
      },
    },
     Menu: {
      styles: {
        item: { fontSize: '14px', fontWeight: 500 },
      },
    },
  },
  colors: {
    brand: [
      '#eaf3ff', '#d3e4ff', '#a5c6ff', '#75a8ff', '#4d8dff',
      '#3b7cf5', '#2e6de0', '#2359c2', '#1a49a3', '#0f3785',
    ],
  },
})

const PUBLIC_ROUTES = ['/login', '/register', '/verify-email', '/forgot-password', '/reset-password']
const ONBOARDING_ROUTE = '/onboarding'

function RootComponent() {
  const location = useLocation()
  const navigate = useNavigate()
  const { data: session, isPending } = useSession()
  const isPublicRoute = PUBLIC_ROUTES.some(route => location.pathname.startsWith(route))
  const isOnboardingRoute = location.pathname.startsWith(ONBOARDING_ROUTE)

  // null = pas encore vérifié, true/false = résultat connu
  const [hasOrganization, setHasOrganization] = useState<boolean | null>(null)

  const showHeader = location.pathname.startsWith('/dashboard') && session?.user

  // Vérifie si l'utilisateur a une organisation, dès qu'une session existe
  useEffect(() => {
    const checkOrganization = async () => {
      if (!session?.user) {
        setHasOrganization(null)
        return
      }

      const { data: organizations } = await authClient.organization.list()
      setHasOrganization(Boolean(organizations && organizations.length > 0))
    }

    if (!isPending) {
      checkOrganization()
    }
  }, [isPending, session])

  useEffect(() => {
    if (isPending) return // attendre que la session soit résolue

    // Pas connecté et route protégée → login
    if (!session?.user && !isPublicRoute) {
      navigate({ to: '/login' })
      return
    }

    // Connecté mais sur une route publique (login/register) → dashboard ou onboarding
    if (session?.user && isPublicRoute) {
      if (hasOrganization === null) return // attendre la vérification d'organisation
      navigate({ to: hasOrganization ? '/dashboard' : '/onboarding' })
      return
    }

    // Connecté, hors route publique, hors onboarding, mais sans organisation
    // → un petit malin qui essaie d'accéder au dashboard directement
    if (session?.user && !isPublicRoute && !isOnboardingRoute) {
      if (hasOrganization === null) return // attendre la vérification
      if (!hasOrganization) {
        navigate({ to: '/onboarding' })
      }
    }

    // Connecté, a déjà une organisation, mais essaie d'accéder à /onboarding → dashboard
    if (session?.user && isOnboardingRoute && hasOrganization === true) {
      navigate({ to: '/dashboard' })
    }
  }, [isPending, session, isPublicRoute, isOnboardingRoute, hasOrganization, location.pathname])

  const handleLogout = async () => {
    await signOut()
  }

  if (isPending) {
    return (
      <MantineProvider theme={theme}>
        <Center h="100vh">
          <Loader color="brand" size="lg" />
        </Center>
      </MantineProvider>
    )
  }

  return (
    <div>
      <MantineProvider theme={theme}>
        {showHeader && (
          <Header
            user={{
              name: `${session.user.firstName || ''} ${session.user.lastName || ''}`.trim() || session.user.email,
              role: 'User',
            }}
            notificationCount={3}
            onLogout={handleLogout}
          />
        )}

        <Outlet />
        <TanStackDevtools
          config={{ position: 'bottom-right' }}
          plugins={[
            {
              name: 'TanStack Router',
              render: <TanStackRouterDevtoolsPanel />,
            },
          ]}
        />
      </MantineProvider>
    </div>
  )
}