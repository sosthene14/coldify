import { Outlet, createRootRoute, useLocation, useNavigate } from '@tanstack/react-router'
import {  Center, Loader, MantineProvider, createTheme } from '@mantine/core'
import { ModalsProvider } from '@mantine/modals'
import { useEmailTracking } from "#/hooks/useEmailTracking";

import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'

import '../styles.css'
import { Header } from '../components/Header'
import { useSession, signOut, authClient, is2FAInProgress } from '#/lib/auth-client'
import { useEffect, useState } from 'react';
import { PWAInstallPrompt } from '../components/PWAInstallPrompt'
import { PWAUpdatePrompt } from '../components/PWAUpdatePrompt'
import { OnboardingTour } from '../components/OnboardingTour'
import { PushNotificationPrompt } from '../components/PushNotificationPrompt'
import {Toaster} from 'react-hot-toast';
import { DatesProvider } from '@mantine/dates';
import { useTranslation } from 'react-i18next';


export const Route = createRootRoute({
  component: RootComponent,
})

const theme = createTheme({
  primaryColor: 'brand',

  components: {
    Checkbox: {
      styles: {
        label: { fontWeight: 400 },
      },
    },

    RichTextEditor: {
      styles: {
        content: { fontWeight: 400 },
      },
    },

    Switch: {
      styles: {
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

const PUBLIC_ROUTES = ['/login', '/register', '/verify-email', '/forgot-password', '/reset-password', '/auth/error', '/privacy', '/terms']

function RootComponent() {
  const location = useLocation()
  const navigate = useNavigate()
  const { data: session, isPending } = useSession()
  const isPublicRoute = PUBLIC_ROUTES.some(route => location.pathname.startsWith(route))
  const { i18n } = useTranslation();

  const {data} = useSession()
  

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

  useEmailTracking(data?.user?.id as string);

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

  // Assurer qu'une subscription par défaut existe (fallback)
  useEffect(() => {
    const ensureSubscription = async () => {
      if (!session?.user || !hasOrganization) return

      try {
        await fetch(`${import.meta.env.VITE_API_URL}/subscriptions/ensure-default`, {
          method: 'POST',
          credentials: 'include',
        })
      } catch (error) {
        console.error('[Root] Failed to ensure default subscription:', error)
      }
    }

    if (hasOrganization === true) {
      ensureSubscription()
    }
  }, [session, hasOrganization])

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
  position="top-center"
  toastOptions={{
    duration: 3000,
    style: {
      color: '#1f2937',
      border: '1px solid #e5e7eb',
      borderRadius: '6px',
     
      fontSize: '13px',
      fontWeight: 400,
    },
  }}
/>
        <ModalsProvider>
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
          {showHeader && <OnboardingTour userId={session.user.id} />}
          {showHeader && <PushNotificationPrompt userId={session.user.id} />}
          
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