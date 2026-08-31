import { Outlet, createRootRoute, useLocation, useNavigate } from '@tanstack/react-router'
import {  Center, Loader, MantineProvider, createTheme } from '@mantine/core'
import { Notifications } from '@mantine/notifications'
import { ModalsProvider } from '@mantine/modals'

import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'

import '../styles.css'
import { Header } from '../components/Header'
import { useSession, signOut, authClient, is2FAInProgress } from '#/lib/auth-client'
import { useEffect, useState } from 'react';
import { PWAInstallPrompt } from '../components/PWAInstallPrompt'
import { PWAUpdatePrompt } from '../components/PWAUpdatePrompt'
import {Toaster} from 'react-hot-toast';
import { DatesProvider } from '@mantine/dates';
import { useTranslation } from 'react-i18next';


export const Route = createRootRoute({
  component: RootComponent,
})

const theme = createTheme({
  primaryColor: 'brand',

  components: {
    Text: {
      styles: {
        root: {
          fontWeight: 500,
        },
      },
    },

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
        item: {
          fontSize: '14px',
          fontWeight: 500,
        },
      },
    },

    Select: {
      styles: {
        input: { fontWeight: 500 },
        option: { fontWeight: 500 },
      },
    },

    Tabs: {
      styles: {
        tab: {
          fontWeight: 500,
        },
        tabLabel: {
          fontWeight: 500,
        },
      },
    },

    RichTextEditor: {
      styles: {
        content: {
          fontWeight: 300,
        },
      },
    },

    Switch: {
      styles: {
        label: { fontWeight: 500 },
        description: { fontWeight: 400 },
      },
    },
  },

  colors: {
    brand: [
      '#eaf3ff',
      '#d3e4ff',
      '#a5c6ff',
      '#75a8ff',
      '#4d8dff',
      '#3b7cf5',
      '#2e6de0',
      '#2359c2',
      '#1a49a3',
      '#0f3785',
    ],
  },
});

const PUBLIC_ROUTES = ['/login', '/register', '/verify-email', '/forgot-password', '/reset-password']

function RootComponent() {
  const location = useLocation()
  const navigate = useNavigate()
  const { data: session, isPending } = useSession()
  const isPublicRoute = PUBLIC_ROUTES.some(route => location.pathname.startsWith(route))
  const { i18n } = useTranslation();

  // null = pas encore vérifié, true/false = résultat connu
  const [hasOrganization, setHasOrganization] = useState<boolean | null>(null)
  
  // État pour suivre si on est en processus 2FA
  const [in2FAProcess, setIn2FAProcess] = useState(() => is2FAInProgress())

  const showHeader = location.pathname.startsWith('/dashboard') && session?.user

  // Écouter les changements d'état 2FA
  useEffect(() => {
    const handleStatusChange = (event: Event) => {
      const customEvent = event as CustomEvent<{ inProgress: boolean }>
      setIn2FAProcess(customEvent.detail.inProgress)
    }

    window.addEventListener('2fa-status-changed', handleStatusChange)
    return () => window.removeEventListener('2fa-status-changed', handleStatusChange)
  }, [])

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
    if (isPending && !isPublicRoute) return // attendre que la session soit résolue pour les routes protégées

    // Ne pas rediriger si on est en train de faire la 2FA
    if (in2FAProcess && location.pathname === '/login') {
      return
    }

    // Pas connecté et route protégée → login
    if (!session?.user && !isPublicRoute) {
      navigate({ to: '/login' })
      return
    }

    // Connecté mais sur une route publique (login/register) → dashboard ou onboarding
    if (session?.user && isPublicRoute) {
      if (hasOrganization === null) return // attendre la vérification d'organisation
      navigate({ to: '/dashboard'})
      return
    }

 

  }, [isPending, session, isPublicRoute, hasOrganization, location.pathname, in2FAProcess])

  const handleLogout = async () => {
    await signOut()
  }

  // Ne pas afficher le loader global sur les routes publiques
  // car ces pages ont leur propre gestion du loading
  if (isPending && !isPublicRoute) {
    return (
      <MantineProvider theme={theme}>
        <ModalsProvider>
          <Notifications position="top-right" />
          <Center h="100vh">
            <Loader size="sm" />
          </Center>
        </ModalsProvider>
      </MantineProvider>
    )
  }

  return (
    <div>
      <DatesProvider settings={{ locale: i18n.language }}>

      <MantineProvider theme={theme}>
     <Toaster
  position="top-right"
  toastOptions={{
    duration: 3000,
    style: {
      color: '#1f2937',
      border: '1px solid #e5e7eb',
      borderRadius: '8px',
     
      fontSize: '14px',
      fontWeight: 500,
    },
  }}
/>
        <ModalsProvider>
          <Notifications position='top-right' />
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
<div className='bg-gray-50/10'>
<Outlet />
</div>
          
          {/* PWA Components */}
          <PWAInstallPrompt />
          <PWAUpdatePrompt />
          
          <TanStackDevtools
            config={{ position: 'bottom-right' }}
            plugins={[
              {
                name: 'TanStack Router',
                render: <TanStackRouterDevtoolsPanel />,
              },
            ]}
          />
        </ModalsProvider>
      </MantineProvider>
       </DatesProvider>
    </div>
  )
}